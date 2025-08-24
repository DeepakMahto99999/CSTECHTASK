import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import adminRouter from './routes/adminRoute.js'
import agentRouter from './routes/agentRoute.js'


const app = express()
const port = process.env.PORT || 4000;

connectDB()

app.use(express.json())
app.use(cors());

app.get('/', (req,res) => {
    res.send('API WORKING')
}) 

app.use('/api/admin',adminRouter)
app.use('/api/agent',agentRouter)

app.listen(port, () => console.log(`Server Started at http://localhost:${port}`));