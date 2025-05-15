
import { ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider } from "@/components/ui/sidebar";

export function AdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'dashboard';
  
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-dragon-green">Admin Portal</h1>
            <p className="text-muted-foreground mt-2">
              Upravljajte z uporabniki, vsebino in nastavitvami aplikacije
            </p>
          </div>
          
          <Tabs value={currentPath} className="mb-8">
            <TabsList className="bg-white border">
              <TabsTrigger value="dashboard" asChild>
                <Link to="/admin/dashboard">Nadzorna plošča</Link>
              </TabsTrigger>
              <TabsTrigger value="users" asChild>
                <Link to="/admin/users">Uporabniki</Link>
              </TabsTrigger>
              <TabsTrigger value="content" asChild>
                <Link to="/admin/content">Vsebina</Link>
              </TabsTrigger>
              <TabsTrigger value="settings" asChild>
                <Link to="/admin/settings">Nastavitve</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="bg-white shadow rounded-lg p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
