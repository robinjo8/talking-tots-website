
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminUsersManagement from "@/components/admin/AdminUsersManagement";
import AdminContentManagement from "@/components/admin/AdminContentManagement";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminSettings from "@/components/admin/AdminSettings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <div className="container max-w-7xl mx-auto pt-28 pb-20 px-4">
        <h1 className="text-3xl font-bold mb-8">Administratorska nadzorna plošča</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="users">Uporabniki</TabsTrigger>
            <TabsTrigger value="content">Vsebine</TabsTrigger>
            <TabsTrigger value="analytics">Analitika</TabsTrigger>
            <TabsTrigger value="settings">Nastavitve</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <AdminUsersManagement />
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4">
            <AdminContentManagement />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <AdminAnalytics />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
