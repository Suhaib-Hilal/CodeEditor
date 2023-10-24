import { getRandomNumber } from "@/app/utils/abc";
import { createTransport } from "nodemailer";

export default class OtpService {
  static async sendOtp(email: string) {
    const otp = getRandomNumber(6).toString();
    const transporter = createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
      secure: true,
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: `${otp} is your otp`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return otp;
    } catch (error) {
      return error;
    }
  }
}
