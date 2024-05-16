import { check } from "express-validator";
import db from "../db";
import { compare } from "bcrypt";

//password
const password = check("password")
  .isLength({ min: 6, max: 15 })
  .withMessage("Password has to be between 6 and 15 characters.");

//email
const email = check("email").isEmail().withMessage("Please enter a valid email address.");

//check if email exists
const emailExists = check("email").custom(async (value) => {
  const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [value]);

  if (rows.length) {
    throw new Error("Email already exists.");
  }
});

//check first name
const firstName = check("first_name").isAlphanumeric().withMessage("Please enter a valid first name");

//check last name
const lastName = check("last_name").isAlphanumeric().withMessage("Please enter a valid last name");

// Login validations
const loginFieldsCheck = check("email").custom(async (value, { req }) => {
  const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [value]);

  if (!rows.length) {
    throw new Error("Invalid email address");
  }

  const validPassword = await compare(req.body.password, rows[0].password_hash);

  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const verificationStatus = rows[0].is_verified;

  if (!verificationStatus) {
    throw new Error("Email not verified");
  }

  req.user = rows[0];
});

export const registerValidation = [firstName, lastName, email, password, emailExists];
export const loginValidation = [loginFieldsCheck];
