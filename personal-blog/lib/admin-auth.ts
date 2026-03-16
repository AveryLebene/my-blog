/**
 * Admin Access Configuration
 *
 * This file defines which users have admin access to the application.
 * Since the Supabase database doesn't have custom roles,
 * we're using email-based authorization instead.
 *
 * Set NEXT_PUBLIC_ADMIN_EMAIL or NEXT_PUBLIC_ADMIN_EMAILS (comma-separated) in .env.local
 * so both server and client can authorize admin access.
 */

function loadAdminEmails(): string[] {
  const emails =
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ??
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ??
    process.env.ADMIN_EMAILS ??
    process.env.ADMIN_EMAIL ??
    "";
  return emails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * List of email addresses authorized to access admin areas (from env)
 */
export const authorizedAdminEmails = loadAdminEmails();

/**
 * Check if an email address has admin privileges
 * @param email The email address to check
 * @returns boolean indicating if the user has admin access
 */
export function isAuthorizedAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return authorizedAdminEmails.includes(email.toLowerCase());
}

/**
 * Check if a user object has admin privileges
 * @param user A user object with an email property
 * @returns boolean indicating if the user has admin access
 */
export function userHasAdminAccess(user: { email?: string | null }): boolean {
  return isAuthorizedAdmin(user?.email);
}
