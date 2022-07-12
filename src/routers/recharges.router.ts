import {Router} from 'express'
import { rechargeCardPOST } from '../controllers/recharges.controller.js'
import { validateSchema } from '../middlewares/validateSchema.js'
import rechargeSchema from '../schemas/recharge.schema.js'



const rechargeRouter = Router()

rechargeRouter.post('/recharge',validateSchema(rechargeSchema),rechargeCardPOST)
export default rechargeRouter