import {
    Bath, Tent, Waves, Droplet, CarFront, CircleDot,
    Flag, Target, Goal, UserRoundCog,
} from "lucide-react";

export const IMAGES = {
    hero: "https://images.unsplash.com/photo-1729027696167-0f3aa8e92e64?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920",
    ground1: "https://images.unsplash.com/photo-1746053301234-f7f95dc669e0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    ground2: "https://images.unsplash.com/photo-1771909712504-900d75c7eccb?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    coaching: "https://images.unsplash.com/photo-1595210382051-4d2c31fcc2f4?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    nets: "https://images.unsplash.com/photo-1587716856188-ef47793f3fb7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    training: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    aboutImg: "https://images.unsplash.com/photo-1595210382266-2d0077c1f541?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    gallery: [
        "https://images.unsplash.com/photo-1771909712577-6101900100fa?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000",
        "https://images.unsplash.com/photo-1771909713927-1035f4cabb7e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000",
        "https://images.unsplash.com/photo-1599982946086-eb42d9e14eb8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000",
        "https://images.unsplash.com/photo-1595210382266-2d0077c1f541?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000",
        "https://images.unsplash.com/photo-1587716856188-ef47793f3fb7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000",
        "https://images.unsplash.com/photo-1595210382051-4d2c31fcc2f4?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000",
        "https://images.unsplash.com/photo-1746053301234-f7f95dc669e0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000",
        "https://images.unsplash.com/photo-1771909712504-900d75c7eccb?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000",
    ],
};

export const FACILITIES = [
    { title: "Washroom", desc: "Clean modern restrooms for players & guests.", Icon: Bath },
    { title: "Dugout", desc: "Shaded benches with team gear storage.", Icon: Tent },
    { title: "Astro Turf Pitch", desc: "World-class astro turf for true bounce.", Icon: Waves },
    { title: "Drinking Water", desc: "Filtered, chilled water on tap all day.", Icon: Droplet },
    { title: "Parking", desc: "Spacious parking for teams and spectators.", Icon: CarFront },
    { title: "Ball Availability", desc: "Match & practice balls available on-site.", Icon: CircleDot },
    { title: "Umpire Facility", desc: "Trained umpires for tournament matches.", Icon: Flag },
    { title: "Bowling Machine", desc: "Pro-grade bowling machine for batting drills.", Icon: Target },
    { title: "Open Nets", desc: "Multiple nets — bat, bowl, work on your game.", Icon: Goal },
    { title: "1-on-1 Coaching", desc: "Personalised sessions with senior coaches.", Icon: UserRoundCog },
];

export const PROGRAMS = [
    {
        title: "Expert Coaching",
        desc: "Structured monthly batches led by certified coaches focused on technique, fitness & match temperament.",
        img: "https://images.unsplash.com/photo-1595210382051-4d2c31fcc2f4?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000",
        price: "₹3000 / month",
    },
    {
        title: "Ground Training & Open Nets",
        desc: "Full-ground sessions plus open net access for batting and bowling drills.",
        img: "https://images.unsplash.com/photo-1587716856188-ef47793f3fb7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000",
        price: "From ₹250 / hour",
    },
    {
        title: "One-on-One Coaching",
        desc: "Premium private sessions tailored to your role — batting, bowling or all-round.",
        img: "https://images.unsplash.com/photo-1599982946086-eb42d9e14eb8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000",
        price: "₹12,000",
    },
    {
        title: "Nets Booking",
        desc: "Hourly net booking with bowling machine option. Perfect for teams gearing up for matches.",
        img: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000",
        price: "₹250 / hour",
    },
    {
        title: "Bowling Machine Practice",
        desc: "Sharpen your eye against high pace, swing and spin in a controlled net environment.",
        img: "https://images.unsplash.com/photo-1595210382266-2d0077c1f541?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000",
        price: "On request",
    },
];

export const SLOTS = [
    { id: "morning", label: "6:30 AM – 10:00 AM", price: 4000 },
    { id: "midday", label: "10:00 AM – 1:00 PM", price: 3500 },
    { id: "afternoon", label: "1:00 PM – 6:00 PM", price: 3000 },
];

export const GROUNDS_LIST = [
    {
        id: "ground-1",
        name: "Chinnaswamy Ground Marsur 1",
        img: "https://images.unsplash.com/photo-1746053301234-f7f95dc669e0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
        features: ["Astro Turf Pitch", "Open Nets", "Bowling Machine", "Dugout & Washroom"],
        timing: "6:30 AM – 6:00 PM (Daily)",
        desc: "Our flagship full-size turf ground built for serious match play and high-intensity training.",
    },
    {
        id: "ground-2",
        name: "Chinnaswamy Ground Marsur 2",
        img: "https://images.unsplash.com/photo-1771909712504-900d75c7eccb?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
        features: ["Astro Turf Pitch", "Indoor + Outdoor Nets", "Umpire Facility", "Parking"],
        timing: "6:30 AM – 6:00 PM (Daily)",
        desc: "A second premium turf ground with extended nets — perfect for parallel team sessions.",
    },
];
