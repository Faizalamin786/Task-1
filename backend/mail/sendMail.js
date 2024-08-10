const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",

  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "faizalamin0000@gmail.com",
    pass: "rfjwoassgmmpttlq",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(to,subject,text,html) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'faizalamin0000@gmail.com', // sender address
    to,
    subject,
    text,
    html
  });
}
module.exports = {sendMail}