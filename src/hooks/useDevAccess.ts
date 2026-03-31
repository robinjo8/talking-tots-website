import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { isDevUser } from "@/lib/devAccess";

export function useDevAccess() {
  const { user } = useAuth();
  const [isDev, setIsDev] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsDev(false);
      setLoading(false);
      return;
    }

    isDevUser(user.id).then((result) => {
      setIsDev(result);
      setLoading(false);
    });
  }, [user?.id]);

  return { isDev, loading };
}
