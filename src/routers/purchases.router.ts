import { Router} from 'express'
import { purchasesPOST } from '../controllers/purchases.controller.js'
import { validateSchema } from '../middlewares/validateSchema.js'
import purchasesSchema from '../schemas/purchases.schema.js'


const purchasesRouter = Router()

purchasesRouter.post('/purchases',validateSchema(purchasesSchema),purchasesPOST)

export default purchasesRouter