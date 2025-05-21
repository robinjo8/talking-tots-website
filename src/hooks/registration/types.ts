
export interface ChildProfile {
  id: string;
  name: string;
  gender: string;
  birthDate: Date | null;
  avatarId: number;
  speechDifficulties?: string[];
  speechDevelopment?: Record<string, string>;
  isComplete?: boolean;
}

export enum RegistrationStep {
  ACCOUNT_INFO,
  SPEECH_DIFFICULTIES,
  SPEECH_DEVELOPMENT,
  REVIEW_CHILD,
  PAYMENT_CONFIRMATION
}
