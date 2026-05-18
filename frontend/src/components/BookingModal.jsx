import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { apiClient, formatApiError } from "../lib/api";
import { GROUNDS_LIST } from "../lib/data";

export default function BookingModal({ open, onClose, initialGround }) {
    const [step, setStep] = useState(1); // 1 select, 2 form
    const [groundId, setGroundId] = useState(initialGround || "ground-1");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [slots, setSlots] = useState([]);
    const [slotId, setSlotId] = useState("");
    const [form, setForm] = useState({ full_name: "", phone: "", email: "", team_name: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialGround) setGroundId(initialGround);
    }, [initialGround]);

    useEffect(() => {
        if (!open) return;
        setStep(1);
        setSlotId("");
        setForm({ full_name: "", phone: "", email: "", team_name: "" });
    }, [open]);

    useEffect(() => {
        if (!open) return;
        apiClient
            .get("/slots", { params: { ground_id: groundId, date } })
            .then((r) => setSlots(r.data || []))
            .catch(() => setSlots([]));
    }, [groundId, date, open]);

    if (!open) return null;

    const submit = async (e) => {
        e.preventDefault();
        if (!slotId) {
            toast.error("Please select a slot first.");
            return;
        }
        setLoading(true);
        try {
            await apiClient.post("/bookings", {
                ...form,
                email: form.email || null,
                team_name: form.team_name || null,
                ground_id: groundId,
                date,
                slot_id: slotId,
            });
            toast.success("Slot request submitted! Academy team will contact you shortly.");
            onClose();
        } catch (err) {
            toast.error(formatApiError(err.response?.data?.detail) || "Booking failed.");
        } finally {
            setLoading(false);
        }
    };

    const minDate = new Date().toISOString().slice(0, 10);
    const selectedSlot = slots.find((s) => s.id === slotId);

    return (
        <div
            data-testid="booking-modal"
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
            onClick={onClose}
        >
            <div
                className="relative w-full md:max-w-3xl bg-[#0B0B0B] border border-[#2A2A2A] rounded-t-md md:rounded-sm max-h-[92vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    data-testid="booking-close-btn"
                    className="absolute top-4 right-4 w-9 h-9 rounded-sm border border-[#2A2A2A] flex items-center justify-center text-white hover:text-[#C7F041] hover:border-[#C7F041]"
                >
                    <X size={18} />
                </button>
                <div className="p-6 md:p-10">
                    <div className="font-poppins text-xs uppercase tracking-[0.3em] text-[#C7F041]">
                        Step {step} of 2
                    </div>
                    <h3 className="font-bebas text-white text-4xl md:text-5xl mt-2 leading-none">
                        {step === 1 ? "Pick Ground, Date & Slot" : "Your Details"}
                    </h3>

                    {step === 1 ? (
                        <div className="mt-8 space-y-6">
                            <div>
                                <Label>Select Ground</Label>
                                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                                    {GROUNDS_LIST.map((g) => (
                                        <button
                                            key={g.id}
                                            data-testid={`select-ground-${g.id}`}
                                            onClick={() => setGroundId(g.id)}
                                            className={`text-left p-4 rounded-sm border transition-all ${
                                                groundId === g.id
                                                    ? "border-[#C7F041] bg-[#C7F041]/5"
                                                    : "border-[#2A2A2A] bg-[#141414] hover:border-[#444]"
                                            }`}
                                        >
                                            <div className="font-bebas text-white text-xl tracking-wide">{g.name}</div>
                                            <div className="font-poppins text-xs text-[#909090] mt-1">{g.timing}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label>Select Date</Label>
                                <input
                                    type="date"
                                    data-testid="booking-date-input"
                                    min={minDate}
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="mt-3 w-full md:w-64 bg-[#141414] border border-[#2A2A2A] rounded-sm p-3 font-poppins text-white outline-none focus:border-[#C7F041]"
                                />
                            </div>

                            <div>
                                <Label>Select Slot</Label>
                                <div className="grid sm:grid-cols-3 gap-3 mt-3">
                                    {slots.map((s) => (
                                        <button
                                            key={s.id}
                                            data-testid={`select-slot-${s.id}`}
                                            disabled={!s.available}
                                            onClick={() => setSlotId(s.id)}
                                            className={`text-left p-4 rounded-sm border transition-all ${
                                                !s.available
                                                    ? "border-[#1d1d1d] bg-[#0e0e0e] opacity-50 cursor-not-allowed"
                                                    : slotId === s.id
                                                    ? "border-[#C7F041] bg-[#C7F041]/5"
                                                    : "border-[#2A2A2A] bg-[#141414] hover:border-[#444]"
                                            }`}
                                        >
                                            <div className="font-bebas text-white text-lg">{s.label}</div>
                                            <div className="font-bebas text-[#C7F041] text-2xl mt-1">
                                                ₹{s.price.toLocaleString()}
                                            </div>
                                            <div className="font-poppins text-xs text-[#909090] mt-1">
                                                {s.available ? "Available" : "Booked"}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                data-testid="booking-next-btn"
                                disabled={!slotId}
                                onClick={() => setStep(2)}
                                className="w-full bg-[#C7F041] text-black font-bebas text-lg py-3 uppercase tracking-wider hover:bg-[#A5C635] transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={submit} data-testid="booking-form" className="mt-8 space-y-4">
                            <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-poppins">
                                <Info l="Ground" v={GROUNDS_LIST.find((g) => g.id === groundId)?.name} />
                                <Info l="Date" v={date} />
                                <Info l="Slot" v={selectedSlot?.label} />
                                <Info l="Price" v={`₹${selectedSlot?.price?.toLocaleString()}`} />
                            </div>

                            <Input data-testid="booking-fullname" name="full_name" placeholder="Full Name" form={form} setForm={setForm} required />
                            <Input data-testid="booking-phone" name="phone" placeholder="Phone Number" form={form} setForm={setForm} required />
                            <Input data-testid="booking-email" name="email" type="email" placeholder="Email (optional)" form={form} setForm={setForm} />
                            <Input data-testid="booking-team" name="team_name" placeholder="Team Name (optional)" form={form} setForm={setForm} />

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    data-testid="booking-back-btn"
                                    className="flex-1 bg-transparent border border-[#333] text-white font-bebas text-lg py-3 uppercase tracking-wider hover:border-[#C7F041] hover:text-[#C7F041] transition-colors rounded-sm"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    data-testid="booking-submit-btn"
                                    className="flex-1 bg-[#C7F041] text-black font-bebas text-lg py-3 uppercase tracking-wider hover:bg-[#A5C635] transition-colors rounded-sm disabled:opacity-60"
                                >
                                    {loading ? "Submitting..." : "Confirm Booking"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

function Label({ children }) {
    return (
        <div className="font-poppins text-xs uppercase tracking-[0.25em] text-[#909090]">{children}</div>
    );
}

function Info({ l, v }) {
    return (
        <div>
            <div className="text-[#909090] text-xs uppercase tracking-widest">{l}</div>
            <div className="text-white font-bebas text-lg">{v}</div>
        </div>
    );
}

function Input({ name, placeholder, type = "text", required, form, setForm, ...rest }) {
    return (
        <input
            {...rest}
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            value={form[name] || ""}
            onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
            className="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm p-4 font-poppins text-white outline-none focus:border-[#C7F041]"
        />
    );
}
