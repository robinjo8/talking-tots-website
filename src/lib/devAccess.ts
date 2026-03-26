const DEV_EMAILS = ['qjavec@gmail.com', 'kujavec.robert@gmail.com'];

export const isDevUser = (email?: string | null): boolean =>
  !!email && DEV_EMAILS.includes(email);
