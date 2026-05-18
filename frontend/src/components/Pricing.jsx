import { Check } from "lucide-react";

const TIERS = [
    {
        name: "Nets Booking",
        price: "₹250",
        unit: "/ hour",
        features: ["Single net access", "Bowling machine add-on", "Ideal for solo practice", "Pay-as-you-go"],
    },
    {
        name: "Coaching",
        price: "₹3,000",
        unit: "/ month",
        highlight: true,
        features: ["Morning or Evening batch", "Group sessions", "Structured drills", "Match practice access"],
    },
    {
        name: "1-on-1 Coaching",
        price: "₹12,000",
        unit: "package",
        features: ["Private sessions", "Video analysis", "Bowling machine drills", "Personalised plan"],
    },
];

export default function Pricing({ onBook }) {
    return (
        <section
            data-testid="pricing-section"
            className="bg-[#0B0B0B] py-24 md:py-32 border-t border-[#141414]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-14">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-px w-10 bg-[#C7F041]" />
                        <span className="font-poppins text-xs uppercase tracking-[0.3em] text-[#C7F041]">
                            Pricing
                        </span>
                    </div>
                    <h2 className="font-bebas text-white text-5xl md:text-6xl leading-none">
                        Simple. Transparent. <br /> No Surprises.
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {TIERS.map((t) => (
                        <div
                            key={t.name}
                            data-testid={`pricing-${t.name.replace(/\s+/g, "-").toLowerCase()}`}
                            className={`relative rounded-sm border p-8 transition-all flex flex-col ${
                                t.highlight
                                    ? "bg-[#141414] border-[#C7F041] shadow-[0_8px_40px_rgba(199,240,65,0.08)]"
                                    : "bg-[#141414] border-[#2A2A2A] hover:border-[#C7F041]/40"
                            }`}
                        >
                            {t.highlight && (
                                <span className="absolute -top-3 left-8 bg-[#C7F041] text-black font-bebas text-xs px-3 py-1 tracking-widest rounded-sm">
                                    POPULAR
                                </span>
                            )}
                            <div className="font-bebas text-white text-2xl tracking-wide">{t.name}</div>
                            <div className="mt-4 flex items-end gap-2">
                                <span className="font-bebas text-5xl md:text-6xl text-[#C7F041]">{t.price}</span>
                                <span className="font-poppins text-sm text-[#909090] pb-2">{t.unit}</span>
                            </div>
                            <ul className="mt-6 space-y-3 flex-1">
                                {t.features.map((f) => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-[#D1D1D1] font-poppins">
                                        <Check size={16} className="text-[#C7F041]" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                data-testid={`pricing-cta-${t.name.replace(/\s+/g, "-").toLowerCase()}`}
                                onClick={onBook}
                                className={`mt-8 w-full font-bebas text-lg py-3 uppercase tracking-wider rounded-sm transition-colors ${
                                    t.highlight
                                        ? "bg-[#C7F041] text-black hover:bg-[#A5C635]"
                                        : "bg-transparent border border-[#333] text-white hover:border-[#C7F041] hover:text-[#C7F041]"
                                }`}
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
