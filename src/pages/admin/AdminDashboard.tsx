import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { StatCard } from '@/components/admin/StatCard';
import { OrganizationPieChart } from '@/components/admin/OrganizationPieChart';
import { StatusPieChart } from '@/components/admin/StatusPieChart';
import { DifficultiesPieChart } from '@/components/admin/DifficultiesPieChart';
import { ClipboardList, Clock, Eye, CheckCircle, User, FileCheck } from 'lucide-react';
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

  const organizationName = profile?.organization_name || 'TomiTalk logoped';

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Dobrodošli, {profile?.first_name} {profile?.last_name}
        </h1>
        <p className="text-muted-foreground">
          {organizationName} • Preglejte status preverjanj izgovorjave
        </p>
      </div>

      {/* Organization stats section */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          📊 Organizacija ({organizationName})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Vsa preverjanja"
            value={stats.orgTotalTests}
            description="Skupno število opravljenih preverjanj"
            icon={ClipboardList}
            color="blue"
            onClick={() => navigate('/admin/tests')}
          />
          <StatCard
            title="V čakanju"
            value={stats.orgPendingTests}
            description="Pregledi, ki čakajo na prevzem"
            icon={Clock}
            color="orange"
            onClick={() => navigate('/admin/tests?status=pending')}
          />
          <StatCard
            title="Pregledano"
            value={stats.orgReviewedTests}
            description="Pregledi z oddanimi ocenami"
            icon={Eye}
            color="purple"
            onClick={() => navigate('/admin/tests?status=reviewed')}
          />
          <StatCard
            title="Zaključeno"
            value={stats.orgCompletedTests}
            description="Pregledi z generiranimi poročili"
            icon={CheckCircle}
            color="green"
            onClick={() => navigate('/admin/tests?status=completed')}
          />
        </div>
      </div>

      {/* Personal stats section */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          👤 Moje delo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Moji pregledi"
            value={stats.myTotalReviews}
            description="Vsi primeri, ki ste jih prevzeli"
            icon={User}
            color="blue"
            onClick={() => navigate('/admin/my-reviews')}
          />
          <StatCard
            title="V pregledu"
            value={stats.myInReviewCount}
            description="Primeri, ki jih aktivno pregledujete"
            icon={Clock}
            color="orange"
            onClick={() => navigate('/admin/my-reviews')}
          />
          <StatCard
            title="Pregledano"
            value={stats.myReviewedCount}
            description="Primeri z oddanimi ocenami"
            icon={Eye}
            color="purple"
            onClick={() => navigate('/admin/my-reviews')}
          />
          <StatCard
            title="Zaključeno"
            value={stats.myCompletedCount}
            description="Primeri z generiranim poročilom"
            icon={FileCheck}
            color="green"
            onClick={() => navigate('/admin/my-reviews')}
          />
        </div>
      </div>

      {/* Charts - Organization pie chart and Personal status pie chart side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrganizationPieChart />
        <StatusPieChart />
      </div>

      {/* Difficulties pie chart - full width below */}
      <DifficultiesPieChart />
    </div>
  );
}
