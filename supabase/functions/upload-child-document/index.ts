import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['application/pdf', 'text/plain'];
const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46]; // %PDF

interface VirusTotalAnalysis {
  data: {
    id: string;
    attributes: {
      status: string;
      stats: {
        malicious: number;
        suspicious: number;
        harmless: number;
        undetected: number;
      };
    };
  };
}

async function uploadToVirusTotal(fileBytes: Uint8Array, apiKey: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', new Blob([fileBytes]), 'document.pdf');

  const response = await fetch('https://www.virustotal.com/api/v3/files', {
    method: 'POST',
    headers: {
      'x-apikey': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('VirusTotal upload failed:', error);
    throw new Error(`VirusTotal upload failed: ${response.status}`);
  }

  const result = await response.json();
  console.log('VirusTotal upload result:', result);
  return result.data.id;
}

async function getVirusTotalAnalysis(analysisId: string, apiKey: string): Promise<VirusTotalAnalysis> {
  const response = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
    method: 'GET',
    headers: {
      'x-apikey': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`VirusTotal analysis fetch failed: ${response.status}`);
  }

  return response.json();
}

async function waitForVirusTotalResult(analysisId: string, apiKey: string, maxAttempts = 30): Promise<VirusTotalAnalysis> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const analysis = await getVirusTotalAnalysis(analysisId, apiKey);
    
    console.log(`VirusTotal analysis attempt ${attempt + 1}:`, analysis.data.attributes.status);
    
    if (analysis.data.attributes.status === 'completed') {
      return analysis;
    }
    
    // Wait 2 seconds before next check
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('VirusTotal analysis timeout');
}

function validateMagicBytes(bytes: Uint8Array, mimeType: string): boolean {
  if (mimeType === 'application/pdf') {
    // Check for %PDF magic bytes
    if (bytes.length < 4) return false;
    return bytes[0] === PDF_MAGIC_BYTES[0] &&
           bytes[1] === PDF_MAGIC_BYTES[1] &&
           bytes[2] === PDF_MAGIC_BYTES[2] &&
           bytes[3] === PDF_MAGIC_BYTES[3];
  }
  
  // For text/plain, we don't have specific magic bytes
  return mimeType === 'text/plain';
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth token from header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Manjka avtorizacija' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const virusTotalApiKey = Deno.env.get('VIRUSTOTAL_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verify JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Neveljavna avtorizacija' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id);

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const childId = formData.get('childId') as string | null;
    const documentType = formData.get('documentType') as string | null;
    const originalFilename = formData.get('originalFilename') as string | null;

    // Validate required fields
    if (!file || !childId || !documentType) {
      return new Response(
        JSON.stringify({ error: 'Manjkajo obvezna polja (file, childId, documentType)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('File received:', file.name, file.size, file.type);

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'Datoteka je prevelika. Največja dovoljena velikost je 5MB.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Nepodprta vrsta datoteke. Dovoljeni sta samo PDF in TXT.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file extension
    const fileName = originalFilename || file.name;
    const extension = fileName.toLowerCase().split('.').pop();
    if (file.type === 'application/pdf' && extension !== 'pdf') {
      return new Response(
        JSON.stringify({ error: 'Datoteka mora imeti končnico .pdf' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (file.type === 'text/plain' && extension !== 'txt') {
      return new Response(
        JSON.stringify({ error: 'Datoteka mora imeti končnico .txt' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify that child belongs to user
    const { data: childData, error: childError } = await supabase
      .from('children')
      .select('id, parent_id')
      .eq('id', childId)
      .single();

    if (childError || !childData) {
      console.error('Child not found:', childError);
      return new Response(
        JSON.stringify({ error: 'Otrok ni najden' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (childData.parent_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Nimate dovoljenja za nalaganje dokumentov za tega otroka' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Read file bytes
    const fileBytes = new Uint8Array(await file.arrayBuffer());

    // Validate magic bytes
    if (!validateMagicBytes(fileBytes, file.type)) {
      return new Response(
        JSON.stringify({ error: 'Vsebina datoteke ne ustreza tipu. Prosimo, naložite veljavno datoteko.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Magic bytes validated');

    let virusScanStatus = 'pending';
    let virusScanResult: any = null;

    // VirusTotal scan for PDF files
    if (virusTotalApiKey && file.type === 'application/pdf') {
      try {
        console.log('Starting VirusTotal scan...');
        
        // Upload file to VirusTotal
        const analysisId = await uploadToVirusTotal(fileBytes, virusTotalApiKey);
        console.log('VirusTotal analysis ID:', analysisId);
        
        // Wait for analysis result
        const analysis = await waitForVirusTotalResult(analysisId, virusTotalApiKey);
        const stats = analysis.data.attributes.stats;
        
        console.log('VirusTotal scan complete:', stats);
        
        virusScanResult = {
          analysisId,
          stats,
          scannedAt: new Date().toISOString(),
        };

        if (stats.malicious > 0 || stats.suspicious > 0) {
          virusScanStatus = 'infected';
          
          return new Response(
            JSON.stringify({ 
              error: 'Datoteka je bila označena kot potencialno nevarna in je bila zavrnjena.',
              virusScanResult 
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        virusScanStatus = 'clean';
        console.log('File is clean');
        
      } catch (virusError) {
        console.error('VirusTotal scan error:', virusError);
        virusScanStatus = 'error';
        virusScanResult = { error: String(virusError), scannedAt: new Date().toISOString() };
        // Continue with upload even if virus scan fails - log the error
      }
    } else if (!virusTotalApiKey) {
      console.log('VirusTotal API key not configured, skipping scan');
      virusScanStatus = 'pending';
    }

    // Generate storage path
    const timestamp = Date.now();
    const sanitizedFilename = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${user.id}/${childId}/prvi-stik/${timestamp}_${sanitizedFilename}`;

    console.log('Uploading to storage:', storagePath);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('child-documents')
      .upload(storagePath, fileBytes, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Napaka pri nalaganju datoteke: ' + uploadError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('File uploaded to storage:', uploadData.path);

    // Create document record in database
    const { data: documentData, error: documentError } = await supabase
      .from('child_documents')
      .insert({
        child_id: childId,
        uploaded_by: user.id,
        document_type: documentType,
        original_filename: fileName,
        storage_path: storagePath,
        file_size: file.size,
        virus_scan_status: virusScanStatus,
        virus_scan_result: virusScanResult,
      })
      .select()
      .single();

    if (documentError) {
      console.error('Database insert error:', documentError);
      // Try to clean up uploaded file
      await supabase.storage.from('child-documents').remove([storagePath]);
      
      return new Response(
        JSON.stringify({ error: 'Napaka pri shranjevanju dokumenta: ' + documentError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Document record created:', documentData.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        document: documentData,
        virusScanStatus,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Nepričakovana napaka: ' + String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
