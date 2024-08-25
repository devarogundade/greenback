import type { CouponProvider, GNFT } from "@/types";

export const daoAddresses: string[] = [
    '0x60aeea8a609a2193418bfba5893f0eafe79070307bee0459374f97da7f3668da'
];

export const couponProviders: CouponProvider[] = [
    {
        id: 1,
        name: "Ali Express",
        description: "5% off items below $20.",
        image: "/images/coupons/ali-express.webp",
        cost: "1200000"
    },
    {
        id: 2,
        name: "Amazon",
        description: "5% off items below $20.",
        image: "/images/coupons/amazon.jpg",
        cost: "1400000"
    },
    {
        id: 3,
        name: "Legder",
        description: "20% off Legder hardware wallet.",
        image: "/images/coupons/ledger.webp",
        cost: "450000"
    }
];

export const gnfts: GNFT[] = [
    {
        name: "Eco Novice",
        // image: "/images/gnfts/eco-novice.png"
        image: "/images/coupons/ali-express.webp"
    },
    {
        name: "Green Steward",
        image: "/images/gnfts/green-steward.png"
    },
    {
        name: "Recycling Advocate",
        image: "/images/gnfts/recycling-adovate.png"
    },
    {
        name: "Eco Warrior",
        image: "/images/gnfts/eco-warrior.png"
    },
    {
        name: "Sustainability Champion",
        // image: "/images/gnfts/sustainability-champion.png"
        image: "/images/coupons/ali-express.webp"
    },
    {
        name: "Planet Protector",
        image: "/images/gnfts/planet-protector.png"
    },
    {
        name: "Environmental Guardian",
        image: "/images/gnfts/environmental-guardian.png"
    },
    {
        name: "Green Ambassador",
        image: "/images/gnfts/green-ambassador.png"
    },
    {
        name: "Earth Defender",
        image: "/images/gnfts/earth-defender.png"
    },
    {
        name: "Eco Hero",
        image: "/images/gnfts/eco-hero.png"
    }
];