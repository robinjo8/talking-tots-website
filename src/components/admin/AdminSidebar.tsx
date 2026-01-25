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
  FileText,
  Users,
  MessageSquare,
  Settings,
  Bell,
  LogOut,
  UserCheck,
  LucideIcon
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useAdminCounts } from '@/hooks/useAdminCounts';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  count?: number;
}

function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-app-orange text-[10px] font-bold text-white px-1">
      {count > 99 ? '99+' : count}
    </span>
  );
}

const baseNavigation: NavItem[] = [
  { name: 'Moj portal', href: '/admin', icon: LayoutDashboard },
  { name: 'Vsa preverjanja', href: '/admin/all-tests', icon: ClipboardList },
  { name: 'V čakanju', href: '/admin/pending', icon: Clock },
  { name: 'Moji pregledi', href: '/admin/my-reviews', icon: User },
];

const secondaryNavigation: NavItem[] = [
  { name: 'Uporabniki', href: '/admin/users', icon: Users },
  { name: 'Poročila', href: '/admin/reports', icon: FileText },
  { name: 'Sporočila', href: '/admin/messages', icon: MessageSquare },
];

const baseSettingsNavigation: NavItem[] = [
  { name: 'Nastavitve', href: '/admin/settings', icon: Settings },
  { name: 'Obvestila', href: '/admin/notifications', icon: Bell },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile, isSuperAdmin } = useAdminAuth();
  const { pendingCount, myReviewsCount } = useAdminCounts();

  // Navigation with dynamic counts
  const navigation: NavItem[] = baseNavigation.map(item => {
    if (item.href === '/admin/pending') {
      return { ...item, count: pendingCount };
    }
    if (item.href === '/admin/my-reviews') {
      return { ...item, count: myReviewsCount };
    }
    return item;
  });

  // Dinamično sestavljen meni nastavitev - "Članstva" samo za super admina
  const settingsNavigation: NavItem[] = [
    ...baseSettingsNavigation,
    ...(isSuperAdmin ? [{ name: 'Članstva', href: '/admin/memberships', icon: UserCheck }] : []),
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.warn('SignOut failed, redirecting anyway:', error);
    }
    // Počisti tudi sessionStorage za splash screen
    sessionStorage.removeItem('splashShown');
    // Vedno preusmeri s trdo osveževanje - zagotovi čisto stanje
    window.location.href = '/admin/login';
  };

  const isActive = (href: string) => {
    if (href.includes('?')) {
      return location.pathname + location.search === href;
    }
    return location.pathname === href;
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center border-b border-border">
          <Link to="/admin" className="flex items-center gap-1">
            <span className="text-xl font-extrabold text-dragon-green uppercase">Tomi</span>
            <span className="text-xl font-extrabold text-app-orange uppercase">Talk</span>
          </Link>
          <span className="ml-2 text-xs text-app-blue font-medium bg-app-blue/10 px-2 py-0.5 rounded">
            Admin
          </span>
        </div>

        <ScrollArea className="flex-1">
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
                        {item.count !== undefined && item.count > 0 && (
                          <NotificationBadge count={item.count} />
                        )}
                      </Link>
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
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </ScrollArea>

        {/* User info and sign out */}
        <div className="border-t border-border pt-4">
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
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Odjava
          </Button>
        </div>
      </div>
    </div>
  );
}
