import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LetterSelector, RecommendedLetter } from './LetterSelector';
import { MotorikaFrequencySelector, MotorikaFrequencyType, MotorikaCustomUnit } from './MotorikaFrequencySelector';
import { VideoLetterSelector } from './VideoLetterSelector';

export interface TestSession {
  id: string;
  date: string;
  formattedDate: string;
}

interface ReportData {
  // Fixed fields (read-only)
  parentName: string;
  parentEmail: string;
  childName: string;
  childAge: number | null;
  childGender: string | null;
  testDate: string | null;
  selectedSessionId: string | null;
  reportDate: string;
  logopedistName: string;
  
  // Editable fields
  anamneza: string;
  ugotovitve: string;
  predlogVaj: string;
  opombe: string;
  recommendedLetters: RecommendedLetter[];
  
  // New fields
  motorikaFrequency: MotorikaFrequencyType;
  motorikaCustomCount: number | null;
  motorikaCustomUnit: MotorikaCustomUnit;
  recommendedVideoLetters: string[];
}

interface ReportTemplateEditorProps {
  data: ReportData;
  testSessions: TestSession[];
  hideParentSection?: boolean;
  onFieldChange: (field: 'anamneza' | 'ugotovitve' | 'predlogVaj' | 'opombe', value: string) => void;
  onSessionChange: (sessionId: string) => void;
  onRecommendedLettersChange: (letters: RecommendedLetter[]) => void;
  onMotorikaFrequencyChange: (frequency: MotorikaFrequencyType) => void;
  onMotorikaCustomCountChange: (count: number | null) => void;
  onMotorikaCustomUnitChange: (unit: MotorikaCustomUnit) => void;
  onRecommendedVideoLettersChange: (letters: string[]) => void;
}

/**
 * Combines all recommendation parts into a single sentence.
 * E.g.: "Priporočamo igre in vaje za glas B na začetku besed, vaje za motoriko govoril enkrat na teden in ogled video navodil za glas R."
 */
export function formatCombinedRecommendationText(
  letters: RecommendedLetter[],
  motorikaFrequency: MotorikaFrequencyType,
  motorikaCustomCount: number | null,
  motorikaCustomUnit: MotorikaCustomUnit,
  videoLetters: string[],
): string {
  const parts: string[] = [];

  // Part 1: Letters
  if (letters.length > 0) {
    const letterParts = letters.map(l => {
      const positions = (l as any).positions || [(l as any).position || 'start'];
      const posParts: string[] = [];
      if (positions.includes('start')) posParts.push('na začetku besed');
      if (positions.includes('middle-end')) posParts.push('na sredini/koncu besed');
      if (positions.includes('initial-exercises')) posParts.push('(začetne vaje)');
      const posText = posParts.join(' in ');
      return `glas ${l.letter} ${posText}`;
    });
    if (letterParts.length === 1) {
      parts.push(`igre in vaje za ${letterParts[0]}`);
    } else {
      const allButLast = letterParts.slice(0, -1);
      const last = letterParts[letterParts.length - 1];
      parts.push(`igre in vaje za ${allButLast.join(', ')} in za ${last}`);
    }
  }

  // Part 2: Motorika
  if (motorikaFrequency) {
    let motorikaText = '';
    switch (motorikaFrequency) {
      case 'daily':
        motorikaText = 'vaje za motoriko govoril vsak dan';
        break;
      case 'weekly':
        motorikaText = 'vaje za motoriko govoril enkrat na teden';
        break;
      case 'not_needed':
        // Special case: this is a negative statement, handle separately
        break;
      case 'custom':
        if (motorikaCustomCount && motorikaCustomUnit) {
          const unitText = motorikaCustomUnit === 'day' ? 'dan' : motorikaCustomUnit === 'week' ? 'teden' : 'mesec';
          motorikaText = `vaje za motoriko govoril ${motorikaCustomCount}-krat na ${unitText}`;
        }
        break;
    }
    if (motorikaText) {
      parts.push(motorikaText);
    }
  }

  // Part 3: Video
  if (videoLetters.length > 0) {
    if (videoLetters.length === 1) {
      parts.push(`ogled video navodil za glas ${videoLetters[0]}`);
    } else {
      const allButLast = videoLetters.slice(0, -1);
      const last = videoLetters[videoLetters.length - 1];
      const vParts = allButLast.map(l => `glas ${l}`);
      parts.push(`ogled video navodil za ${vParts.join(', ')} in za glas ${last}`);
    }
  }

  if (parts.length === 0 && motorikaFrequency === 'not_needed') {
    return 'Vaje za motoriko govoril niso potrebne.';
  }

  if (parts.length === 0) return '';

  // Build combined sentence
  let sentence = '';
  if (parts.length === 1) {
    sentence = `Priporočamo ${parts[0]}`;
  } else if (parts.length === 2) {
    sentence = `Priporočamo ${parts[0]} in ${parts[1]}`;
  } else {
    const allButLast = parts.slice(0, -1);
    const last = parts[parts.length - 1];
    sentence = `Priporočamo ${allButLast.join(', ')} in ${last}`;
  }

  // Append "not needed" note if motorika is not_needed AND there are other parts
  if (motorikaFrequency === 'not_needed' && parts.length > 0) {
    sentence += '. Vaje za motoriko govoril niso potrebne.';
  } else {
    sentence += '.';
  }

  return sentence;
}

