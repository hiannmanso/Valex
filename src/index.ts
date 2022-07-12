import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import chalk from 'chalk'
import dotenv from 'dotenv'
import router from './routers/index.js'
import { handdleErrorMiddleware } from './middlewares/handdleErrorMiddleware.js'

dotenv.config()
const server = express()
server.use(cors())
server.use(express.json())
server.use(router)
server.use(handdleErrorMiddleware)

server.listen(process.env.PORT||5000,()=>{
    console.log(chalk.bold.italic.blue(`Backend up on PORT:${process.env.PORT}`))
})