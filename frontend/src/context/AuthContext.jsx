import { createContext, useContext, useEffect, useState } from "react";
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

    const login = async (email, password) => {
        const { data } = await apiClient.post("/auth/login", { email, password });
        setUser(data);
        return data;
    };

    const logout = async () => {
        await apiClient.post("/auth/logout");
        setUser(false);
    };

    return (
        <AuthContext.Provider value={{ user, ready, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
