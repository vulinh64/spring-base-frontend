import { useAuth } from "@/auth/AuthProvider";
import type { UserRole } from "@/types";

const roleStyles: Record<UserRole, string> = {
  ADMIN: "bg-red-900/50 text-red-300 border border-red-700",
  POWER_USER: "bg-violet-900/50 text-violet-300 border border-violet-700",
  USER: "bg-blue-900/50 text-blue-300 border border-blue-700",
};

const roleLabels: Record<UserRole, string> = {
  ADMIN: "Admin",
  POWER_USER: "Power User",
  USER: "User",
};

export function UserDetailsPage() {
  const { username, displayName, email, roles } = useAuth();

  const avatarLetter = (username ?? "?")[0].toUpperCase();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-100">User Information</h1>
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left box — avatar + username */}
      <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-gray-800 bg-gray-900 p-10 md:w-72 shrink-0">
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-700 border-2 border-gray-600 text-4xl font-bold text-gray-100 select-none">
          {avatarLetter}
        </div>
        <span className="text-2xl font-semibold text-gray-100 break-all text-center">
          {username}
        </span>
      </div>

      {/* Right box — email + roles */}
      <div className="flex flex-col gap-6 flex-1 rounded-2xl border border-gray-800 bg-gray-900 p-10 justify-center">
        {displayName && (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                Full Name
              </span>
              <span className="text-xl font-medium text-gray-100">
                {displayName}
              </span>
            </div>
            <div className="w-full h-px bg-gray-800" />
          </>
        )}

        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
            Email
          </span>
          <span className="text-xl font-medium text-gray-100 break-all">
            {email}
          </span>
        </div>

        <div className="w-full h-px bg-gray-800" />

        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
            Roles
          </span>
          <div className="flex flex-wrap gap-2 mt-1">
            {roles.map((role) => (
              <span
                key={role}
                className={`px-3 py-1 rounded-full text-sm font-medium ${roleStyles[role]}`}
              >
                {roleLabels[role]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
