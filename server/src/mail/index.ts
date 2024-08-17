/* eslint-disable prettier/prettier */

import { createTransport } from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Campaign } from '../database/schemas/dao';

export const Templates = {
    buildMailForCardCreate: function (username: string, location: string): string {
        return `
            <h3>Hi ${username}.</h3>
            <br /> <br />
            <p>We have sent your GreenBack card to ${location}, through our courier service provider.</p>
        `;
    },
    buildMailForDonate: function (username: string, campaign: Campaign): string {
        return `
            <h3>Hi ${username}.</h3>
            <br /> <br />
            <p>Thanks for helping the world green back. Your donation to ${campaign.title} were received.</p>
        `;
    }
};

export function sendMail(
    to: string,
    subject: string,
    html: string
): void {
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    transporter.sendMail({
        from: process.env.FROM_EMAIL, to, subject, html
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }, (error: Error | null, _: SMTPTransport.SentMessageInfo) => {
        if (error) {
            console.error(error);
            return;
        }
    });
}