import { Router } from 'express';
import { getUsers, register, login, getCurrentUser, logout, verifyEmail, sendPasswordResetLink, resetPassword } from '../controllers/authentication';
import { registerValidation, loginValidation } from '../validators/authentication'
import { validationMiddleware } from '../middlewares/validation'
import { userAuthentication } from '../middlewares/authentication'
import { verifyTokenMiddleware } from '../middlewares/verify-email';
import { verifyUser } from '../middlewares/verify-user';
import { verifyResetToken } from '../middlewares/verify-reset-token';
const router = Router();

router.get('/users', getUsers);
router.get('/currentUser', userAuthentication, getCurrentUser);
router.post('/register', registerValidation, validationMiddleware, register);
router.get('/verify-email/:token', verifyTokenMiddleware, verifyEmail);
router.post('/requestpasswordreset', verifyUser, sendPasswordResetLink);
router.post('/resetpassword', verifyResetToken, resetPassword)
router.post('/login', loginValidation, validationMiddleware, login);
router.get('/logout', logout);

export = router