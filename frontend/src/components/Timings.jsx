import { Sun, Moon } from "lucide-react";

export default function Timings() {
    const batches = [
        { Icon: Sun, label: "Morning Batch", time: "6:00 AM – 8:00 AM", note: "Start your day strong." },
        { Icon: Moon, label: "Evening Batch", time: "4:30 PM – 7:00 PM", note: "Train after school or work." },
    ];
    return (
        <section
            data-testid="timings-section"
            className="bg-[#0B0B0B] py-24 md:py-28 border-t border-[#141414]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-px w-10 bg-[#C7F041]" />
                        <span className="font-poppins text-xs uppercase tracking-[0.3em] text-[#C7F041]">
                            Training Timings
                        </span>
                    </div>
                    <h2 className="font-bebas text-white text-5xl md:text-6xl leading-none">
                        Pick Your Slot
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {batches.map(({ Icon, label, time, note }) => (
                        <div
                            key={label}
                            data-testid={`timing-${label.replace(/\s+/g, "-").toLowerCase()}`}
                            className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-8 hover:border-[#C7F041]/40 transition-all"
                        >
                            <Icon size={28} strokeWidth={1.5} className="text-[#C7F041]" />
                            <div className="font-bebas text-2xl text-white mt-4 tracking-wide">{label}</div>
                            <div className="font-bebas text-5xl text-[#C7F041] mt-2">{time}</div>
                            <div className="font-poppins text-sm text-[#909090] mt-3">{note}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
