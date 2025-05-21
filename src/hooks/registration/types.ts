
export enum RegistrationStep {
  ACCOUNT_INFO = 0,
  SPEECH_DIFFICULTIES = 1,
  SPEECH_DEVELOPMENT = 2,
  PAYMENT_CONFIRMATION = 3
}

export interface ChildProfile {
  id: string;
  name: string;
  gender: "M" | "F";
  birthDate: Date | null;
  avatarId?: number;
  speechDifficulties?: string[];
  speechDevelopment?: Record<string, string>;
  isComplete?: boolean;
}
