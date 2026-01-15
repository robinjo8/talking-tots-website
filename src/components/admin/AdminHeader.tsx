import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bell, Menu, Search, User } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminMobileNav } from './AdminMobileNav';

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const { profile } = useAdminAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <AdminMobileNav />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Išči preverjanja, otroke..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-muted/50"
          />
        </div>
      </div>

      {/* Right side - pushed to far right */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-app-orange text-[10px] font-medium text-white flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User info - static display */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-app-blue/10 flex items-center justify-center">
            <User className="h-5 w-5 text-app-blue" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {profile?.first_name} {profile?.last_name}
            </span>
            <span className="text-xs text-muted-foreground">
              TomiTalk logoped
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
