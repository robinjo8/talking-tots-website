import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export interface LicenseStats {
  licenseName: string;
  maxChildren: number;
  usedSlots: number;
  availableSlots: number;
  expiresAt: string | null;
  status: string;
  isOrganizationLicense: boolean;
  organizationName: string | null;
}

export function useLogopedistLicense() {
  const { user } = useAdminAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['logopedist-license', user?.id],
    queryFn: async (): Promise<LicenseStats | null> => {
      if (!user?.id) return null;

      // Najprej poskusi novo organizacijsko funkcijo
      const { data: orgData, error: orgError } = await supabase
        .rpc('get_organization_license_stats', { p_user_id: user.id });

      if (!orgError && orgData && orgData.length > 0) {
        const row = orgData[0];
        return {
          licenseName: row.license_name,
          maxChildren: row.max_children,
          usedSlots: row.used_slots,
          availableSlots: row.available_slots,
          expiresAt: row.expires_at,
          status: row.status,
          isOrganizationLicense: row.is_organization_license,
          organizationName: row.organization_name,
        };
      }

      // Fallback na staro funkcijo če nova ne vrne rezultatov
      const { data, error } = await supabase
        .rpc('get_logopedist_license_stats', { p_user_id: user.id });

      if (error) {
        console.error('Error fetching license stats:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return null;
      }

      const row = data[0];
      return {
        licenseName: row.license_name,
        maxChildren: row.max_children,
        usedSlots: row.used_slots,
        availableSlots: row.available_slots,
        expiresAt: row.expires_at,
        status: row.status,
        isOrganizationLicense: false,
        organizationName: null,
      };
    },
    enabled: !!user?.id,
    staleTime: 30000, // 30 sekund
  });

  const hasLicense = !!data && data.status === 'active';
  const isNearLimit = data ? data.availableSlots <= 2 : false;
  const isAtLimit = data ? data.availableSlots === 0 : false;

  return {
    license: data,
    hasLicense,
    isNearLimit,
    isAtLimit,
    isLoading,
    error,
    refetch,
  };
}
