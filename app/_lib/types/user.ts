export type UserRole = "ADMIN" | "POWER_USER" | "USER";

export interface AccountInfo {
  id: string;
  username: string;
  email: string;
  displayName: string;
  roles: UserRole[];
}
