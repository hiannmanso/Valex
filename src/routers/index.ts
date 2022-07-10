import {Router } from 'express'
import cardsRouter from './cards.router.js'


const router = Router()

router.use(cardsRouter)

export default router