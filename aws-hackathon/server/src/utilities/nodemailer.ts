import nodemailer from "nodemailer";
import * as SMTPTransport from "nodemailer/lib/smtp-transport";
import constants from "../constants";
import { Attachment } from "nodemailer/lib/mailer";

const SMTPPort: number = parseInt(constants.SMTP_PORT!);

let serverPort: number | string;
constants.NODE_ENV === "production" ? (serverPort = "") : (serverPort = `:${constants.SERVER_PORT}`!);

let clientPort: number | string;
constants.NODE_ENV === "production" ? (clientPort = "") : (clientPort = `:${constants.CLIENT_PORT}`!);

const poolOptions = {
  pool: true,
};

const smtpOptions = {
  host: constants.EMAIL_SMTP,
  port: SMTPPort,
  secure: true, // use TLS
  auth: {
    user: constants.EMAIL_ADDRESS,
    pass: constants.EMAIL_PASSWORD,
  },
};

const nodemailerOptions: SMTPTransport.Options = {
  ...poolOptions,
  ...smtpOptions,
};

const transport = nodemailer.createTransport(nodemailerOptions);

export const sendEmailConfirmation = async (name: string, email: string, confirmationCode: string) => {
  await transport
    .sendMail({
      from: `Lizo File Server <${constants.EMAIL_ADDRESS}>`,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a target="_blank" href="${constants.SERVER_HOST}${serverPort}/api/verify-email/${confirmationCode}"> Click here</a>
        </div>`,
    })
    .catch((err) => err);
};

export const sendLink = async (name: string, email: string, token: string, user_uid: string) => {
  await transport
    .sendMail({
      from: `Lizo File Server <${constants.EMAIL_ADDRESS}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<h1>Hi ${name},</h1>
        <h2>you requested to change your password.</h2>
        <p>Follow the link below to reset your password.
        If you did not make this request, please ignore this message.
        <br />
        <a target="_blank" href="${constants.CLIENT_HOST}${clientPort}/resetPassword?token=${token}&id=${user_uid}">Reset password</a>. </p>
        </div>`,
    })
    .catch((err) => err);
};

export const sendFile = async (name: string, email: string, attachment: Attachment, fileTitle: string) => {
  await transport
    .sendMail({
      from: `Lizo File Server <${constants.EMAIL_ADDRESS}>`,
      to: email,
      subject: fileTitle,
      html: `<h1>${name} shared this file with you.</h1>
        <h2>Hi there,</h2>
        <p>You have received a file from <a target="_blank" href="${constants.CLIENT_HOST}${clientPort}">Lizo File Server</a>. </p>
        </div>`,
      attachments: [attachment],
    })
    .catch((err) => err);
};
