import express from 'express'
import cors from 'cors'
import chalk from 'chalk'
import dotenv from 'dotenv'
import router from './routers/index.js'

dotenv.config()
const server = express()
server.use(cors())
server.use(express.json())
server.use(router)


server.listen(process.env.PORT||5000,()=>{
    console.log(chalk.bold.italic.blue(`Backend up on PORT:${process.env.PORT}`))
})