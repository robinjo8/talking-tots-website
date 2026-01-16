// Roboto fonts embedded as Base64 for reliable PDF generation with UTF-8 support
// These fonts support Slovenian characters (č, š, ž, ć, đ)

// Import the fonts from a CDN and convert to base64 at runtime
// This approach ensures the fonts are always available without bundling large files

export const loadRobotoFonts = async (): Promise<{ regular: string; bold: string }> => {
  const loadFont = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Failed to load font:', error);
      throw error;
    }
  };

  // Use Google Fonts CDN for Roboto
  const regularUrl = 'https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Me5Q.ttf';
  const boldUrl = 'https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmWUlvAw.ttf';

  const [regular, bold] = await Promise.all([
    loadFont(regularUrl),
    loadFont(boldUrl)
  ]);

  return { regular, bold };
};
