import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

// Calculate similarity percentage
function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(a, b);
  return (maxLen - distance) / maxLen;
}

// Normalize text for comparison (uppercase, remove punctuation, trim)
function normalizeText(text: string): string {
  return text
    .toUpperCase()
    .replace(/[.,!?;:\-'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Sanitize text for storage paths (remove special Slovenian characters)
function sanitizeForStorage(text: string): string {
  const charMap: Record<string, string> = {
    'Č': 'C', 'č': 'c',
    'Š': 'S', 'š': 's',
    'Ž': 'Z', 'ž': 'z',
    'Đ': 'D', 'đ': 'd',
    'Ć': 'C', 'ć': 'c',
  };
  
  return text
    .split('')
    .map(char => charMap[char] || char)
    .join('')
    .replace(/[^a-zA-Z0-9\-_]/g, '');
}

// Check if transcribed word matches target or variants
function isWordAccepted(
  transcribed: string,
  targetWord: string,
  acceptedVariants: string[],
  similarityThreshold: number = 0.7
): { accepted: boolean; matchType: string; confidence: number } {
  const normalizedTranscribed = normalizeText(transcribed);
  const normalizedTarget = normalizeText(targetWord);
  
  // Check exact match with target
  if (normalizedTranscribed === normalizedTarget) {
    return { accepted: true, matchType: 'exact', confidence: 1.0 };
  }
  
  // Check exact match with variants
  for (const variant of acceptedVariants) {
    if (normalizedTranscribed === normalizeText(variant)) {
      return { accepted: true, matchType: 'variant', confidence: 1.0 };
    }
  }
  
  // Check similarity with target
  const targetSimilarity = similarity(normalizedTranscribed, normalizedTarget);
  if (targetSimilarity >= similarityThreshold) {
    return { accepted: true, matchType: 'similar_target', confidence: targetSimilarity };
  }
  
  // Check similarity with variants
  for (const variant of acceptedVariants) {
    const variantSimilarity = similarity(normalizedTranscribed, normalizeText(variant));
    if (variantSimilarity >= similarityThreshold) {
      return { accepted: true, matchType: 'similar_variant', confidence: variantSimilarity };
    }
  }
  
  return { accepted: false, matchType: 'no_match', confidence: targetSimilarity };
}

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768): Uint8Array {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      audio, 
      targetWord, 
      acceptedVariants = [],
      childId,
      userId,
      sessionNumber,
      wordIndex,
      letter
    } = await req.json();

    console.log(`Transcription request for word: ${targetWord}, letter: ${letter}, index: ${wordIndex}, session: ${sessionNumber}`);

    if (!audio) {
      throw new Error('No audio data provided');
    }

    if (!targetWord) {
      throw new Error('No target word provided');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Process audio from base64
    const binaryAudio = processBase64Chunks(audio);
    console.log(`Audio size: ${binaryAudio.length} bytes`);

    // Prepare form data for Whisper API
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'recording.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'sl'); // Slovenian
    formData.append('prompt', targetWord); // Hint for Whisper to improve recognition
    console.log(`Whisper API call with prompt hint: "${targetWord}"`);

    // Send to OpenAI Whisper API
    console.log('Sending to OpenAI Whisper API...');
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      console.error('Whisper API error:', whisperResponse.status, errorText);
      throw new Error(`Whisper API error: ${whisperResponse.status} - ${errorText}`);
    }

    const whisperResult = await whisperResponse.json();
    const transcribedText = (whisperResult.text || '').trim();
    console.log(`Transcribed text: "${transcribedText}"`);

    // Check for empty/silence transcription
    if (!transcribedText || transcribedText.length < 2) {
      console.log('Empty or too short transcription - likely silence');
      return new Response(
        JSON.stringify({
          success: true,
          transcribedText: '',
          targetWord,
          accepted: false,
          matchType: 'silence',
          confidence: 0,
          storagePath: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if word is accepted
    const matchResult = isWordAccepted(transcribedText, targetWord, acceptedVariants);
    console.log(`Match result:`, matchResult);

    // Save recording to Supabase Storage if childId and userId provided
    let storagePath = null;
    if (childId && userId) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        // Sanitize letter and word for storage path (remove special characters)
        const safeLetter = sanitizeForStorage(letter || 'X');
        const safeWord = sanitizeForStorage(targetWord);
        // Construct session folder from sessionNumber parameter
        const sessionFolder = `Seja-${sessionNumber || 1}`;
        // New unified storage structure with sessions: uporabniski-profili/{user_id}/{child_id}/Dokumenti/Preverjanje-izgovorjave/Seja-X/
        storagePath = `${userId}/${childId}/Dokumenti/Preverjanje-izgovorjave/${sessionFolder}/${safeLetter}-${wordIndex}-${safeWord}-${timestamp}.webm`;

        console.log(`Attempting to save recording to: ${storagePath}`);

        const { error: uploadError } = await supabase.storage
          .from('uporabniski-profili')
          .upload(storagePath, binaryAudio, {
            contentType: 'audio/webm',
            upsert: false
          });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          // Don't fail the whole request if storage fails
        } else {
          console.log(`Recording saved to: ${storagePath}`);
        }
      } catch (storageError) {
        console.error('Storage error:', storageError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        transcribedText,
        targetWord,
        accepted: matchResult.accepted,
        matchType: matchResult.matchType,
        confidence: matchResult.confidence,
        storagePath
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Transcription error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        accepted: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
