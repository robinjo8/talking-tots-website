import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';

interface ReportData {
  // Fixed fields (read-only)
  parentName: string;
  parentEmail: string;
  childName: string;
  childAge: number | null;
  childGender: string | null;
  testDate: string | null;
  reportDate: string;
  logopedistName: string;
  
  // Editable fields
  anamneza: string;
  ugotovitve: string;
  predlogVaj: string;
  opombe: string;
}

interface ReportTemplateEditorProps {
  data: ReportData;
  onFieldChange: (field: 'anamneza' | 'ugotovitve' | 'predlogVaj' | 'opombe', value: string) => void;
}

export function ReportTemplateEditor({ data, onFieldChange }: ReportTemplateEditorProps) {
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

  return (
    <div className="bg-white border rounded-lg p-6 space-y-6 text-sm print:text-xs overflow-auto max-h-[600px]">
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
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <span className="text-muted-foreground">Datum preverjanja izgovorjave:</span>
          <span className="font-medium">{data.testDate || 'Ni podatka'}</span>
          <span className="text-muted-foreground">Datum izdelave poročila:</span>
          <span className="font-medium">{data.reportDate}</span>
        </div>
      </div>

      {/* Anamneza Section */}
      <div className="space-y-2">
        <h2 className="font-bold text-foreground uppercase text-xs tracking-wide">
          ANAMNEZA:
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
          UGOTOVITVE:
        </h2>
        <Textarea
          placeholder="Vnesite ugotovitve..."
          value={data.ugotovitve}
          onChange={(e) => onFieldChange('ugotovitve', e.target.value)}
          className="resize-none min-h-[80px] text-sm"
        />
      </div>

      {/* Predlog za vaje Section */}
      <div className="space-y-2">
        <h2 className="font-bold text-foreground uppercase text-xs tracking-wide">
          PREDLOG ZA VAJE:
        </h2>
        <Textarea
          placeholder="Vnesite predlog za vaje..."
          value={data.predlogVaj}
          onChange={(e) => onFieldChange('predlogVaj', e.target.value)}
          className="resize-none min-h-[80px] text-sm"
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
        <div className="text-right space-y-1">
          <p className="text-sm">
            <span className="text-muted-foreground">Poročilo izdelal/a:</span>{' '}
            <span className="font-medium">{data.logopedistName || 'Ni podatka'}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Datum:</span>{' '}
            <span className="font-medium">{data.reportDate}</span>
          </p>
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

  return `LOGOPEDSKO POROČILO – TomiTalk

══════════════════════════════════════════════════════════════

PODATKI O STARŠU / SKRBNIKU
Ime in priimek: ${data.parentName || 'Ni podatka'}
E-poštni naslov: ${data.parentEmail || 'Ni podatka'}

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

PREDLOG ZA VAJE:
${data.predlogVaj || '(ni vnosa)'}

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
