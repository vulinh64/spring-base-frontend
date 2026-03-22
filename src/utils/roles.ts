import type { UserRole } from "@/types";

export function isAdmin(roles: UserRole[]): boolean {
  return roles.includes("ADMIN");
}

export function isPowerUser(roles: UserRole[]): boolean {
  return roles.includes("POWER_USER") || roles.includes("ADMIN");
}
