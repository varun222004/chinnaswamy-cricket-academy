import { IMAGES } from "../lib/data";
import { ArrowRight } from "lucide-react";

export default function Hero({ onBook }) {
    return (
        <section
            id="home"
            data-testid="hero-section"
            className="relative min-h-screen flex items-center overflow-hidden grain"
        >
            <img
                src={IMAGES.hero}
                alt="Cricket practice nets"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/80 to-[#0B0B0B]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
                <div className="max-w-3xl fade-up">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="h-px w-12 bg-[#C7F041]" />
                        <span className="font-poppins text-xs uppercase tracking-[0.3em] text-[#C7F041]">
                            Marsur · Bengaluru
                        </span>
                    </div>
                    <h1 className="font-bebas text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.95] tracking-wide">
                        Train. <br />
                        Practice. <br />
                        <span className="text-[#C7F041]">Dominate.</span>
                    </h1>
                    <p className="mt-8 font-poppins text-base sm:text-lg text-[#D1D1D1] max-w-xl leading-relaxed">
                        Professional cricket coaching and premium turf ground booking at Chinnaswamy Academy Marsur.
                        Two grounds. Pro coaches. Real match conditions.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-4">
                        <button
                            data-testid="hero-book-ground-btn"
                            onClick={onBook}
                            className="group inline-flex items-center gap-3 bg-[#C7F041] text-black font-bebas text-xl px-8 py-4 uppercase tracking-wider hover:bg-[#A5C635] transition-all rounded-sm"
                        >
                            Book Ground
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <a
                            href="#programs"
                            data-testid="hero-join-academy-btn"
                            className="inline-flex items-center gap-3 bg-transparent border border-[#333] text-white font-bebas text-xl px-8 py-4 uppercase tracking-wider hover:border-[#C7F041] hover:text-[#C7F041] transition-all rounded-sm"
                        >
                            Join Academy
                        </a>
                    </div>
                </div>

                <div className="hidden md:grid mt-20 grid-cols-3 max-w-3xl gap-px bg-[#1d1d1d] border border-[#1d1d1d]">
                    {[
                        ["02", "Cricket Grounds"],
                        ["10+", "Premium Facilities"],
                        ["365", "Days Open"],
                    ].map(([n, l]) => (
                        <div key={l} className="bg-[#0B0B0B] px-6 py-6">
                            <div className="font-bebas text-4xl text-[#C7F041]">{n}</div>
                            <div className="font-poppins text-xs uppercase tracking-widest text-[#D1D1D1] mt-1">
                                {l}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
