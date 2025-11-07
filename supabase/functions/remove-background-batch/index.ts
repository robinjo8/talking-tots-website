import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { pipeline, env } from 'npm:@huggingface/transformers@3';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

function resizeImageIfNeeded(canvas: any, ctx: any, image: any) {
  let width = image.width;
  let height = image.height;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

async function removeBackground(imageUrl: string): Promise<Uint8Array> {
  console.log('Starting background removal for:', imageUrl);
  
  // Load image
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  
  // Create canvas and load image
  const { createCanvas, loadImage } = await import('https://deno.land/x/canvas@v1.4.1/mod.ts');
  const image = await loadImage(new Uint8Array(arrayBuffer));
  
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  
  // Resize if needed
  const wasResized = resizeImageIfNeeded(canvas, ctx, image);
  console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
  
  // Get image as base64
  const imageData = canvas.toDataURL('image/jpeg', 0.8);
  
  // Process with segmentation model
  console.log('Processing with segmentation model...');
  const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
    device: 'cpu',
  });
  
  const result = await segmenter(imageData);
  
  if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
    throw new Error('Invalid segmentation result');
  }
  
  // Create output canvas
  const outputCanvas = createCanvas(canvas.width, canvas.height);
  const outputCtx = outputCanvas.getContext('2d');
  
  // Draw original image
  outputCtx.drawImage(canvas, 0, 0);
  
  // Apply mask
  const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
  const data = outputImageData.data;
  
  // Apply inverted mask to alpha channel
  for (let i = 0; i < result[0].mask.data.length; i++) {
    const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
    data[i * 4 + 3] = alpha;
  }
  
  outputCtx.putImageData(outputImageData, 0, 0);
  console.log('Mask applied successfully');
  
  // Convert to PNG buffer
  return outputCanvas.toBuffer('image/png');
}

Deno.serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const images = [
      { name: 'zmajcek_crka_C.png', letter: 'C' },
      { name: 'zmajcek_crka_CH.png', letter: 'Č' },
      { name: 'zmajcek_crka_K.png', letter: 'K' },
      { name: 'zmajcek_crka_L.png', letter: 'L' },
      { name: 'zmajcek_crka_R.png', letter: 'R' },
      { name: 'zmajcek_crka_S.png', letter: 'S' },
      { name: 'zmajcek_crka_SH.png', letter: 'Š' },
      { name: 'zmajcek_crka_Z.png', letter: 'Z' },
      { name: 'zmajcek_crka_ZH.png', letter: 'Ž' },
    ];

    const results = [];

    for (const img of images) {
      try {
        console.log(`Processing ${img.name}...`);
        
        // Get original image URL
        const { data: urlData } = supabaseClient.storage
          .from('zmajcki')
          .getPublicUrl(img.name);
        
        // Remove background
        const pngBuffer = await removeBackground(urlData.publicUrl);
        
        // Upload to new bucket or replace
        const newFileName = img.name.replace('.png', '_transparent.png');
        const { error: uploadError } = await supabaseClient.storage
          .from('zmajcki')
          .upload(newFileName, pngBuffer, {
            contentType: 'image/png',
            upsert: true
          });
        
        if (uploadError) {
          console.error(`Error uploading ${newFileName}:`, uploadError);
          results.push({ name: img.name, success: false, error: uploadError.message });
        } else {
          console.log(`Successfully processed ${img.name}`);
          results.push({ name: img.name, success: true });
        }
      } catch (error) {
        console.error(`Error processing ${img.name}:`, error);
        results.push({ name: img.name, success: false, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({ results }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
