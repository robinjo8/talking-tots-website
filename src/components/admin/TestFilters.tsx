import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StatusOption {
  value: string;
  label: string;
}

interface TestFiltersProps {
  // Age filter
  ageFilter?: string;
  setAgeFilter?: (value: string) => void;
  showAgeFilter?: boolean;
  
  // Gender filter
  genderFilter?: string;
  setGenderFilter?: (value: string) => void;
  showGenderFilter?: boolean;
  
  // Status filter
  statusFilter?: string;
  setStatusFilter?: (value: string) => void;
  showStatusFilter?: boolean;
  statusOptions?: StatusOption[];
  
  // Date filter
  dateFilter?: string;
  setDateFilter?: (value: string) => void;
  showDateFilter?: boolean;
}

const defaultStatusOptions: StatusOption[] = [
  { value: 'all', label: 'Vsi statusi' },
  { value: 'pending', label: 'V čakanju' },
  { value: 'in_review', label: 'V obdelavi' },
  { value: 'reviewed', label: 'Pregledano' },
  { value: 'completed', label: 'Zaključeno' },
];

export function TestFilters({
  ageFilter = 'all',
  setAgeFilter,
  showAgeFilter = false,
  genderFilter = 'all',
  setGenderFilter,
  showGenderFilter = false,
  statusFilter = 'all',
  setStatusFilter,
  showStatusFilter = false,
  statusOptions = defaultStatusOptions,
  dateFilter = 'all',
  setDateFilter,
  showDateFilter = false,
}: TestFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {showAgeFilter && setAgeFilter && (
        <Select value={ageFilter} onValueChange={setAgeFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Starost" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Vse starosti</SelectItem>
            <SelectItem value="3">3 leta</SelectItem>
            <SelectItem value="4">4 leta</SelectItem>
            <SelectItem value="5">5 let</SelectItem>
            <SelectItem value="6">6 let</SelectItem>
            <SelectItem value="7+">7+ let</SelectItem>
          </SelectContent>
        </Select>
      )}

      {showGenderFilter && setGenderFilter && (
        <Select value={genderFilter} onValueChange={setGenderFilter}>
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Spol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Vsi</SelectItem>
            <SelectItem value="m">Moški</SelectItem>
            <SelectItem value="f">Ženski</SelectItem>
          </SelectContent>
        </Select>
      )}

      {showStatusFilter && setStatusFilter && (
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showDateFilter && setDateFilter && (
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Datum oddaje" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Vsi datumi</SelectItem>
            <SelectItem value="today">Danes</SelectItem>
            <SelectItem value="week">Zadnji teden</SelectItem>
            <SelectItem value="month">Zadnji mesec</SelectItem>
            <SelectItem value="year">Zadnje leto</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
