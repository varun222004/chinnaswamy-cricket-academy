import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // null=checking, false=anon, obj=logged in
    const [ready, setReady] = useState(false);

    useEffect(() => {
        apiClient
            .get("/auth/me")
            .then((r) => setUser(r.data))
            .catch(() => setUser(false))
            .finally(() => setReady(true));
    }, []);

    const login = useCallback(async (email, password) => {
        const { data } = await apiClient.post("/auth/login", { email, password });
        setUser(data);
        return data;
    }, []);

    const logout = useCallback(async () => {
        await apiClient.post("/auth/logout");
        setUser(false);
    }, []);

    const value = useMemo(
        () => ({ user, ready, login, logout }),
        [user, ready, login, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
