import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { UserRole, UserBasicResponse } from "@/types";
import { login as authLogin, logout as authLogout } from "./keycloak";
import axios from "axios";

interface AuthState {
  initialized: boolean;
  authenticated: boolean;
  userId: string | null;
  username: string | null;
  email: string | null;
  roles: UserRole[];
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<string>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextValue>({
  initialized: false,
  authenticated: false,
  userId: null,
  username: null,
  email: null,
  roles: [],
  login: async () => "",
  logout: () => {},
  hasRole: () => false,
});

const UNAUTHENTICATED: AuthState = {
  initialized: true,
  authenticated: false,
  userId: null,
  username: null,
  email: null,
  roles: [],
};

async function fetchMe(): Promise<AuthState> {
  const { data } = await axios.get<{ data: UserBasicResponse }>("/api/auth/me", {
    withCredentials: true,
  });
  const user = data.data;

  return {
    initialized: true,
    authenticated: true,
    userId: user.id,
    username: user.username,
    email: user.email,
    roles: user.userRoles,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    initialized: false,
    authenticated: false,
    userId: null,
    username: null,
    email: null,
    roles: [],
  });

  // On mount, try to restore session
  useEffect(() => {
    fetchMe()
      .then(setState)
      .catch(() => setState(UNAUTHENTICATED));
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<string> => {
    await authLogin(username, password);
    const userState = await fetchMe();
    setState(userState);
    return userState.userId!;
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setState(UNAUTHENTICATED);
  }, []);

  const hasRole = useCallback(
    (role: UserRole) => state.roles.includes(role),
    [state.roles]
  );

  return (
    <AuthContext.Provider value={{ ...state, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
