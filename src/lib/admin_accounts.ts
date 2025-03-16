export function isAdminEmail(email: string | null): boolean {
  if (!email) return false;
  const adminEmails = ['meidadtr@gmail.com', 'trpazpaz@gmail.com'];
  return adminEmails.includes(email.toLowerCase());
}

export function getDailyRatingLimit(email: string | null): number {
  if (isAdminEmail(email)) {
    return Infinity;
  }
  return 5; // Default limit for regular users
} 