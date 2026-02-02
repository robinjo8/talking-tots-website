import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { LogopedistChild } from '@/hooks/useLogopedistChildren';
import { cn } from '@/lib/utils';

interface ChildSwitcherProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: LogopedistChild[];
  currentChildId: string;
  onSelect: (childId: string) => void;
}

export function ChildSwitcher({ 
  open, 
  onOpenChange, 
  children, 
  currentChildId, 
  onSelect 
}: ChildSwitcherProps) {
  const [search, setSearch] = useState('');

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (childId: string) => {
    if (childId !== currentChildId) {
      onSelect(childId);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Izberi otroka</DialogTitle>
        </DialogHeader>

        {/* Iskanje */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Išči..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Seznam otrok */}
        <div className="max-h-64 overflow-y-auto space-y-1">
          {filteredChildren.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Ni najdenih otrok
            </p>
          ) : (
            filteredChildren.map((child) => (
              <button
                key={child.id}
                onClick={() => handleSelect(child.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                  child.id === currentChildId
                    ? "bg-dragon-green/10 border border-dragon-green/30"
                    : "hover:bg-muted"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                  child.gender === 'male' ? 'bg-app-blue/10' : 'bg-app-pink/10'
                )}>
                  <span className="text-lg">
                    {child.gender === 'male' ? '🧒' : '👧'}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{child.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {child.age} {child.age === 1 ? 'leto' : child.age < 5 ? 'leta' : 'let'}
                  </p>
                </div>

                {child.id === currentChildId && (
                  <span className="text-xs text-dragon-green font-medium">aktivno</span>
                )}
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
