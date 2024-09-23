import type { CouponProvider } from "@/types";

export const daoAddresses: string[] = [
    "0xe58a6926b1fece16f3fb274008f3557b106758c6725a6126539de39f5bc16d22",
    "0x242e67839e34aabb7e5c92fc91239edcbb5a87b1b038c66378350d4a3be03538"
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
        description: "Harry Barker is known for its designer dog toys and accessories. But there’s more than meets the eye: ",
        image: "/images/coupons/products-harry-barker.webp",
        cost: 4532000000
    }
];