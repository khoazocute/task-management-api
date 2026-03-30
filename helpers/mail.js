let nodemailer = null;

try {
    nodemailer = require("nodemailer");
} catch (error) {
    nodemailer = null;
}

module.exports.sendResetPasswordOtp = async (email, otp) => {
    if (!nodemailer) {
        throw new Error("NODEMAILER_NOT_INSTALLED");
    }

    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;

    if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
        throw new Error("EMAIL_CONFIG_MISSING");
    }

    const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: Number(EMAIL_PORT),
        secure: Number(EMAIL_PORT) === 465,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    await transporter.verify();

    await transporter.sendMail({
        from: EMAIL_FROM || EMAIL_USER,
        to: email,
        subject: "Ma OTP dat lai mat khau",
        text: `Ma OTP cua ban la ${otp}. Ma co hieu luc trong 5 phut.`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Dat lai mat khau</h2>
                <p>Ma OTP cua ban la:</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
                <p>Ma co hieu luc trong 5 phut.</p>
            </div>
        `
    });
};
