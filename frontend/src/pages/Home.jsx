import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Facilities from "../components/Facilities";
import Grounds from "../components/Grounds";
import Programs from "../components/Programs";
import Timings from "../components/Timings";
import Pricing from "../components/Pricing";
import Gallery from "../components/Gallery";
import Blog from "../components/Blog";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";

export default function Home() {
    const [open, setOpen] = useState(false);
    const [groundId, setGroundId] = useState(null);

    const openBooking = (gid) => {
        setGroundId(typeof gid === "string" ? gid : null);
        setOpen(true);
    };

    return (
        <div className="bg-[#0B0B0B] min-h-screen">
            <Navbar onBook={() => openBooking()} />
            <Hero onBook={() => openBooking()} />
            <About />
            <Facilities />
            <Grounds onBook={(id) => openBooking(id)} />
            <Programs />
            <Timings />
            <Pricing onBook={() => openBooking()} />
            <Gallery />
            <Blog />
            <Contact />
            <Footer />
            <BookingModal open={open} onClose={() => setOpen(false)} initialGround={groundId} />
        </div>
    );
}
