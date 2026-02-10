import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = [
  "https://tomitalk.com",
  "https://www.tomitalk.com",
  "https://tomitalk.lovable.app",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

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

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(a, b);
  return (maxLen - distance) / maxLen;
}

function normalizeText(text: string): string {
  return text
    .toUpperCase()
    .replace(/[.,!?;:\\-'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

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

function getThresholdForWord(wordLength: number, difficulty: string): number {
  const thresholds: Record<string, Record<number, number>> = {
    nizka:   { 3: 0.0, 4: 0.0, 5: 0.0, 6: 0.0 },
    srednja: { 3: 0.33, 4: 0.50, 5: 0.50, 6: 0.50 },
    visoka:  { 3: 0.65, 4: 0.70, 5: 0.75, 6: 0.65 },
  };
  const len = Math.min(Math.max(wordLength, 3), 6);
  return thresholds[difficulty]?.[len] ?? thresholds.srednja[len];
}

function isWordAccepted(
  transcribed: string,
  targetWord: string,
  acceptedVariants: string[],
  difficulty: string = "srednja"
): { accepted: boolean; matchType: string; confidence: number } {
  const normalizedTranscribed = normalizeText(transcribed);
  const normalizedTarget = normalizeText(targetWord);
  const similarityThreshold = getThresholdForWord(normalizedTarget.length, difficulty);
  
  if (normalizedTranscribed === normalizedTarget) {
    return { accepted: true, matchType: 'exact', confidence: 1.0 };
  }
  
  for (const variant of acceptedVariants) {
    if (normalizedTranscribed === normalizeText(variant)) {
      return { accepted: true, matchType: 'variant', confidence: 1.0 };
    }
  }
  
  const targetSimilarity = similarity(normalizedTranscribed, normalizedTarget);
  if (targetSimilarity >= similarityThreshold) {
    return { accepted: true, matchType: 'similar_target', confidence: targetSimilarity };
  }
  
  for (const variant of acceptedVariants) {
    const variantSimilarity = similarity(normalizedTranscribed, normalizeText(variant));
    if (variantSimilarity >= similarityThreshold) {
      return { accepted: true, matchType: 'similar_variant', confidence: variantSimilarity };
    }
  }
  
  return { accepted: false, matchType: 'no_match', confidence: targetSimilarity };
}

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
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // JWT verification - only authenticated users can use transcription
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Nepooblaščen dostop. Prijavite se.', accepted: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: 'Neveljavna seja. Prijavite se znova.', accepted: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Authenticated user for transcription: ${claimsData.claims.sub}`);

    const { 
      audio, 
      targetWord, 
      acceptedVariants = [],
      childId,
      userId,
      sessionNumber,
      wordIndex,
      letter,
      difficulty = "srednja",
      logopedistId
    } = await req.json();

    console.log(`Transcription request for word: ${targetWord}, letter: ${letter}, index: ${wordIndex}, session: ${sessionNumber}, difficulty: ${difficulty}, logopedistId: ${logopedistId || 'none'}`);

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

    const binaryAudio = processBase64Chunks(audio);
    console.log(`Audio size: ${binaryAudio.length} bytes`);

    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'recording.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'sl');
    formData.append('prompt', targetWord);
    console.log(`Whisper API call with prompt hint: "${targetWord}"`);

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

    const matchResult = isWordAccepted(transcribedText, targetWord, acceptedVariants, difficulty);
    console.log(`Match result:`, matchResult);

    let storagePath = null;
    if (childId && userId && matchResult.accepted) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const safeLetter = sanitizeForStorage(letter || 'X');
        const safeWord = sanitizeForStorage(targetWord);
        const sessionFolder = `Seja-${sessionNumber || 1}`;
        
        if (logopedistId) {
          storagePath = `logopedist-children/${logopedistId}/${childId}/Preverjanje-izgovorjave/${sessionFolder}/${safeLetter}-${wordIndex}-${safeWord}-${timestamp}.webm`;
        } else {
          storagePath = `${userId}/${childId}/Preverjanje-izgovorjave/${sessionFolder}/${safeLetter}-${wordIndex}-${safeWord}-${timestamp}.webm`;
        }

        console.log(`Attempting to save recording to: ${storagePath}`);

        const { error: uploadError } = await supabase.storage
          .from('uporabniski-profili')
          .upload(storagePath, binaryAudio, {
            contentType: 'audio/webm',
            upsert: false
          });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
        } else {
          console.log(`Recording saved to: ${storagePath}`);
        }
      } catch (storageError) {
        console.error('Storage error:', storageError);
      }
    } else if (childId && userId && !matchResult.accepted) {
      console.log(`Recording not saved - word not accepted. Transcribed: "${transcribedText}", Target: "${targetWord}", Match type: ${matchResult.matchType}`);
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
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } 
      }
    );
  }
});
