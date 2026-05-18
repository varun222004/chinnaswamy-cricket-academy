import { IMAGES } from "../lib/data";

const stats = [
    { n: "02", t: "Cricket Grounds", s: "Full-size astro turf pitches" },
    { n: "PRO", t: "Coaching", s: "Certified senior coaches" },
    { n: "ALL", t: "Astro Turf", s: "True match conditions" },
    { n: "I/O", t: "Indoor & Outdoor", s: "All-weather practice nets" },
];

export default function About() {
    return (
        <section
            id="about"
            data-testid="about-section"
            className="relative bg-[#0B0B0B] py-24 md:py-32"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[#1d1d1d]">
                            <img
                                src={IMAGES.aboutImg}
                                alt="Cricket coaching at academy"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 left-4 right-4 bg-[#0B0B0B]/85 backdrop-blur-md border border-[#2A2A2A] p-5">
                                <div className="font-bebas text-3xl text-[#C7F041]">EST. MARSUR</div>
                                <div className="font-poppins text-xs uppercase tracking-widest text-[#D1D1D1] mt-1">
                                    Cricket. Coaching. Community.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-px w-10 bg-[#C7F041]" />
                            <span className="font-poppins text-xs uppercase tracking-[0.3em] text-[#C7F041]">
                                About the academy
                            </span>
                        </div>
                        <h2 className="font-bebas text-white text-5xl md:text-6xl lg:text-7xl leading-none">
                            About Chinnaswamy <br /> Academy Marsur
                        </h2>
                        <p className="mt-6 font-poppins text-[#D1D1D1] text-base md:text-lg leading-relaxed max-w-2xl">
                            We're a serious cricket destination built for players who want to train like pros.
                            Two full-size astro turf grounds, structured coaching batches, open nets, and a bowling
                            machine — all in one premium facility at Marsur. Whether you're a junior starting out
                            or a senior team prepping for matches, this is your home ground.
                        </p>

                        <div className="mt-10 grid grid-cols-2 gap-px bg-[#1d1d1d] border border-[#1d1d1d]">
                            {stats.map((s) => (
                                <div
                                    key={s.t}
                                    data-testid={`about-stat-${s.t.replace(/\s+/g, "-").toLowerCase()}`}
                                    className="bg-[#0B0B0B] p-6 md:p-8 hover:bg-[#141414] transition-colors"
                                >
                                    <div className="font-bebas text-5xl md:text-6xl text-[#C7F041] leading-none">
                                        {s.n}
                                    </div>
                                    <div className="font-bebas text-white text-xl tracking-wide mt-3">
                                        {s.t}
                                    </div>
                                    <div className="font-poppins text-sm text-[#909090] mt-1">
                                        {s.s}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
