import { IMAGES } from "../lib/data";

export default function Gallery() {
    return (
        <section
            id="gallery"
            data-testid="gallery-section"
            className="bg-[#0B0B0B] py-24 md:py-32 border-t border-[#141414]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-px w-10 bg-[#C7F041]" />
                        <span className="font-poppins text-xs uppercase tracking-[0.3em] text-[#C7F041]">
                            Gallery
                        </span>
                    </div>
                    <h2 className="font-bebas text-white text-5xl md:text-6xl leading-none">
                        Life At The Academy
                    </h2>
                </div>

                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {IMAGES.gallery.map((src, i) => (
                        <div
                            key={src}
                            data-testid={`gallery-img-${i}`}
                            className="break-inside-avoid overflow-hidden rounded-sm border border-[#1d1d1d] group"
                        >
                            <img
                                src={src}
                                alt="Cricket academy moment"
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
