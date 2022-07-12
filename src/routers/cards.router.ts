import {Router } from 'express'
import { activeCardUPDATE, balanceGET, blockCard, createNewCardPOST, desblockCard } from '../controllers/cards.controller.js'
import { validateSchema } from '../middlewares/validateSchema.js'
import newCardSchema from '../schemas/newCard.schema.js'


const cardsRouter = Router()

cardsRouter.post('/card/newCard',validateSchema(newCardSchema), createNewCardPOST)
cardsRouter.put('/card/activeCard',activeCardUPDATE)
cardsRouter.put('/card/blockCard',blockCard)
cardsRouter.put('/card/desblockCard',desblockCard)
cardsRouter.get('/balance',balanceGET)
export default cardsRouter