import { Request, Response } from "express";
import businessesRepository from "../repositories/businessRepository.js";
import cardRepository from "../repositories/cardRepository.js";
import paymentRepository from "../repositories/paymentRepository.js";
import rechargeRepository from "../repositories/rechargeRepository.js";
import { checkBalanceOnCard, verifyPassword } from "../services/purchasesService.js";


export async function purchasesPOST(req: Request,res:Response) {

    ///VALIDAR SE ESSA PORRA DE DATA JA PASSOU
    const {cardId, password, businessId,amount} = req.body;
    const purchasesData ={cardId,businessId,amount}
    if(amount ===0 )return res.status(404).send(`invalid Value.`)
    const checkCard = await cardRepository.findById(cardId)
    if(!checkCard)return res.status(404).send(`Card not found.`)
    if(!checkCard.password) return res.status(404).send(`Card not actived.`)
    if(checkCard.isBlocked) return res.status(404).send(`Card is blocked.`)
    const checkPassword = verifyPassword(password,checkCard.password)
    if(checkPassword) return res.status(404).send(`Password incorrect.`)
    const checkBusiness = await businessesRepository.findById(businessId)
    if(!checkBusiness) return res.status(404).send(`Business not registered`)
    if(checkBusiness.type !== checkCard.type)return res.status(404).send(`Business type do not accepted this card`)
    const checkBalance = await checkBalanceOnCard(cardId)
    if( checkBalance < amount)return res.status(404).send(`insufficient account balance`)    
    await paymentRepository.insert(purchasesData)

    res.status(200).send(`purchase completed successfully`)
}