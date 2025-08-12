import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 587,
    secure: false,
    auth: {
      user: "support@jobreferral.club",
      pass: process.env.SMTP_PASSWORD
    }
  });

  await transporter.sendMail({
    from: '"JobReferralClub Support" <support@jobreferral.club>',
    to,
    subject,
    html: message
  });
};

export default sendEmail;
