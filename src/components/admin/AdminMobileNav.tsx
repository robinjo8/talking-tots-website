import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Clock, 
  User, 
  CheckCircle,
  FileText,
  Users,
  MessageSquare,
  Settings,
  Bell,
  LogOut
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { SheetClose } from '@/components/ui/sheet';

const navigation = [
  { name: 'Moj portal', href: '/admin', icon: LayoutDashboard },
  { name: 'Vsa preverjanja', href: '/admin/tests', icon: ClipboardList },
  { name: 'V čakanju', href: '/admin/tests?status=pending', icon: Clock },
  { name: 'Moji pregledi', href: '/admin/tests?status=assigned', icon: User },
  { name: 'Zaključeni', href: '/admin/tests?status=completed', icon: CheckCircle },
];

const secondaryNavigation = [
  { name: 'Uporabniki', href: '/admin/users', icon: Users },
  { name: 'Poročila', href: '/admin/reports', icon: FileText },
  { name: 'Sporočila', href: '/admin/messages', icon: MessageSquare },
];

const settingsNavigation = [
  { name: 'Nastavitve', href: '/admin/settings', icon: Settings },
  { name: 'Obvestila', href: '/admin/notifications', icon: Bell },
];

export function AdminMobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAdminAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActive = (href: string) => {
    if (href.includes('?')) {
      return location.pathname + location.search === href;
    }
    return location.pathname === href;
  };

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <Link to="/admin" className="flex items-center gap-1">
          <span className="text-xl font-extrabold text-dragon-green uppercase">Tomi</span>
          <span className="text-xl font-extrabold text-app-orange uppercase">Talk</span>
        </Link>
        <span className="ml-2 text-xs text-app-blue font-medium bg-app-blue/10 px-2 py-0.5 rounded">
          Admin
        </span>
      </div>

      <ScrollArea className="flex-1 px-6 py-4">
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            {/* Main navigation */}
            <li>
              <div className="text-xs font-semibold leading-6 text-muted-foreground uppercase tracking-wider mb-2">
                Delovni prostor
              </div>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <SheetClose asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors',
                          isActive(item.href)
                            ? 'bg-app-blue/10 text-app-blue'
                            : 'text-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0',
                            isActive(item.href)
                              ? 'text-app-blue'
                              : 'text-muted-foreground group-hover:text-foreground'
                          )}
                        />
                        {item.name}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </li>

            {/* Secondary navigation */}
            <li>
              <div className="text-xs font-semibold leading-6 text-muted-foreground uppercase tracking-wider mb-2">
                Upravljanje
              </div>
              <ul role="list" className="-mx-2 space-y-1">
                {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                    <SheetClose asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors',
                          isActive(item.href)
                            ? 'bg-app-blue/10 text-app-blue'
                            : 'text-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0',
                            isActive(item.href)
                              ? 'text-app-blue'
                              : 'text-muted-foreground group-hover:text-foreground'
                          )}
                        />
                        {item.name}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </li>

            {/* Settings navigation */}
            <li>
              <div className="text-xs font-semibold leading-6 text-muted-foreground uppercase tracking-wider mb-2">
                Nastavitve
              </div>
              <ul role="list" className="-mx-2 space-y-1">
                {settingsNavigation.map((item) => (
                  <li key={item.name}>
                    <SheetClose asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors',
                          isActive(item.href)
                            ? 'bg-app-blue/10 text-app-blue'
                            : 'text-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0',
                            isActive(item.href)
                              ? 'text-app-blue'
                              : 'text-muted-foreground group-hover:text-foreground'
                          )}
                        />
                        {item.name}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </ScrollArea>

      {/* User info and sign out */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-app-blue/10 flex items-center justify-center">
            <User className="h-5 w-5 text-app-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.first_name} {profile?.last_name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.organization_name}
            </p>
          </div>
        </div>
        <SheetClose asChild>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Odjava
          </Button>
        </SheetClose>
      </div>
    </div>
  );
}
