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