import express from 'express';
import { getAgentData, loginUser } from '../controllers/agentController.js';
import authAgent from '../middleware/authAgent.js';

const agentRouter = express.Router();

agentRouter.post('/login',loginUser)
agentRouter.get('/me', authAgent , getAgentData)

export default agentRouter