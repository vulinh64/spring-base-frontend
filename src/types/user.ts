export type UserRole = "ADMIN" | "POWER_USER" | "USER";

export interface UserBasicResponse {
  id: string;
  username: string;
  email: string;
  userRoles: UserRole[];
}
