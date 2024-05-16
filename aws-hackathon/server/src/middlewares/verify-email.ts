import db from '../db';

//Email token middleware
export const verifyTokenMiddleware = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { rows } = await db.query('SELECT * FROM users WHERE verification_token = $1', [token]);
        if (!rows.length) {
            throw new Error('Invalid email token.')
        };

        req.user = rows[0];
        next()
    } catch (error) {
        console.error(error.message);
    }
}