import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#grounds", label: "Grounds" },
    { href: "#programs", label: "Programs" },
    { href: "#gallery", label: "Gallery" },
    { href: "#blog", label: "Blog" },
    { href: "#contact", label: "Contact" },
];

export default function Navbar({ onBook }) {
    const [open, setOpen] = useState(false);
    return (
        <nav
            data-testid="main-navbar"
            className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B]/90 backdrop-blur-xl border-b border-[#1d1d1d]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <a href="#home" data-testid="nav-logo" className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-sm bg-[#C7F041] flex items-center justify-center font-bebas text-black text-xl">
                        C
                    </span>
                    <div className="leading-none">
                        <div className="font-bebas text-white text-2xl tracking-wider">CHINNASWAMY</div>
                        <div className="font-poppins text-[10px] text-[#C7F041] tracking-[0.3em] -mt-1">
                            ACADEMY · MARSUR
                        </div>
                    </div>
                </a>

                <div className="hidden lg:flex items-center gap-8">
                    {links.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            data-testid={`nav-link-${l.label.toLowerCase()}`}
                            className="font-poppins text-sm uppercase tracking-wider text-[#D1D1D1] hover:text-[#C7F041] transition-colors"
                        >
                            {l.label}
                        </a>
                    ))}
                    <Link
                        to="/admin/login"
                        data-testid="nav-admin-link"
                        className="font-poppins text-xs uppercase tracking-widest text-[#777] hover:text-white transition-colors"
                    >
                        Admin
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        data-testid="navbar-book-ground-btn"
                        onClick={onBook}
                        className="hidden sm:inline-flex bg-[#C7F041] text-black font-bebas text-base px-6 py-3 uppercase tracking-wider hover:bg-[#A5C635] transition-colors rounded-sm"
                    >
                        Book Ground
                    </button>
                    <button
                        data-testid="navbar-mobile-toggle"
                        className="lg:hidden p-2 text-white"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="lg:hidden bg-[#0B0B0B] border-t border-[#1d1d1d] px-6 py-6 space-y-4">
                    {links.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                            className="block font-poppins text-base uppercase tracking-wider text-[#D1D1D1] hover:text-[#C7F041]"
                        >
                            {l.label}
                        </a>
                    ))}
                    <Link
                        to="/admin/login"
                        onClick={() => setOpen(false)}
                        data-testid="mobile-nav-admin"
                        className="block font-poppins text-sm uppercase tracking-widest text-[#777]"
                    >
                        Admin Login
                    </Link>
                    <button
                        data-testid="mobile-book-ground-btn"
                        onClick={() => {
                            setOpen(false);
                            onBook();
                        }}
                        className="w-full bg-[#C7F041] text-black font-bebas text-lg px-6 py-3 uppercase tracking-wider rounded-sm"
                    >
                        Book Ground
                    </button>
                </div>
            )}
        </nav>
    );
}
