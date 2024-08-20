import type { CouponProvider, GNFT } from "@/types";

export const daoAddresses: string[] = [
    '0xde73832b3f859532538641eaa8d2ac34d32160b809abc775ef09e1241c4ba82a',
    '0x3f5de56e75a289c7fb7f7f03a21a33b15ac5eb122d44444144f30cd3030a0e90'
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