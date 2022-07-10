import {Router } from 'express'
import { activeCardUPDATE, createNewCardPOST } from '../controllers/cards.controller.js'
import { validateSchema } from '../middlewares/validateSchema.js'
import newCardSchema from '../schemas/newCard.schema.js'


const cardsRouter = Router()

cardsRouter.post('/card',validateSchema(newCardSchema), createNewCardPOST)
cardsRouter.put('/card',activeCardUPDATE)

export default cardsRouter