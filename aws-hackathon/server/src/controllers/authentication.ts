import db from '../db';
import { hash } from 'bcrypt'
import { sign } from'jsonwebtoken'
import { Key } from 'jwt-promisify'
import constants from '../constants'
import  { sendEmailConfirmation, sendLink } from '../utilities/nodemailer'

let clientPort: number | string;
constants.NODE_ENV === "production" ? (clientPort = "") : (clientPort = `:${constants.CLIENT_PORT}`!);

//Get all users
export const getUsers = async (req, res) => {
    try {
        const { rows } = await db.query("SELECT user_uid, first_name, last_name, email, is_verified, verification_token, reset_password_token, reset_password_token_expiry, is_admin, created_at, updated_at FROM users",[])
        res.status(res.statusCode).json({ success: true, users: rows })
    } catch (error) {
        res.status(res.statusCode).json({ message: error.message })
    }
}

//Register user
export const register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    try {
        const verificationToken = sign({ email }, constants.SECRET as Key)
        await sendEmailConfirmation(`${first_name} ${last_name}`, email, verificationToken);

        const hashedPassword = await hash(password, 10);
        await db.query('INSERT INTO users (first_name, last_name, email, password_hash, verification_token) VALUES($1, $2, $3, $4, $5)', [first_name, last_name, email, hashedPassword, verificationToken])
        return res.status(200).json({
            success: true, message: 'Registration successfull.',
        });
    } catch (error) {
        console.log(error)
        return res.status(res.statusCode).json({
            error: error.message
        })
    }
}

//Login user
export const login = async (req, res) => {
    const { user } = req

    const payload = {
        user_uid: user.user_uid,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_verified: user.is_verified,
        is_admin: user.is_admin,
        createdAt: user.created_at,
        updatedAt: user.updated_at
    }

    try {
        const token = sign(payload, constants.SECRET as Key)

        return res.status(res.statusCode).cookie('token', token, { /* maxAge: 5000, */ httpOnly: true }).json({ // Remember to set the cookie secure to true.
            success: true,
            message: 'Logged in successfully.',
            user: payload,
        })
    } catch (error) {
        return res.status(res.statusCode).json({
            error: error.message
        })
    }
}

//Get  current user information
export const getCurrentUser = async (req, res) => {
    try {
        const user = await req.user
        return res.status(res.statusCode).json(user);
    } catch (error) {
        return res.status(res.statusCode).json({
            error: error.message
        })
    }
}

//Logout user
export const logout = async (req, res) => {
    try {
        return res.status(res.statusCode).clearCookie('token', { httpOnly: true }).json({
            success: true,
            message: 'Logged out successfully.'
        })
    } catch (error) {
        return res.status(res.statusCode).json({
            error: error.message
        })
    }
}

//Verify Email
export const verifyEmail = async (req, res) => {
    const { user_uid } = req.user;
    try {
        await db.query('UPDATE users SET verification_token = null, is_verified = true WHERE user_uid = $1', [user_uid])
        return res.writeHead(301, {
            Location: `${constants.CLIENT_HOST}${clientPort}`
        }).end();
        /* return res.status(res.statusCode).json({
            success: true,
            message: 'Email verified'
        }) */
    } catch (error) {
        return res.status(res.statusCode)
    }
}

// Send password reset link
function addMinutes(date, minutes) {
    date.setMinutes(date.getMinutes() + minutes);
    return date;
}

export const sendPasswordResetLink = async (req, res) => {
    const payload = {
        email: req.body.email,
        id: req.body.user_uid,
    }
    const token = sign(payload, constants.SECRET as Key)
    const tokenExpiry = new Date(addMinutes(new Date(), 30))
    const name = `${req.body.first_name} ${req.body.last_name}`

    try {
        await sendLink(name, req.body.email, token, req.body.user_uid)
        await db.query('UPDATE users SET reset_password_token = $1, reset_password_token_expiry = $2 WHERE user_uid = $3', [token, tokenExpiry, req.body.user_uid])
        return res.status(res.statusCode).json({ success: true, message: 'password reset link sent. Please check your email and follow the instructions.' })
    } catch (error) {
        return res.status(res.statusCode)
    }
}

export const resetPassword = async (req, res) => {
    const { password, id } = req.body
    try {
        const hashedPassword = await hash(password, 10);
        await db.query('UPDATE users SET password_hash = $1, reset_password_token_expiry = null, reset_password_token = null WHERE user_uid = $2', [hashedPassword, id]);
        return res.status(res.statusCode).json({
            message: 'Password reset successfully',
        })
    } catch (error) {
        return res.status(res.statusCode)
    }
}