import express from 'express';
import { signup, signin, signout, getCurrentUser } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/signout', signout);
authRouter.get('/getCurrentUser', getCurrentUser);

export default authRouter;