import { FACILITIES } from "../lib/data";

export default function Facilities() {
    return (
        <section
            id="facilities"
            data-testid="facilities-section"
            className="bg-[#0B0B0B] py-24 md:py-32 border-t border-[#141414]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-px w-10 bg-[#C7F041]" />
                            <span className="font-poppins text-xs uppercase tracking-[0.3em] text-[#C7F041]">
                                What's Inside
                            </span>
                        </div>
                        <h2 className="font-bebas text-white text-5xl md:text-6xl leading-none">
                            Premium Facilities
                        </h2>
                    </div>
                    <p className="font-poppins text-[#D1D1D1] max-w-md">
                        Everything you need to train, play and recover — purpose-built for cricket.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-[#1d1d1d] border border-[#1d1d1d]">
                    {FACILITIES.map(({ title, desc, Icon }) => (
                        <div
                            key={title}
                            data-testid={`facility-${title.replace(/\s+/g, "-").toLowerCase()}`}
                            className="group bg-[#0B0B0B] p-6 md:p-7 hover:bg-[#141414] transition-all duration-300 cursor-default"
                        >
                            <div className="w-11 h-11 rounded-sm border border-[#2A2A2A] flex items-center justify-center group-hover:border-[#C7F041] group-hover:bg-[#C7F041]/5 transition-all">
                                <Icon size={22} strokeWidth={1.5} className="text-[#C7F041]" />
                            </div>
                            <div className="font-bebas text-white text-xl tracking-wide mt-5">
                                {title}
                            </div>
                            <div className="font-poppins text-sm text-[#909090] mt-2 leading-relaxed">
                                {desc}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
