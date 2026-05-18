import { PROGRAMS } from "../lib/data";

export default function Programs() {
    return (
        <section
            id="programs"
            data-testid="programs-section"
            className="bg-[#0B0B0B] py-24 md:py-32 border-t border-[#141414]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-14">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-px w-10 bg-[#C7F041]" />
                        <span className="font-poppins text-xs uppercase tracking-[0.3em] text-[#C7F041]">
                            Academy Programs
                        </span>
                    </div>
                    <h2 className="font-bebas text-white text-5xl md:text-6xl leading-none">
                        Built To Make You Better
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PROGRAMS.map((p) => (
                        <article
                            key={p.title}
                            data-testid={`program-${p.title.replace(/\s+/g, "-").toLowerCase()}`}
                            className="group bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden hover:-translate-y-1 hover:border-[#C7F041]/50 transition-all"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={p.img}
                                    alt={p.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] to-transparent" />
                            </div>
                            <div className="p-6">
                                <h3 className="font-bebas text-white text-2xl tracking-wide">{p.title}</h3>
                                <p className="font-poppins text-sm text-[#909090] mt-2 leading-relaxed">
                                    {p.desc}
                                </p>
                                <div className="mt-5 flex items-center justify-between border-t border-[#1d1d1d] pt-4">
                                    <span className="font-bebas text-[#C7F041] text-xl">{p.price}</span>
                                    <a
                                        href="#contact"
                                        className="font-poppins text-xs uppercase tracking-widest text-white hover:text-[#C7F041] transition-colors"
                                    >
                                        Enroll →
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
