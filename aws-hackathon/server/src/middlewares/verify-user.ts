import db from '../db'

export const verifyUser = async (req, res, next) => {
    const { email } = req.body
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (rows.length < 1) {
        return res.status(404).json({ error: 'User not found' })
    }

    req.body = rows[0]
    next()
}