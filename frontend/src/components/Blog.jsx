import { useEffect, useState } from "react";
import { apiClient } from "../lib/api";
import { ArrowRight } from "lucide-react";

export default function Blog() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        apiClient.get("/blogs").then((r) => setPosts(r.data || [])).catch(() => {});
    }, []);

    return (
        <section
            id="blog"
            data-testid="blog-section"
            className="bg-[#0B0B0B] py-24 md:py-32 border-t border-[#141414]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-px w-10 bg-[#C7F041]" />
                            <span className="font-poppins text-xs uppercase tracking-[0.3em] text-[#C7F041]">
                                From The Pavilion
                            </span>
                        </div>
                        <h2 className="font-bebas text-white text-5xl md:text-6xl leading-none">
                            Latest Stories
                        </h2>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <p className="font-poppins text-[#909090]">No posts yet.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {posts.slice(0, 4).map((p) => (
                            <article
                                key={p.id}
                                data-testid={`blog-card-${p.id}`}
                                className="group bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden hover:-translate-y-1 hover:border-[#C7F041]/40 transition-all"
                            >
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={p.image_url}
                                        alt={p.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-5">
                                    <div className="font-poppins text-[10px] uppercase tracking-widest text-[#C7F041]">
                                        {p.author}
                                    </div>
                                    <h3 className="font-bebas text-xl text-white mt-2 leading-tight tracking-wide line-clamp-2">
                                        {p.title}
                                    </h3>
                                    <p className="font-poppins text-sm text-[#909090] mt-2 line-clamp-3">
                                        {p.excerpt}
                                    </p>
                                    <button
                                        data-testid={`blog-read-more-${p.id}`}
                                        className="mt-4 inline-flex items-center gap-2 font-poppins text-xs uppercase tracking-widest text-white hover:text-[#C7F041] transition-colors"
                                    >
                                        Read More <ArrowRight size={14} />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
