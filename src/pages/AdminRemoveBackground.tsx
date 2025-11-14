import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { pipeline, env } from '@huggingface/transformers';
import { toast } from 'sonner';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

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

const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  console.log('Starting background removal process...');
  const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
    device: 'webgpu',
  });
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
  console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
  
  const imageData = canvas.toDataURL('image/jpeg', 0.8);
  console.log('Image converted to base64');
  
  console.log('Processing with segmentation model...');
  const result = await segmenter(imageData);
  
  if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
    throw new Error('Invalid segmentation result');
  }
  
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  const outputCtx = outputCanvas.getContext('2d');
  
  if (!outputCtx) throw new Error('Could not get output canvas context');
  
  outputCtx.drawImage(canvas, 0, 0);
  
  const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
  const data = outputImageData.data;
  
  for (let i = 0; i < result[0].mask.data.length; i++) {
    const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
    data[i * 4 + 3] = alpha;
  }
  
  outputCtx.putImageData(outputImageData, 0, 0);
  console.log('Mask applied successfully');
  
  return new Promise((resolve, reject) => {
    outputCanvas.toBlob(
      (blob) => {
        if (blob) {
          console.log('Successfully created final blob');
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      'image/png',
      1.0
    );
  });
};

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

export default function AdminRemoveBackground() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState('');

  const images = [
    { name: 'spomin_2.png', bucket: 'slike-ostalo' },
    { name: 'sestavljanka_2.png', bucket: 'slike-ostalo' },
    { name: 'drsna_2.png', bucket: 'slike-ostalo' },
    { name: 'povezi_pare_1.png', bucket: 'slike-ostalo' },
  ];

  const processImages = async () => {
    setProcessing(true);
    
    for (const img of images) {
      try {
        setProgress(`Processing ${img.name}...`);
        console.log(`Starting ${img.name}`);
        
        // Get image URL
        const { data: urlData } = supabase.storage
          .from(img.bucket)
          .getPublicUrl(img.name);
        
        // Load image
        const imageElement = await loadImage(urlData.publicUrl);
        console.log(`Image loaded: ${img.name}`);
        
        // Remove background
        const blob = await removeBackground(imageElement);
        console.log(`Background removed: ${img.name}`);
        
        // Upload back
        const { error: uploadError } = await supabase.storage
          .from(img.bucket)
          .upload(img.name, blob, {
            contentType: 'image/png',
            upsert: true
          });
        
        if (uploadError) {
          console.error(`Error uploading ${img.name}:`, uploadError);
          toast.error(`Error: ${img.name} - ${uploadError.message}`);
        } else {
          console.log(`Successfully processed ${img.name}`);
          toast.success(`✓ ${img.name}`);
        }
      } catch (error) {
        console.error(`Error processing ${img.name}:`, error);
        toast.error(`Error: ${img.name} - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    setProgress('Done!');
    setProcessing(false);
    toast.success('All images processed!');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-4">Remove Background Tool</h1>
          <p className="text-muted-foreground mb-6">
            This tool will remove the background from the following images:
          </p>
          
          <ul className="list-disc list-inside mb-6 space-y-2">
            {images.map(img => (
              <li key={img.name} className="text-sm">
                {img.name} <span className="text-muted-foreground">({img.bucket})</span>
              </li>
            ))}
          </ul>

          {progress && (
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">{progress}</p>
            </div>
          )}

          <Button 
            onClick={processImages} 
            disabled={processing}
            size="lg"
            className="w-full"
          >
            {processing ? 'Processing...' : 'Start Processing'}
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Note: This process uses WebGPU and may take a few minutes. The original images will be replaced with transparent versions.
          </p>
        </Card>
      </div>
    </div>
  );
}
