import type { CouponProvider } from "@/types";

export const daoAddresses: string[] = [
    "0xe58a6926b1fece16f3fb274008f3557b106758c6725a6126539de39f5bc16d22",
    "0x242e67839e34aabb7e5c92fc91239edcbb5a87b1b038c66378350d4a3be03538"
];

export const couponProviders: CouponProvider[] = [
    {
        id: 1,
        name: "Ali Express",
        description: "5% off items below $20.",
        image: "/images/coupons/ali-express.webp",
        cost: 1203000000
    },
    {
        id: 2,
        name: "Amazon",
        description: "5% off items below $20.",
        image: "/images/coupons/amazon.jpg",
        cost: 1402300000
    },
    {
        id: 3,
        name: "Legder",
        description: "20% off Legder hardware wallet.",
        image: "/images/coupons/ledger.webp",
        cost: 4532000000
    }
];