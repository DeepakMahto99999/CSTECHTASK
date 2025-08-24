import express from 'express'
import { addAgent, getAgentsWithData, loginAdmin, uploadList } from '../controllers/adminController.js'
import authAdmin from '../middleware/authAdmin.js'
import upload from '../middleware/upload.js'

const adminRouter = express.Router()

adminRouter.post('/login', loginAdmin)
adminRouter.post('/add-agent',authAdmin ,addAgent) 

adminRouter.post('/upload-list', authAdmin , upload.single("file"),uploadList)

adminRouter.get('/agents',authAdmin,getAgentsWithData)

export default adminRouter