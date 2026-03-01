import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type MotorikaFrequencyType = 'daily' | 'weekly' | 'monthly' | 'custom' | null;
export type MotorikaCustomUnit = 'day' | 'week' | 'month' | null;

interface MotorikaFrequencySelectorProps {
  frequency: MotorikaFrequencyType;
  customCount: number | null;
  customUnit: MotorikaCustomUnit;
  onFrequencyChange: (frequency: MotorikaFrequencyType) => void;
  onCustomCountChange: (count: number | null) => void;
  onCustomUnitChange: (unit: MotorikaCustomUnit) => void;
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
    case 'monthly':
      return 'Priporočamo vaje za motoriko govoril enkrat na mesec.';
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
}: MotorikaFrequencySelectorProps) {
  return (
    <div className="space-y-3">
      <RadioGroup
        value={frequency || ''}
        onValueChange={(val) => onFrequencyChange(val as MotorikaFrequencyType)}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="daily" id="motorika-daily" />
          <Label htmlFor="motorika-daily" className="text-sm">Vsak dan</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="weekly" id="motorika-weekly" />
          <Label htmlFor="motorika-weekly" className="text-sm">Enkrat na teden</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="monthly" id="motorika-monthly" />
          <Label htmlFor="motorika-monthly" className="text-sm">Enkrat na mesec</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="motorika-custom" />
          <Label htmlFor="motorika-custom" className="text-sm">Po meri</Label>
        </div>
      </RadioGroup>

      {frequency === 'custom' && (
        <div className="flex items-center gap-2 pl-6">
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

      {frequency && formatMotorikaFrequencyText(frequency, customCount, customUnit) && (
        <p className="text-sm font-medium text-foreground bg-muted/50 rounded-md px-3 py-2">
          {formatMotorikaFrequencyText(frequency, customCount, customUnit)}
        </p>
      )}
    </div>
  );
}
