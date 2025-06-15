require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const UI_URL = process.env.UI_URL;
app.use(cors({ origin: UI_URL })); // change for production
app.use(express.json());

// POST /send-email
app.post("/send-email", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `📬 New Contact Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "Email sent!" });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = app;
