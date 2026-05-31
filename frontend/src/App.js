import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const TOAST_OPTIONS = {
    style: {
        background: "#141414",
        border: "1px solid #2A2A2A",
        color: "#fff",
        fontFamily: "Poppins, sans-serif",
    },
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </BrowserRouter>
            <Toaster position="top-right" theme="dark" toastOptions={TOAST_OPTIONS} />
        </AuthProvider>
    );
}

export default App;
