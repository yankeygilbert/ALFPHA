import db from '../db';

export const verifyResetToken = async (req, res, next) => {
    const { token, id, password } = req.body;
    if (password.length < 6 || password.lenngth > 12) {
        return res.status(400).json({
            error: 'Password must be between 6 to 12 characters',
        })
    }
    const { rows } = await db.query('SELECT * FROM users WHERE user_uid = $1', [id]);

    if (rows.length < 1) {
        return res.status(404).json({
            error: 'User not found',
        })
    }

    const { reset_password_token_expiry, reset_password_token } = rows[0];

    if (reset_password_token_expiry < new Date() || reset_password_token_expiry === null) {
        return res.status(403).json({
            error: 'Link expired!',
        })
    }

    if (token !== reset_password_token) {
        return res.status(403).json({
            error: 'Invalid token provided',
        })
    }

    next()
}