/* eslint-disable prettier/prettier */

import { createTransport } from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const Templates = {
    buildMailForCardCreate: function (
        name: string,
        location: string,
        tx_hash: string
    ): string {
        return `
            <h3>Hi ${name}.</h3>
            <br /> <br />
            <p>We have sent your GreenBack card to ${location}, through our courier service provider.</p>
            <br /> <br />
            <a href="https://explorer.aptoslabs.com/txn/${tx_hash}?network=testnet">View Transacton</a>
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