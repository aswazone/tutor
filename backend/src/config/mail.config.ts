import nodemailer from "nodemailer";
import { SENDER_EMAIL, SENDER_PASSKEY } from "./env.config";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SENDER_EMAIL, 
        pass: SENDER_PASSKEY, 
    },
});

export default transporter;
