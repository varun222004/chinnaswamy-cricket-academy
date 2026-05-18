import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, LayoutDashboard, CalendarCheck, UserPlus, ClipboardCheck, FileText, Trash2, CheckCircle, XCircle, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiClient, formatApiError } from "../lib/api";

const TABS = [
    { id: "overview", label: "Overview", Icon: LayoutDashboard },
    { id: "bookings", label: "Bookings", Icon: CalendarCheck },
    { id: "admissions", label: "Admissions", Icon: UserPlus },
    { id: "attendance", label: "Attendance", Icon: ClipboardCheck },
    { id: "blogs", label: "Blog Mgmt", Icon: FileText },
];

export default function AdminDashboard() {
    const { user, ready, logout } = useAuth();
    const [tab, setTab] = useState("overview");
    const nav = useNavigate();

    if (ready && !user) return <Navigate to="/admin/login" replace />;
    if (!ready) return <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-white font-poppins">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white">
            <aside className="fixed inset-y-0 left-0 w-64 bg-[#070707] border-r border-[#1d1d1d] hidden md:flex flex-col">
                <div className="px-6 py-6 border-b border-[#1d1d1d]">
                    <div className="font-bebas text-2xl tracking-wide">CHINNASWAMY</div>
                    <div className="font-poppins text-[10px] text-[#C7F041] tracking-[0.3em]">ADMIN</div>
                </div>
                <nav className="flex-1 px-3 py-6 space-y-1">
                    {TABS.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            data-testid={`tab-${id}`}
                            onClick={() => setTab(id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-poppins text-sm transition-colors ${
                                tab === id
                                    ? "bg-[#C7F041]/10 text-[#C7F041] border border-[#C7F041]/30"
                                    : "text-[#909090] hover:text-white hover:bg-[#141414]"
                            }`}
                        >
                            <Icon size={16} /> {label}
                        </button>
                    ))}
                </nav>
                <div className="p-3 border-t border-[#1d1d1d]">
                    <button
                        data-testid="admin-logout-btn"
                        onClick={async () => { await logout(); nav("/admin/login"); }}
                        className="w-full flex items-center gap-2 px-4 py-3 rounded-sm font-poppins text-sm text-[#909090] hover:text-white hover:bg-[#141414]"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            <main className="md:ml-64 p-6 md:p-10 max-w-6xl">
                <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4 -mx-2 px-2">
                    {TABS.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`px-4 py-2 rounded-sm font-poppins text-xs uppercase tracking-widest whitespace-nowrap border ${
                                tab === id ? "border-[#C7F041] text-[#C7F041]" : "border-[#2A2A2A] text-[#909090]"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {tab === "overview" && <Overview />}
                {tab === "bookings" && <Bookings />}
                {tab === "admissions" && <Admissions />}
                {tab === "attendance" && <Attendance />}
                {tab === "blogs" && <Blogs />}
            </main>
        </div>
    );
}

function Overview() {
    const [stats, setStats] = useState(null);
    useEffect(() => {
        apiClient.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {});
    }, []);
    const cards = stats ? [
        { l: "Total Bookings", v: stats.total_bookings },
        { l: "Pending Bookings", v: stats.pending_bookings },
        { l: "Total Students", v: stats.total_students },
        { l: "Active Programs", v: stats.active_programs },
    ] : [];
    return (
        <div>
            <h1 className="font-bebas text-5xl mb-2 tracking-wide">Dashboard</h1>
            <p className="font-poppins text-[#909090] mb-8">A quick look at academy activity.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((c) => (
                    <div key={c.l} data-testid={`stat-${c.l.replace(/\s+/g, "-").toLowerCase()}`} className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-6">
                        <div className="font-poppins text-xs uppercase tracking-widest text-[#909090]">{c.l}</div>
                        <div className="font-bebas text-5xl text-[#C7F041] mt-3">{c.v}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Bookings() {
    const [items, setItems] = useState([]);
    const load = () => apiClient.get("/admin/bookings").then((r) => setItems(r.data)).catch(() => {});
    useEffect(() => { load(); }, []);

    const update = async (id, status) => {
        try { await apiClient.patch(`/admin/bookings/${id}`, { status }); toast.success(`Marked ${status}`); load(); }
        catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    };
    const remove = async (id) => {
        if (!window.confirm("Delete this booking?")) return;
        try { await apiClient.delete(`/admin/bookings/${id}`); toast.success("Deleted"); load(); }
        catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    };

    return (
        <div>
            <h1 className="font-bebas text-5xl mb-2 tracking-wide">Bookings</h1>
            <p className="font-poppins text-[#909090] mb-8">Approve, reject or remove ground booking requests.</p>
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-x-auto">
                <table data-testid="bookings-table" className="w-full text-sm">
                    <thead className="bg-[#1a1a1a] text-[#909090] font-poppins text-xs uppercase tracking-widest">
                        <tr>
                            {["Name", "Phone", "Ground", "Date", "Slot", "Status", ""].map((h) => (
                                <th key={h} className="text-left px-4 py-3">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="font-poppins">
                        {items.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-8 text-center text-[#909090]">No bookings yet.</td></tr>
                        ) : items.map((b) => (
                            <tr key={b.id} className="border-t border-[#1d1d1d]">
                                <td className="px-4 py-3 text-white">{b.full_name}{b.team_name ? ` · ${b.team_name}` : ""}</td>
                                <td className="px-4 py-3 text-[#D1D1D1]">{b.phone}</td>
                                <td className="px-4 py-3 text-[#D1D1D1]">{b.ground_name}</td>
                                <td className="px-4 py-3 text-[#D1D1D1]">{b.date}</td>
                                <td className="px-4 py-3 text-[#D1D1D1]">{b.slot_label}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-sm text-xs uppercase tracking-widest font-bebas ${
                                        b.status === "approved" ? "bg-[#C7F041]/20 text-[#C7F041]" :
                                        b.status === "rejected" ? "bg-red-500/20 text-red-400" :
                                        "bg-yellow-500/20 text-yellow-400"
                                    }`}>{b.status}</span>
                                </td>
                                <td className="px-4 py-3 flex gap-2 justify-end">
                                    <button data-testid={`approve-${b.id}`} onClick={() => update(b.id, "approved")} className="p-2 rounded-sm border border-[#2A2A2A] hover:border-[#C7F041] hover:text-[#C7F041]"><CheckCircle size={14} /></button>
                                    <button data-testid={`reject-${b.id}`} onClick={() => update(b.id, "rejected")} className="p-2 rounded-sm border border-[#2A2A2A] hover:border-red-500 hover:text-red-400"><XCircle size={14} /></button>
                                    <button data-testid={`delete-booking-${b.id}`} onClick={() => remove(b.id)} className="p-2 rounded-sm border border-[#2A2A2A] hover:border-red-500 hover:text-red-400"><Trash2 size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Admissions() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ student_name: "", parent_name: "", phone: "", age: 12, batch: "morning", joining_date: new Date().toISOString().slice(0, 10) });
    const load = () => apiClient.get("/admin/admissions").then((r) => setItems(r.data)).catch(() => {});
    useEffect(() => { load(); }, []);

    const add = async (e) => {
        e.preventDefault();
        try { await apiClient.post("/admin/admissions", { ...form, age: Number(form.age) }); toast.success("Student admitted"); load(); setForm({ ...form, student_name: "", parent_name: "", phone: "" }); }
        catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
    };
    const remove = async (id) => {
        if (!window.confirm("Remove student?")) return;
        try { await apiClient.delete(`/admin/admissions/${id}`); toast.success("Removed"); load(); }
        catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    };

    return (
        <div>
            <h1 className="font-bebas text-5xl mb-2 tracking-wide">Admissions</h1>
            <p className="font-poppins text-[#909090] mb-8">Manage student admissions.</p>
            <form onSubmit={add} data-testid="admission-form" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-[#141414] border border-[#2A2A2A] rounded-sm p-5 mb-6">
                <In data-testid="adm-student" placeholder="Student Name" v={form.student_name} on={(v) => setForm({ ...form, student_name: v })} req />
                <In data-testid="adm-parent" placeholder="Parent Name" v={form.parent_name} on={(v) => setForm({ ...form, parent_name: v })} req />
                <In data-testid="adm-phone" placeholder="Phone" v={form.phone} on={(v) => setForm({ ...form, phone: v })} req />
                <In data-testid="adm-age" type="number" placeholder="Age" v={form.age} on={(v) => setForm({ ...form, age: v })} req />
                <select data-testid="adm-batch" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="bg-[#0B0B0B] border border-[#2A2A2A] rounded-sm p-3 font-poppins text-white focus:border-[#C7F041] outline-none">
                    <option value="morning">Morning Batch</option>
                    <option value="evening">Evening Batch</option>
                </select>
                <In data-testid="adm-date" type="date" v={form.joining_date} on={(v) => setForm({ ...form, joining_date: v })} req />
                <button type="submit" data-testid="adm-submit" className="sm:col-span-2 lg:col-span-3 bg-[#C7F041] text-black font-bebas py-3 uppercase tracking-wider rounded-sm hover:bg-[#A5C635]"><Plus size={14} className="inline mr-2" />Admit Student</button>
            </form>

            <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-x-auto">
                <table className="w-full text-sm font-poppins">
                    <thead className="bg-[#1a1a1a] text-[#909090] text-xs uppercase tracking-widest">
                        <tr>{["Student", "Parent", "Phone", "Age", "Batch", "Joined", ""].map((h) => <th key={h} className="text-left px-4 py-3">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-8 text-center text-[#909090]">No admissions yet.</td></tr>
                        ) : items.map((a) => (
                            <tr key={a.id} className="border-t border-[#1d1d1d]">
                                <td className="px-4 py-3 text-white">{a.student_name}</td>
                                <td className="px-4 py-3 text-[#D1D1D1]">{a.parent_name}</td>
                                <td className="px-4 py-3 text-[#D1D1D1]">{a.phone}</td>
                                <td className="px-4 py-3 text-[#D1D1D1]">{a.age}</td>
                                <td className="px-4 py-3 text-[#D1D1D1] capitalize">{a.batch}</td>
                                <td className="px-4 py-3 text-[#D1D1D1]">{a.joining_date}</td>
                                <td className="px-4 py-3 text-right"><button data-testid={`del-adm-${a.id}`} onClick={() => remove(a.id)} className="p-2 rounded-sm border border-[#2A2A2A] hover:border-red-500 hover:text-red-400"><Trash2 size={14} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Attendance() {
    const [batch, setBatch] = useState("morning");
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [students, setStudents] = useState([]);
    const [records, setRecords] = useState({});

    useEffect(() => {
        apiClient.get("/admin/admissions").then((r) => {
            const list = (r.data || []).filter((s) => s.batch === batch);
            setStudents(list);
            // Load existing attendance for date
            apiClient.get("/admin/attendance", { params: { batch, date } }).then((res) => {
                const map = {};
                (res.data || []).forEach((rec) => { map[rec.student_id] = rec.status; });
                setRecords(map);
            }).catch(() => setRecords({}));
        }).catch(() => {});
    }, [batch, date]);

    const save = async () => {
        const payload = {
            batch, date,
            records: students.map((s) => ({ student_id: s.id, status: records[s.id] || "absent" })),
        };
        try { await apiClient.post("/admin/attendance", payload); toast.success("Attendance saved"); }
        catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    };

    return (
        <div>
            <h1 className="font-bebas text-5xl mb-2 tracking-wide">Attendance</h1>
            <p className="font-poppins text-[#909090] mb-6">Mark present / absent for a batch on a given date.</p>
            <div className="flex flex-wrap gap-3 mb-6">
                <select data-testid="att-batch" value={batch} onChange={(e) => setBatch(e.target.value)} className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-3 font-poppins text-white focus:border-[#C7F041] outline-none">
                    <option value="morning">Morning Batch</option>
                    <option value="evening">Evening Batch</option>
                </select>
                <input data-testid="att-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-3 font-poppins text-white focus:border-[#C7F041] outline-none" />
                <button data-testid="att-save" onClick={save} className="bg-[#C7F041] text-black font-bebas px-6 py-3 uppercase tracking-wider rounded-sm hover:bg-[#A5C635]">Save</button>
            </div>

            <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm">
                {students.length === 0 ? (
                    <div className="p-6 text-center text-[#909090] font-poppins">No students in this batch.</div>
                ) : students.map((s) => (
                    <div key={s.id} className="flex items-center justify-between px-5 py-3 border-b border-[#1d1d1d] last:border-0">
                        <div>
                            <div className="font-poppins text-white">{s.student_name}</div>
                            <div className="font-poppins text-xs text-[#909090]">Age {s.age}</div>
                        </div>
                        <div className="flex gap-2">
                            {["present", "absent"].map((st) => (
                                <button
                                    key={st}
                                    data-testid={`att-${st}-${s.id}`}
                                    onClick={() => setRecords({ ...records, [s.id]: st })}
                                    className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-widest font-bebas border transition-colors ${
                                        records[s.id] === st
                                            ? st === "present" ? "border-[#C7F041] text-[#C7F041] bg-[#C7F041]/10" : "border-red-500 text-red-400 bg-red-500/10"
                                            : "border-[#2A2A2A] text-[#909090] hover:text-white"
                                    }`}
                                >{st}</button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Blogs() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ title: "", excerpt: "", content: "", image_url: "", author: "Academy Team" });
    const [editId, setEditId] = useState(null);
    const load = () => apiClient.get("/blogs").then((r) => setItems(r.data)).catch(() => {});
    useEffect(() => { load(); }, []);

    const submit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await apiClient.patch(`/admin/blogs/${editId}`, form);
                toast.success("Blog updated");
            } else {
                await apiClient.post("/admin/blogs", form);
                toast.success("Blog created");
            }
            setForm({ title: "", excerpt: "", content: "", image_url: "", author: "Academy Team" });
            setEditId(null);
            load();
        } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
    };
    const remove = async (id) => {
        if (!window.confirm("Delete this post?")) return;
        try { await apiClient.delete(`/admin/blogs/${id}`); toast.success("Deleted"); load(); }
        catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    };
    const edit = (b) => { setEditId(b.id); setForm({ title: b.title, excerpt: b.excerpt, content: b.content, image_url: b.image_url || "", author: b.author }); };

    return (
        <div>
            <h1 className="font-bebas text-5xl mb-2 tracking-wide">Blog Management</h1>
            <p className="font-poppins text-[#909090] mb-8">Create, edit and remove blog posts.</p>

            <form onSubmit={submit} data-testid="blog-form" className="grid gap-3 bg-[#141414] border border-[#2A2A2A] rounded-sm p-5 mb-6">
                <In data-testid="blog-title" placeholder="Title" v={form.title} on={(v) => setForm({ ...form, title: v })} req />
                <In data-testid="blog-excerpt" placeholder="Excerpt" v={form.excerpt} on={(v) => setForm({ ...form, excerpt: v })} req />
                <textarea data-testid="blog-content" placeholder="Content" required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} className="bg-[#0B0B0B] border border-[#2A2A2A] rounded-sm p-3 font-poppins text-white focus:border-[#C7F041] outline-none" />
                <In data-testid="blog-image" placeholder="Image URL" v={form.image_url} on={(v) => setForm({ ...form, image_url: v })} />
                <In data-testid="blog-author" placeholder="Author" v={form.author} on={(v) => setForm({ ...form, author: v })} />
                <div className="flex gap-2">
                    <button type="submit" data-testid="blog-submit" className="flex-1 bg-[#C7F041] text-black font-bebas py-3 uppercase tracking-wider rounded-sm hover:bg-[#A5C635]">
                        {editId ? "Update Post" : "Create Post"}
                    </button>
                    {editId && (
                        <button type="button" onClick={() => { setEditId(null); setForm({ title: "", excerpt: "", content: "", image_url: "", author: "Academy Team" }); }} className="flex-1 border border-[#333] text-white font-bebas py-3 uppercase tracking-wider rounded-sm">Cancel</button>
                    )}
                </div>
            </form>

            <div className="grid sm:grid-cols-2 gap-4">
                {items.map((b) => (
                    <div key={b.id} className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-5">
                        <div className="font-bebas text-xl text-white">{b.title}</div>
                        <div className="font-poppins text-xs text-[#909090] mt-1">{b.author}</div>
                        <div className="font-poppins text-sm text-[#D1D1D1] mt-3 line-clamp-3">{b.excerpt}</div>
                        <div className="mt-4 flex gap-2">
                            <button data-testid={`edit-blog-${b.id}`} onClick={() => edit(b)} className="flex-1 border border-[#333] text-white font-bebas py-2 uppercase tracking-widest text-xs rounded-sm hover:border-[#C7F041] hover:text-[#C7F041]">Edit</button>
                            <button data-testid={`del-blog-${b.id}`} onClick={() => remove(b.id)} className="border border-[#333] text-white p-2 rounded-sm hover:border-red-500 hover:text-red-400"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function In({ placeholder, v, on, type = "text", req, ...rest }) {
    return (
        <input {...rest} type={type} placeholder={placeholder} value={v} required={req} onChange={(e) => on(e.target.value)}
            className="bg-[#0B0B0B] border border-[#2A2A2A] rounded-sm p-3 font-poppins text-white focus:border-[#C7F041] outline-none" />
    );
}
