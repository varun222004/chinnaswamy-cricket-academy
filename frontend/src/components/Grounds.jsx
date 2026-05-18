import { Check, Clock } from "lucide-react";
import { GROUNDS_LIST } from "../lib/data";

export default function Grounds({ onBook }) {
    return (
        <section
            id="grounds"
            data-testid="grounds-section"
            className="bg-[#0B0B0B] py-24 md:py-32 border-t border-[#141414]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-px w-10 bg-[#C7F041]" />
                            <span className="font-poppins text-xs uppercase tracking-[0.3em] text-[#C7F041]">
                                Our Grounds
                            </span>
                        </div>
                        <h2 className="font-bebas text-white text-5xl md:text-6xl leading-none">
                            Play Where The <br /> Pros Train
                        </h2>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {GROUNDS_LIST.map((g) => (
                        <div
                            key={g.id}
                            data-testid={`ground-card-${g.id}`}
                            className="group bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden hover:border-[#C7F041]/50 transition-all"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <img
                                    src={g.img}
                                    alt={g.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                    <h3 className="font-bebas text-white text-3xl md:text-4xl leading-none">
                                        {g.name}
                                    </h3>
                                </div>
                            </div>

                            <div className="p-6 md:p-8">
                                <p className="font-poppins text-[#D1D1D1] text-sm leading-relaxed">
                                    {g.desc}
                                </p>

                                <div className="mt-5 grid grid-cols-2 gap-2">
                                    {g.features.map((f) => (
                                        <div key={f} className="flex items-center gap-2 text-sm text-[#D1D1D1] font-poppins">
                                            <Check size={14} className="text-[#C7F041]" />
                                            {f}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-5 flex items-center gap-2 text-sm text-[#909090] font-poppins border-t border-[#1d1d1d] pt-4">
                                    <Clock size={14} className="text-[#C7F041]" />
                                    {g.timing}
                                </div>

                                <button
                                    data-testid={`book-now-${g.id}`}
                                    onClick={() => onBook(g.id)}
                                    className="mt-6 w-full bg-[#C7F041] text-black font-bebas text-lg py-3 uppercase tracking-wider hover:bg-[#A5C635] transition-colors rounded-sm"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
