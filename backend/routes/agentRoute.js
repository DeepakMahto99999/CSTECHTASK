import express from 'express';
import { loginUser } from '../controllers/agentController.js';

const agentRouter = express.Router();

agentRouter.post('/login',loginUser)

export default agentRouter