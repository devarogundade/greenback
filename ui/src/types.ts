export type OrderForm = {
    name: string;
    email: string;
    location: string;
    color: 'green' | 'gray';
};

export type CouponProvider = {
    id: number;
    name: string;
    description: string;
    image: string;
    cost: string;
};

export type GNFT = {
    name: string;
    image: string;
};

export enum DisposeChannel {
    RFID,
    QrScan
}

export type Paged<T> = {
    total: number,
    lastPage: number;
    data?: T;
};

export type Activity = {
    user_address: string;
    weight_in_gram: number;
    channel: DisposeChannel;
    reward_amount: number;
    tx_hash: string;
    created_at: Date;
};

// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { z } from "zod";

export const idTokenSchema = z.object({
    aud: z.string(),
    exp: z.number(),
    iat: z.number(),
    iss: z.string(),
    sub: z.string(),
});

export const nonceEncryptedIdTokenSchema = idTokenSchema.extend({
    nonce: z.string(),
});

export const profileScopedPayloadSchema = nonceEncryptedIdTokenSchema.extend({
    family_name: z.string().optional(),
    given_name: z.string().optional(),
    locale: z.string().optional(),
    name: z.string(),
    picture: z.string().optional(),
});

export const emailScopedPayloadSchema = nonceEncryptedIdTokenSchema.extend({
    email: z.string().optional(),
    email_verified: z.boolean(),
});

export const scopedPayloadSchema = profileScopedPayloadSchema.merge(
    emailScopedPayloadSchema
);

export type IDToken = z.infer<typeof idTokenSchema>;

export type NonceEncryptedIdToken = z.infer<typeof nonceEncryptedIdTokenSchema>;

export type ProfileScopedPayloadSchema = z.infer<
    typeof profileScopedPayloadSchema
>;

export type EmailScopedPayloadSchema = z.infer<typeof emailScopedPayloadSchema>;

export type EncryptedScopedIdToken = z.infer<typeof scopedPayloadSchema>;