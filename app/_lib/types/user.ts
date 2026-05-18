export type UserRole = "ADMIN" | "POWER_USER" | "USER";

export interface UserBasicResponse {
  id: string;
  username: string;
  displayName: string;
  email: string;
  roles: UserRole[];
}
