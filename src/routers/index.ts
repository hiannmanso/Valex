import {Router } from 'express'
import cardsRouter from './cards.router.js'
import purchasesRouter from './purchases.router.js'
import rechargeRouter from './recharges.router.js'
import 'express-async-errors'

const router = Router()

router.use(cardsRouter)
router.use(rechargeRouter)
router.use(purchasesRouter)

export default router