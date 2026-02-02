import { supabase } from '@/integrations/supabase/client';
import { SPEECH_DEVELOPMENT_QUESTIONS, SPEECH_DEVELOPMENT_TEXT_QUESTIONS } from '@/models/SpeechDevelopment';

/**
 * Format questionnaire answers as readable text for storage
 */
export function formatQuestionnaireAsText(answers: Record<string, string>, childName: string): string {
  const lines: string[] = [];
  lines.push(`OSNOVNI VPRAŠALNIK - ${childName}`);
  lines.push(`Datum: ${new Date().toLocaleDateString('sl-SI')}`);
  lines.push('');
  lines.push('='.repeat(50));
  lines.push('');
  
  // Radio questions
  SPEECH_DEVELOPMENT_QUESTIONS.forEach(q => {
    const answer = answers[q.id];
    const option = q.options.find(o => o.value === answer);
    lines.push(`${q.question}`);
    lines.push(`Odgovor: ${option?.label || 'Ni odgovora'}`);
    lines.push('');
  });
  
  // Text questions
  SPEECH_DEVELOPMENT_TEXT_QUESTIONS.forEach(q => {
    const answer = answers[q.id];
    lines.push(`${q.question}`);
    lines.push(`Odgovor: ${answer || 'Ni odgovora'}`);
    lines.push('');
  });
  
  return lines.join('\n');
}

/**
 * Upload documents (speech difficulties description & questionnaire) to storage for logopedist children
 */
export async function uploadLogopedistChildDocuments(
  logopedistId: string,
  childId: string,
  childName: string,
  speechDifficultiesDescription: string | undefined,
  speechDevelopment: Record<string, string> | undefined
): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];
  const basePath = `logopedist-children/${logopedistId}/${childId}/Dokumenti`;

  // 1. Upload speech difficulties description
  if (speechDifficultiesDescription && speechDifficultiesDescription.trim()) {
    try {
      const textBlob = new Blob([speechDifficultiesDescription], { type: 'text/plain' });
      const fileName = `opis-govornih-tezav-${Date.now()}.txt`;
      
      const { error } = await supabase.storage
        .from('uporabniski-profili')
        .upload(`${basePath}/${fileName}`, textBlob);

      if (error) {
        console.error('Error uploading speech difficulties:', error);
        errors.push('Napaka pri nalaganju opisa govornih težav');
      }
    } catch (err) {
      console.error('Error uploading speech difficulties:', err);
      errors.push('Napaka pri nalaganju opisa govornih težav');
    }
  }

  // 2. Upload questionnaire
  if (speechDevelopment && Object.keys(speechDevelopment).length > 0) {
    try {
      const questionnaireText = formatQuestionnaireAsText(speechDevelopment, childName);
      const questionnaireBlob = new Blob([questionnaireText], { type: 'text/plain' });
      const fileName = `${childId}-osnovni-vprasalnik.txt`;
      
      const { error } = await supabase.storage
        .from('uporabniski-profili')
        .upload(`${basePath}/${fileName}`, questionnaireBlob);

      if (error) {
        console.error('Error uploading questionnaire:', error);
        errors.push('Napaka pri nalaganju vprašalnika');
      }
    } catch (err) {
      console.error('Error uploading questionnaire:', err);
      errors.push('Napaka pri nalaganju vprašalnika');
    }
  }

  return {
    success: errors.length === 0,
    errors
  };
}
