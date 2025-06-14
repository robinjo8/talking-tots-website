
import { Session, User } from "@supabase/supabase-js";

export type ChildProfile = {
  id?: string;
  name: string;
  gender: string;
  avatarId: number;
  age?: number;
  speechDifficulties?: string[];
};

export type Profile = {
  username: string | null;
  children?: ChildProfile[];
};

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  selectedChildIndex: number | null;
  setSelectedChildIndex: (index: number | null) => void;
  refreshProfile: () => Promise<void>;
};
