import { Request, Response } from "express";
import businessesRepository from "../repositories/businessRepository.js";
import cardRepository from "../repositories/cardRepository.js";
import paymentRepository from "../repositories/paymentRepository.js";
import rechargeRepository from "../repositories/rechargeRepository.js";
import { checkBalanceOnCard, purchase, verifyPassword } from "../services/purchasesService.js";

interface purchase {
    cardId:number;
    password:number;
    businessId:number;
    amount:number;
}

export async function purchasesPOST(req: Request,res:Response) {

    ///VALIDAR SE ESSA PORRA DE DATA JA PASSOU
    const {cardId, password, businessId,amount} :purchase= req.body;
    await purchase(cardId,password,businessId,amount)

    res.status(200).send(`purchase completed successfully`)
}