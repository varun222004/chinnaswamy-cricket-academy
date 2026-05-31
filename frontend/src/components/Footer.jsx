import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <footer
            data-testid="footer"
            className="bg-[#070707] border-t border-[#1d1d1d] py-14"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-10">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-sm bg-[#C7F041] flex items-center justify-center font-bebas text-black text-xl">
                            C
                        </span>
                        <div className="leading-none">
                            <div className="font-bebas text-white text-xl">CHINNASWAMY</div>
                            <div className="font-poppins text-[10px] text-[#C7F041] tracking-[0.3em]">
                                ACADEMY · MARSUR
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 font-poppins text-sm text-[#909090] max-w-xs leading-relaxed">
                        A premium turf cricket destination in Marsur — built for serious players and weekend warriors alike.
                    </p>
                </div>

                <div>
                    <div className="font-bebas text-white text-xl tracking-wide">Quick Links</div>
                    <ul className="mt-4 space-y-2 font-poppins text-sm text-[#909090]">
                        {["About", "Grounds", "Programs", "Gallery", "Blog", "Contact"].map((l) => (
                            <li key={l}>
                                <a href={`#${l.toLowerCase()}`} className="hover:text-[#C7F041] transition-colors">{l}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div className="font-bebas text-white text-xl tracking-wide">Contact</div>
                    <ul className="mt-4 space-y-2 font-poppins text-sm text-[#909090]">
                        <li>+91 98765 43210</li>
                        <li>hello@chinnaswamyacademy.in</li>
                        <li>Marsur, Bengaluru</li>
                    </ul>
                </div>

                <div>
                    <div className="font-bebas text-white text-xl tracking-wide">Follow</div>
                    <div className="mt-4 flex gap-3">
                        {[Instagram, Facebook, Twitter, Youtube].map((Icon) => (
                            <a
                                key={Icon.displayName || Icon.name}
                                href="#"
                                className="w-10 h-10 rounded-sm border border-[#2A2A2A] flex items-center justify-center text-[#D1D1D1] hover:text-[#C7F041] hover:border-[#C7F041] transition-colors"
                            >
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-[#1d1d1d] flex flex-col md:flex-row justify-between gap-3">
                <p className="font-poppins text-xs text-[#777]">
                    © {new Date().getFullYear()} Chinnaswamy Academy Marsur. All rights reserved.
                </p>
                <p className="font-poppins text-xs text-[#555]">Crafted for cricket.</p>
            </div>
        </footer>
    );
}
