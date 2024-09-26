import type { CouponProvider } from "@/types";

export const daoAddresses: string[] = [
    "0x781e4a2ab14fd509cfab6f3f2c66ccfbcdeae28bd99c35416bb0a489f0a78e46",
    "0x3b64424aa2a2575841829fbc86cd717440ebbc4d903d1774578e1b56c9fa7fa8",
    "0x52873040501f2730a6601a57b02842c246e88c8ed40d6592cf20ae95ee5cfd33",
    "0x4f961cac5bdb4dd64696cd7ca45fede7d99a9dd287b07afa01120850e999e729"
];

export const couponProviders: CouponProvider[] = [
    {
        id: 1,
        name: "Solar energy devices",
        description: "EcoFlow manufactures clean generators, portable solar panels, and power chargers that use renewable energy to keep gadgets running on the go.",
        image: "/images/coupons/products-solar.webp",
        cost: 1203000000
    },
    {
        id: 2,
        name: "Sustainable office accessories",
        description: "Oakywood is a maker of home office tech accessories created using natural materials like wood, cork, and wool.",
        image: "/images/coupons/products-oakywood.webp",
        cost: 1402300000
    },
    {
        id: 3,
        name: "Pet toys",
        description: "Harry Barker is known for its designer dog toys and accessories.",
        image: "/images/coupons/products-harry-barker.webp",
        cost: 4532000000
    }
];