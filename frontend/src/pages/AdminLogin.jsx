import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { formatApiError } from "../lib/api";

export default function AdminLogin() {
    const { user, ready, login } = useAuth();
    const [email, setEmail] = useState("admin@academy.com");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    if (ready && user) return <Navigate to="/admin" replace />;

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success("Welcome back, Coach.");
            nav("/admin", { replace: true });
        } catch (err) {
            toast.error(formatApiError(err.response?.data?.detail) || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="flex items-center gap-2 justify-center mb-8">
                    <span className="w-9 h-9 rounded-sm bg-[#C7F041] flex items-center justify-center font-bebas text-black text-2xl">
                        C
                    </span>
                    <div className="leading-none">
                        <div className="font-bebas text-white text-2xl">CHINNASWAMY</div>
                        <div className="font-poppins text-[10px] text-[#C7F041] tracking-[0.3em] -mt-1">
                            ADMIN PANEL
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={submit}
                    data-testid="admin-login-form"
                    className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-8 space-y-4"
                >
                    <h1 className="font-bebas text-white text-3xl">Sign in</h1>
                    <input
                        data-testid="admin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email"
                        className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-sm p-4 font-poppins text-white outline-none focus:border-[#C7F041]"
                    />
                    <input
                        data-testid="admin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                        className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-sm p-4 font-poppins text-white outline-none focus:border-[#C7F041]"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        data-testid="admin-login-submit"
                        className="w-full bg-[#C7F041] text-black font-bebas text-lg py-3 uppercase tracking-wider hover:bg-[#A5C635] transition-colors rounded-sm disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
