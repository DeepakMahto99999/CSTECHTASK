import express from 'express'
import { addAgent, loginAdmin } from '../controllers/adminController.js'
import authAdmin from '../middleware/authAdmin.js'

const adminRouter = express.Router()

adminRouter.post('/login', loginAdmin)
adminRouter.post('/add-agent',authAdmin ,addAgent)

export default adminRouter