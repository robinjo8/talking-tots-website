import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminMobileNav } from './AdminMobileNav';
import { NotificationDropdown } from './NotificationDropdown';

export function AdminHeader() {
  const { profile } = useAdminAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6 lg:left-64">
      {/* Leva stran: hamburger + logo */}
      <div className="flex items-center gap-3">
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

        {/* Logo - samo mobile */}
        <div className="lg:hidden flex items-center">
          <span className="text-lg font-extrabold text-dragon-green">Tomi</span>
          <span className="text-lg font-extrabold text-app-orange">Talk</span>
        </div>
      </div>

      {/* Desna stran: obvestila + uporabnik */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Notifications */}
        <NotificationDropdown />

        {/* User info */}
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
