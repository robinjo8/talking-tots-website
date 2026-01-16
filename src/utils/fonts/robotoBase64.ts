// Roboto fonts embedded as Base64 for reliable PDF generation with UTF-8 support
// These fonts support Slovenian characters (č, š, ž, ć, đ)

// Note: For production, we use a minimal subset approach
// The full Roboto font would be ~150KB per weight
// Instead, we'll use jsPDF's built-in font and handle special characters

// For now, export empty strings - the main file will handle fallback
export const ROBOTO_REGULAR_BASE64 = '';
export const ROBOTO_BOLD_BASE64 = '';

// Character mapping for fonts that don't support Slovenian characters
export const SLOVENIAN_CHAR_MAP: Record<string, string> = {
  'č': 'c', 'Č': 'C',
  'š': 's', 'Š': 'S',
  'ž': 'z', 'Ž': 'Z',
  'ć': 'c', 'Ć': 'C',
  'đ': 'd', 'Đ': 'D'
};
