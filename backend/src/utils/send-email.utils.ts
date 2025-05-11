import { RESET_PASS_URL, SENDER_EMAIL } from "@/config/env.config";
import transporter from "@/config/mail.config";


export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    const mailOptions = {
      from: `"Tutor" <${SENDER_EMAIL}>`,
      to: email,
      subject: "Verify your Tutor sign-up",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f9f7ff; padding: 40px 20px;">
          <div style="background-color: #fff; border-radius: 12px; padding: 40px 30px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <img src="https://static.vecteezy.com/system/resources/previews/003/659/087/non_2x/t-white-alphabet-letter-black-circle-company-business-logo-icon-design-corporate-vector.jpg" alt="Tutor" style="width: 48px; margin-bottom: 20px; border-radius: 50%;" />
            <h2 style="margin-bottom: 10px; color: #111;">Verify your Tutor sign-up</h2>
            <p style="color: #555; font-size: 15px; line-height: 1.5;">
              We have received a sign-up attempt with the following code. Please enter it in the browser window where you started signing up for Tutor.
            </p>
            <div style="margin: 30px 0; font-size: 32px; font-weight: bold; color: #111; background: #f1f3f5; padding: 16px 0; border-radius: 8px;">
              ${otp}
            </div>
            <p style="font-size: 13px; color: #888;">
              If you did not attempt to sign up but received this email, please disregard it. The code will remain active for 10 minutes.
            </p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #aaa;">Tutor, an effortless identity solution with all the features you need.</p>
            <div style="margin-top: 10px;">
              <a href="#" style="margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="20" /></a>
              <a href="#" style="margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="20" /></a>
              <a href="#" style="margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" width="20" /></a>
            </div>
            <p style="margin-top: 20px; font-size: 11px; color: #bbb;">© 2025 Tutor. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending verification email:", err);
    throw new Error("Error sending OTP email");
  }
};

  
export const sendResetPasswordEmail = async (email: string, token: string) => {
  try {
    const resetPasswordUrl = `${RESET_PASS_URL}?token=${token}`;

    const mailOptions = {
      from: `"Tutor" <${SENDER_EMAIL}>`,
      to: email,
      subject: "Reset Your Password - Tutor",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f9f7ff; padding: 40px 20px;">
          <div style="background-color: #fff; border-radius: 12px; padding: 40px 30px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <img src="https://static.vecteezy.com/system/resources/previews/003/659/087/non_2x/t-white-alphabet-letter-black-circle-company-business-logo-icon-design-corporate-vector.jpg" alt="Tutor" style="width: 48px; margin-bottom: 20px; border-radius: 50%;" />
            <h2 style="margin-bottom: 10px; color: #111;">Reset Your Password</h2>
            <p style="color: #555; font-size: 15px; line-height: 1.5;">
              We received a request to reset your password. Click the button below to proceed:
            </p>
            <div style="margin: 30px 0;">
              <a href="${resetPasswordUrl}" target="_blank" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 8px;">Reset Password</a>
            </div>
            <p style="font-size: 13px; color: #888;">
              If you did not request this, you can safely ignore this email. Your password will remain unchanged.
            </p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #aaa;">Tutor, an effortless identity solution with all the features you need.</p>
            <div style="margin-top: 10px;">
              <a href="#" style="margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="20" /></a>
              <a href="#" style="margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="20" /></a>
              <a href="#" style="margin: 0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" width="20" /></a>
            </div>
            <p style="margin-top: 20px; font-size: 11px; color: #bbb;">© 2025 Tutor. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully", info.response);
  } catch (error) {
    console.error("Error sendResetPasswordEmail", error);
    throw new Error("Error sending reset password email");
  }
};