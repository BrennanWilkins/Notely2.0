const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  tls: { rejectUnauthorized: false },
  auth: {
    user: process.env.NOTELY_EMAIL,
    pass: process.env.NOTELY_PASS
  }
});

const sendMail = async (email, subject, html) => {
  const mailOptions = {
    from: process.env.NOTELY_EMAIL,
    to: email,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
