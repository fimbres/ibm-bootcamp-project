import { useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useStorageState } from "~/hooks/useStorageState";
import { AuthInput, UserService, RegisterInput } from "~/services/user.service";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (data: AuthInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [[isLoadinUser, storedUser], setStoredUser] = useStorageState("user");
  const [[isLoadingToken, storedToken], setStoredToken] =
    useStorageState("token");
  const [isLoading, setIsLoading] = useState(true);
  const userService = new UserService();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isLoadinUser || isLoadingToken) return;

    const loadData = () => {
      setIsLoading(true);

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data from storage:", error);
          setStoredUser(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      if (storedToken) {
        setToken(storedToken);
      } else {
        setToken(null);
      }

      setIsLoading(false);
    };

    loadData();
  }, [isLoadinUser, isLoadingToken, storedUser, storedToken, setStoredUser]);

  const signIn = useCallback(
    async (data: AuthInput) => {
      setIsLoading(true);
      try {
        const response = await userService.auth(data);
        if (response.error) {
          throw new Error(response.error);
        }
        const userData: User = {
          name: data.email,
          email: data.email,
        };
        setUser(userData);
        setStoredUser(JSON.stringify(userData));
        setToken(response.data?.token!);
        setStoredToken(response.data?.token!);
        //@ts-ignore
        queryClient?.refetchQueries(["posts", "feed"]);
      } catch (error: any) {
        console.error("Sign-in error:", error.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [userService, setStoredUser, setStoredToken]
  );

  const register = useCallback(
    async (data: RegisterInput) => {
      setIsLoading(true);
      try {
        const response = await userService.register(data);
        if (response.error) {
          throw new Error(response.error);
        }
        const userData: User = {
          name: data.name,
          email: data.email,
        };
        setUser(userData);
        setStoredUser(JSON.stringify(userData));
        setToken(response.data?.token!);
        setStoredToken(response.data?.token!);
        //@ts-ignore
        queryClient?.refetchQueries(["posts", "feed"]);
      } catch (error: any) {
        console.error("Registration error:", error.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [userService, setStoredUser, setStoredToken]
  );

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    setStoredUser(null);
    setStoredToken(null);
  }, [setStoredUser, setStoredToken]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    signIn,
    register,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
