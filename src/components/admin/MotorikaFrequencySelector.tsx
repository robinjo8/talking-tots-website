import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type MotorikaFrequencyType = 'daily' | 'weekly' | 'not_needed' | 'custom' | null;
export type MotorikaCustomUnit = 'day' | 'week' | 'month' | null;

interface MotorikaFrequencySelectorProps {
  frequency: MotorikaFrequencyType;
  customCount: number | null;
  customUnit: MotorikaCustomUnit;
  onFrequencyChange: (frequency: MotorikaFrequencyType) => void;
  onCustomCountChange: (count: number | null) => void;
  onCustomUnitChange: (unit: MotorikaCustomUnit) => void;
  hidePreview?: boolean;
  inline?: boolean;
}

export function formatMotorikaFrequencyText(
  frequency: MotorikaFrequencyType,
  customCount: number | null,
  customUnit: MotorikaCustomUnit,
): string {
  if (!frequency) return '';
  switch (frequency) {
    case 'daily':
      return 'Priporočamo vaje za motoriko govoril vsak dan.';
    case 'weekly':
      return 'Priporočamo vaje za motoriko govoril enkrat na teden.';
    case 'not_needed':
      return 'Vaje za motoriko govoril niso potrebne.';
    case 'custom': {
      if (!customCount || !customUnit) return '';
      const unitText = customUnit === 'day' ? 'dan' : customUnit === 'week' ? 'teden' : 'mesec';
      return `Priporočamo vaje za motoriko govoril ${customCount}-krat na ${unitText}.`;
    }
    default:
      return '';
  }
}

export function MotorikaFrequencySelector({
  frequency,
  customCount,
  customUnit,
  onFrequencyChange,
  onCustomCountChange,
  onCustomUnitChange,
  hidePreview = false,
  inline = false,
}: MotorikaFrequencySelectorProps) {
  return (
    <div className={inline ? "flex items-center gap-2 flex-wrap" : "space-y-3"}>
      <Select
        value={frequency || ''}
        onValueChange={(val) => onFrequencyChange(val as MotorikaFrequencyType)}
      >
        <SelectTrigger className="w-[200px] h-8 text-sm">
          <SelectValue placeholder="Izberi pogostost" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Vsak dan</SelectItem>
          <SelectItem value="weekly">Enkrat na teden</SelectItem>
          <SelectItem value="not_needed">Ni potrebno</SelectItem>
          <SelectItem value="custom">Po meri</SelectItem>
        </SelectContent>
      </Select>

      {frequency === 'custom' && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={30}
            value={customCount || ''}
            onChange={(e) => onCustomCountChange(e.target.value ? parseInt(e.target.value) : null)}
            className="w-16 h-8 text-sm"
            placeholder="3"
          />
          <span className="text-sm text-muted-foreground">-krat na</span>
          <Select
            value={customUnit || ''}
            onValueChange={(val) => onCustomUnitChange(val as MotorikaCustomUnit)}
          >
            <SelectTrigger className="w-[120px] h-8 text-sm">
              <SelectValue placeholder="Izberi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">dan</SelectItem>
              <SelectItem value="week">teden</SelectItem>
              <SelectItem value="month">mesec</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {!hidePreview && frequency && formatMotorikaFrequencyText(frequency, customCount, customUnit) && (
        <p className="text-sm font-medium text-foreground bg-muted/50 rounded-md px-3 py-2">
          {formatMotorikaFrequencyText(frequency, customCount, customUnit)}
        </p>
      )}
    </div>
  );
}
