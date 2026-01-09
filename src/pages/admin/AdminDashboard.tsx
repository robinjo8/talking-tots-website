import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { TestsLineChart } from '@/components/admin/TestsLineChart';
import { DifficultiesPieChart } from '@/components/admin/DifficultiesPieChart';
import { ClipboardList, Clock, User, CheckCircle } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';

export default function AdminDashboard() {
  const { profile, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { stats, isLoading: statsLoading } = useAdminStats();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome message */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Dobrodošli, {profile?.first_name} {profile?.last_name}
          </h1>
          <p className="text-muted-foreground">
            {profile?.organization_name} • Preglejte status testiranj izgovorjave
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Vsa testiranja"
            value={stats.totalTests}
            description="Število vseh opravljenih testov"
            icon={ClipboardList}
            color="blue"
            onClick={() => navigate('/admin/tests')}
          />
          <StatCard
            title="V čakanju na pregled"
            value={stats.pendingTests}
            description="Nepregledani testi"
            icon={Clock}
            color="orange"
            onClick={() => navigate('/admin/tests?status=pending')}
          />
          <StatCard
            title="Moji pregledi"
            value={stats.myReviews}
            description="Testi v vaši obravnavi"
            icon={User}
            color="green"
            onClick={() => navigate('/admin/tests?status=assigned')}
          />
          <StatCard
            title="Zaključeni pregledi"
            value={stats.completedTests}
            description="Testi z oddanim poročilom"
            icon={CheckCircle}
            color="purple"
            onClick={() => navigate('/admin/tests?status=completed')}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TestsLineChart />
          <DifficultiesPieChart />
        </div>
      </div>
    </AdminLayout>
  );
}
