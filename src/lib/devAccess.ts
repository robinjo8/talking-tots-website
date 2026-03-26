const DEV_EMAILS = ['qjavec@gmail.com', 'kuajvec.robert@gmail.com'];

export const isDevUser = (email?: string | null): boolean =>
  !!email && DEV_EMAILS.includes(email);
