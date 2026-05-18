import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { apiClient, formatApiError } from "../lib/api";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiClient.post("/contact", form);
            toast.success("Message sent! We'll get back to you shortly.");
            setForm({ name: "", email: "", phone: "", message: "" });
        } catch (err) {
            toast.error(formatApiError(err.response?.data?.detail) || "Failed to send");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            id="contact"
            data-testid="contact-section"
            className="bg-[#0B0B0B] py-24 md:py-32 border-t border-[#141414]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-px w-10 bg-[#C7F041]" />
                        <span className="font-poppins text-xs uppercase tracking-[0.3em] text-[#C7F041]">
                            Get In Touch
                        </span>
                    </div>
                    <h2 className="font-bebas text-white text-5xl md:text-6xl leading-none">
                        Drop In. Book A Net. <br /> Or Just Say Hi.
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <ContactRow Icon={Phone} label="Phone" value="+91 98765 43210" testid="contact-phone" />
                        <ContactRow Icon={MessageCircle} label="WhatsApp" value="+91 98765 43210" testid="contact-whatsapp" />
                        <ContactRow Icon={Mail} label="Email" value="hello@chinnaswamyacademy.in" testid="contact-email" />
                        <ContactRow Icon={MapPin} label="Address" value="Chinnaswamy Academy, Marsur, Bengaluru, Karnataka" testid="contact-address" />

                        <div className="rounded-sm overflow-hidden border border-[#1d1d1d] aspect-[16/9]">
                            <iframe
                                title="Map"
                                src="https://www.google.com/maps?q=Marsur,Bengaluru&output=embed"
                                className="w-full h-full grayscale contrast-125"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <form
                        onSubmit={submit}
                        data-testid="contact-form"
                        className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 md:p-8 space-y-4"
                    >
                        <Field name="name" placeholder="Full name" value={form.name} setForm={setForm} required />
                        <Field name="email" type="email" placeholder="Email" value={form.email} setForm={setForm} required />
                        <Field name="phone" placeholder="Phone" value={form.phone} setForm={setForm} />
                        <textarea
                            name="message"
                            data-testid="contact-message"
                            placeholder="How can we help?"
                            value={form.message}
                            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                            rows={5}
                            required
                            className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-sm p-4 font-poppins text-white outline-none focus:border-[#C7F041]"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            data-testid="contact-submit-btn"
                            className="w-full bg-[#C7F041] text-black font-bebas text-lg py-3 uppercase tracking-wider hover:bg-[#A5C635] transition-colors rounded-sm disabled:opacity-60"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

function ContactRow({ Icon, label, value, testid }) {
    return (
        <div data-testid={testid} className="flex gap-4 items-start border-b border-[#1d1d1d] pb-5">
            <div className="w-11 h-11 rounded-sm border border-[#2A2A2A] flex items-center justify-center text-[#C7F041]">
                <Icon size={20} strokeWidth={1.5} />
            </div>
            <div>
                <div className="font-poppins text-xs uppercase tracking-widest text-[#909090]">{label}</div>
                <div className="font-bebas text-xl text-white mt-1 tracking-wide">{value}</div>
            </div>
        </div>
    );
}

function Field({ name, type = "text", placeholder, value, setForm, required }) {
    return (
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            data-testid={`contact-${name}`}
            value={value}
            onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
            className="w-full bg-[#0B0B0B] border border-[#2A2A2A] rounded-sm p-4 font-poppins text-white outline-none focus:border-[#C7F041]"
        />
    );
}
