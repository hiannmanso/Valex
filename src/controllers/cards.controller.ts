import { application, Request, Response } from "express";
import cardRepository, { TransactionTypes } from "../repositories/cardRepository.js";
import employeeRepository from "../repositories/employeeRepository.js";
import paymentRepository from "../repositories/paymentRepository.js";
import rechargeRepository from "../repositories/rechargeRepository.js";
import { activeCard, balance, blockCards, desblockCards, generatorInfosCards, newCard, verifyCvc } from "../services/cardsService.js";
import {desencrypt, encrypt} from "../utils/encryptThings.js";
import companyRepository from './../repositories/companyRepository.js'

export interface infoCardUser{
    idUser:number;
    cardType:TransactionTypes;
    userName:string;
}
 interface Card{
    cardNumber:string;
    cardName:string;
    expirationDate:string;
    password:string;
}
export async function createNewCardPOST(req:Request,res:Response) {
    const apiKey = req.headers[`x-api-key`]
    const {idUser,cardType,userName}:infoCardUser= req.body
    const infoCard = await newCard(apiKey,idUser,cardType,userName)
    res.status(200).send(infoCard)
}

export async function activeCardUPDATE(req:Request,res:Response) {
    //FALTA VALIDAR A VALIDADE DO CARTÃO (data de expirar o cartão)

    const {idUser,cvc,password,cardType}:{idUser:number,cvc:string,password:number,cardType:TransactionTypes}= req.body

    const result = await activeCard(idUser,cvc,password,cardType)
   
    res.status(200).send(result)
}

export async function blockCard(req:Request,res:Response) {
      //FALTA VALIDAR A VALIDADE DO CARTÃO (data de expirar o cartão)
    const{cardNumber,cardName,expirationDate,password }:Card = req.body
    const result = await blockCards(cardNumber,cardName,expirationDate,password)    
    res.status(200).send(result)
}

export async function desblockCard(req:Request,res:Response) {
        //FALTA VALIDAR A VALIDADE DO CARTÃO (data de expirar o cartão)
      const{cardNumber,cardName,expirationDate,password }:Card = req.body
      const result = await desblockCards(cardNumber,cardName,expirationDate,password)
      res.status(200).send(result)
}


export async function balanceGET(req:Request, res:Response) {
    const {cardID} = req.body
    const result = await balance(cardID)
    res.status(200).send(result)
}