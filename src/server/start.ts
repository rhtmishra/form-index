import express from "express";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import nodemailer from "nodemailer";
import { createApp } from "./app";
import { loadCatalogue } from "./source";

if (existsSync(".env")) process.loadEnvFile(".env");
const env = process.env;
const mail = nodemailer.createTransport({
  host: env.SMTP_HOST || "127.0.0.1",
  port: Number(env.SMTP_PORT || 1025),
  secure: env.SMTP_SECURE === "true",
  auth: env.SMTP_USER
    ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
    : undefined,
  connectionTimeout: 5000,
  socketTimeout: 10000,
});
const app = createApp(loadCatalogue, async (product, enquiry) => {
  await mail.sendMail({
    from: env.MAIL_FROM || "catalogue@form-index.test",
    to: env.SALES_INBOX || "sales@form-index.test",
    replyTo: enquiry.email,
    subject: `Enquiry: ${product.name} (FI-${product.id})`,
    text: `${enquiry.name} <${enquiry.email}>\nProduct: ${product.name} (FI-${product.id})\n\n${enquiry.message}`,
  });
});
app.use(express.static(resolve("dist")));
app.get("/", (_req, res) => {
  res.sendFile(resolve("dist/index.html"));
});
const port = Number(env.PORT || 3000);
app.listen(port, "127.0.0.1", () =>
  console.log(`Form Index: http://127.0.0.1:${port}`),
);