export function ReportTemplateEditor({ 
  data, testSessions, hideParentSection = false, 
  onFieldChange, onSessionChange, onRecommendedLettersChange,
  onMotorikaFrequencyChange, onMotorikaCustomCountChange, onMotorikaCustomUnitChange,
  onRecommendedVideoLettersChange,
}: ReportTemplateEditorProps) {
  const formatGender = (gender: string | null) => {
    if (!gender) return 'Ni podatka';
    if (gender.toLowerCase() === 'm' || gender.toLowerCase() === 'male') return 'M';
    if (gender.toLowerCase() === 'f' || gender.toLowerCase() === 'female' || gender.toLowerCase() === 'ž') return 'Ž';
    return gender;
  };

  const formatAge = (age: number | null) => {
    if (!age) return 'Ni podatka';
    if (age === 1) return '1 leto';
    if (age === 2) return '2 leti';
    if (age >= 3 && age <= 4) return `${age} leta`;
    return `${age} let`;
  };

  const combinedText = formatCombinedRecommendationText(
    data.recommendedLetters,
    data.motorikaFrequency,
    data.motorikaCustomCount,
    data.motorikaCustomUnit,
    data.recommendedVideoLetters || [],
  );

  return (
    <div className="bg-white border rounded-lg p-6 space-y-6 text-sm print:text-xs">
      {/* Header with Logo */}
      <div className="flex items-start justify-between border-b pb-4">
        <div className="flex items-center gap-1">
          <span className="text-xl font-extrabold text-dragon-green uppercase">Tomi</span>
          <span className="text-xl font-extrabold text-app-orange uppercase">Talk</span>
        </div>
      </div>

      {/* Document Title */}
      <div className="text-center">
        <h1 className="text-lg font-bold text-foreground uppercase tracking-wide">
          LOGOPEDSKO POROČILO – TomiTalk
        </h1>
      </div>

      {/* Parent/Guardian Data */}
      {!hideParentSection && (
        <div className="space-y-2">
          <h2 className="font-bold text-foreground uppercase text-xs tracking-wide border-b pb-1">
            PODATKI O STARŠU / SKRBNIKU
          </h2>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <span className="text-muted-foreground">Ime in priimek:</span>
            <span className="font-medium">{data.parentName || 'Ni podatka'}</span>
            <span className="text-muted-foreground">E-poštni naslov:</span>
            <span className="font-medium">{data.parentEmail || 'Ni podatka'}</span>
          </div>
        </div>
      )}

      {/* Child Data */}
      <div className="space-y-2">
        <h2 className="font-bold text-foreground uppercase text-xs tracking-wide border-b pb-1">
          PODATKI O OTROKU
        </h2>
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <span className="text-muted-foreground">Ime in priimek / Starost / Spol:</span>
          <span className="font-medium">
            {data.childName || 'Ni podatka'} / {formatAge(data.childAge)} / {formatGender(data.childGender)}
          </span>
        </div>
      </div>

      {/* Assessment Data */}
      <div className="space-y-2">
        <h2 className="font-bold text-foreground uppercase text-xs tracking-wide border-b pb-1">
          PODATKI O PREVERJANJU
        </h2>
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm items-center">
          <span className="text-muted-foreground">Datum preverjanja izgovorjave:</span>
          {testSessions.length > 0 ? (
            <Select
              value={data.selectedSessionId || ''}
              onValueChange={onSessionChange}
            >
              <SelectTrigger className="w-[200px] h-8 text-sm">
                <SelectValue placeholder="Izberite sejo" />
              </SelectTrigger>
              <SelectContent>
                {testSessions.map((session, index) => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.formattedDate} (seja {testSessions.length - index})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="font-medium">Ni podatka</span>
          )}
          <span className="text-muted-foreground">Datum izdelave poročila:</span>
          <span className="font-medium">{data.reportDate}</span>
        </div>
      </div>

      {/* Anamneza Section */}
      <div className="space-y-2">
        <h2 className="font-bold text-foreground uppercase text-xs tracking-wide">
          ANAMNEZA: <span className="text-red-500">*</span>
        </h2>
        <Textarea
          placeholder="Vnesite anamnezo..."
          value={data.anamneza}
          onChange={(e) => onFieldChange('anamneza', e.target.value)}
          className="resize-none min-h-[80px] text-sm"
        />
      </div>

      {/* Ugotovitve Section */}
      <div className="space-y-2">
        <h2 className="font-bold text-foreground uppercase text-xs tracking-wide">
          UGOTOVITVE: <span className="text-red-500">*</span>
        </h2>
        <Textarea
          placeholder="Vnesite ugotovitve..."
          value={data.ugotovitve}
          onChange={(e) => onFieldChange('ugotovitve', e.target.value)}
          className="resize-none min-h-[80px] text-sm"
        />
      </div>

      {/* Predlog za igre in vaje Section */}
      <div className="space-y-4">
        <h2 className="font-bold text-foreground uppercase text-xs tracking-wide">
          PREDLOG ZA IGRE IN VAJE: <span className="text-red-500">*</span>
        </h2>
        
        {/* Row 1: Letter selector - vertical layout */}
        <div className="space-y-1">
          <span className="text-sm font-medium text-foreground">Priporočamo igre in vaje za glas:</span>
          <LetterSelector
            selectedLetters={data.recommendedLetters}
            onLettersChange={onRecommendedLettersChange}
            hidePreview
          />
        </div>

        {/* Row 2: Motorika - vertical layout */}
        <div className="space-y-1">
          <span className="text-sm font-medium text-foreground">Vaje za motoriko govoril:</span>
          <MotorikaFrequencySelector
            frequency={data.motorikaFrequency}
            customCount={data.motorikaCustomCount}
            customUnit={data.motorikaCustomUnit}
            onFrequencyChange={onMotorikaFrequencyChange}
            onCustomCountChange={onMotorikaCustomCountChange}
            onCustomUnitChange={onMotorikaCustomUnitChange}
            hidePreview
          />
        </div>

        {/* Row 3: Video navodila - vertical layout */}
        <div className="space-y-1">
          <span className="text-sm font-medium text-foreground">Ogled video navodil:</span>
          <VideoLetterSelector
            selectedLetters={data.recommendedVideoLetters}
            onLettersChange={onRecommendedVideoLettersChange}
            hidePreview
          />
        </div>

        {/* Combined preview box */}
        {combinedText && (
          <div className="text-sm font-medium text-foreground bg-muted/50 rounded-md px-3 py-2">
            <p>{combinedText}</p>
          </div>
        )}

        <Textarea
          placeholder="Dodatne opombe k predlogu za igre in vaje..."
          value={data.predlogVaj}
          onChange={(e) => onFieldChange('predlogVaj', e.target.value)}
          className="resize-none min-h-[60px] text-sm"
        />
      </div>

      {/* Opombe Section */}
      <div className="space-y-2">
        <h2 className="font-bold text-foreground uppercase text-xs tracking-wide">
          OPOMBE:
        </h2>
        <Textarea
          placeholder="Vnesite opombe..."
          value={data.opombe}
          onChange={(e) => onFieldChange('opombe', e.target.value)}
          className="resize-none min-h-[80px] text-sm"
        />
      </div>

      {/* Footer with signature */}
      <div className="border-t pt-4 mt-6">
        <div className="flex justify-between items-center text-sm">
          <span>
            <span className="text-muted-foreground">Datum: </span>
            <span className="font-medium">{data.reportDate}</span>
          </span>
          <span>
            <span className="text-muted-foreground">Poročilo izdelal/a: </span>
            <span className="font-medium">{data.logopedistName || 'Ni podatka'}</span>
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-muted-foreground italic pt-4 border-t">
        To poročilo je informativne narave in ne predstavlja zdravniškega izvida ali uradne medicinske diagnoze. 
        Namenjeno je podpori govorno-jezikovnega razvoja otroka v okviru aplikacije TomiTalk.
      </div>
    </div>
  );
}

// Helper function to generate full report text from structured data
export function generateReportText(data: ReportData): string {
  const formatGender = (gender: string | null) => {
    if (!gender) return 'Ni podatka';
    if (gender.toLowerCase() === 'm' || gender.toLowerCase() === 'male') return 'M';
    if (gender.toLowerCase() === 'f' || gender.toLowerCase() === 'female' || gender.toLowerCase() === 'ž') return 'Ž';
    return gender;
  };

  const formatAge = (age: number | null) => {
    if (!age) return 'Ni podatka';
    if (age === 1) return '1 leto';
    if (age === 2) return '2 leti';
    if (age >= 3 && age <= 4) return `${age} leta`;
    return `${age} let`;
  };

  const combinedText = formatCombinedRecommendationText(
    data.recommendedLetters || [],
    data.motorikaFrequency,
    data.motorikaCustomCount,
    data.motorikaCustomUnit,
    data.recommendedVideoLetters || [],
  );
  const predlogContent = [combinedText, data.predlogVaj].filter(Boolean).join('\n') || '(ni vnosa)';

  return `LOGOPEDSKO POROČILO – TomiTalk

══════════════════════════════════════════════════════════════

PODATKI O OTROKU
Ime in priimek / Starost / Spol: ${data.childName || 'Ni podatka'} / ${formatAge(data.childAge)} / ${formatGender(data.childGender)}

══════════════════════════════════════════════════════════════

PODATKI O PREVERJANJU
Datum preverjanja izgovorjave: ${data.testDate || 'Ni podatka'}
Datum izdelave poročila: ${data.reportDate}

══════════════════════════════════════════════════════════════

ANAMNEZA:
${data.anamneza || '(ni vnosa)'}

══════════════════════════════════════════════════════════════

UGOTOVITVE:
${data.ugotovitve || '(ni vnosa)'}

══════════════════════════════════════════════════════════════

PREDLOG ZA IGRE IN VAJE:
${predlogContent}

══════════════════════════════════════════════════════════════

OPOMBE:
${data.opombe || '(ni vnosa)'}

══════════════════════════════════════════════════════════════

                                    Poročilo izdelal/a: ${data.logopedistName || 'Ni podatka'}
                                    Datum: ${data.reportDate}

──────────────────────────────────────────────────────────────
To poročilo je informativne narave in ne predstavlja zdravniškega izvida 
ali uradne medicinske diagnoze. Namenjeno je podpori govorno-jezikovnega 
razvoja otroka v okviru aplikacije TomiTalk.
`;
}

export type { ReportData };
