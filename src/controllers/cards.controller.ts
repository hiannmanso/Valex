import { application, Request, Response } from "express";
import cardRepository from "../repositories/cardRepository.js";
import employeeRepository from "../repositories/employeeRepository.js";
import { generatorInfosCards, verifyCvc } from "../services/cardsService.js";
import {desencrypt, encrypt} from "../utils/encryptThings.js";
import companyRepository from './../repositories/companyRepository.js'


export async function createNewCardPOST(req:Request,res:Response) {
    const apiKey = req.headers[`x-api-key`]
    const {idUser,cardType,userName} = req.body
//    const {userName} = req.body

    // VALIDAÇÕES, TROCAR POR MIDDLEWATE
    const checkCompany = await companyRepository.findByApiKey(String(apiKey))
    if(!checkCompany) res.status(404).send(`Company not found.`)
    const checkEmployee = await employeeRepository.findById(idUser)
    if(!checkEmployee) res.status(404).send(`Employee not found`)
    const checkThisCard = await cardRepository.findByTypeAndEmployeeId(cardType,idUser)
    if(checkThisCard) res.status(404).send(`Employee already owns this card`)
    const infoCard = generatorInfosCards(userName,idUser,cardType)
    console.log('checkThisCard: ',checkThisCard)
    res.status(200).send(infoCard)
}

export async function activeCardUPDATE(req:Request,res:Response) {
    //FALTA VALIDAR A VALIDADE DO CARTÃO (data de expirar o cartão)
    //VALIDAR OS ITENS
    const {idUser,cvc,password,type}= req.body

    const checkCardExist = await cardRepository.findByTypeAndEmployeeId(type,idUser)
    if(!checkCardExist) res.status(404).send(`Card not found`)
    if(checkCardExist.password) res.status(404).send(`Card already actived`)
    const checkCvc = verifyCvc(cvc,checkCardExist.securityCode)
    if(checkCvc) res.status(404).send(`CVC do not match`) // USAR THROW
    const encryptedPassword = encrypt(password)
    const result  = await cardRepository.update(checkCardExist.id,{...checkCardExist,password:encryptedPassword})
    res.status(200).send(result)
}

export async function blockCard(req:Request,res:Response) {
      //FALTA VALIDAR A VALIDADE DO CARTÃO (data de expirar o cartão)
      //VALIDAR OS ITENS
    const{cardNumber,cardName,expirationDate,password } = req.body

    const checkCardExist = await cardRepository.findByCardDetails(cardNumber,cardName,expirationDate)
    if(!checkCardExist) res.status(404).send(`Card do not exist.`)
    if(checkCardExist.isBlocked) res.status(404).send(`Card already blocked.`)
    if(!checkCardExist.password) res.status(404).send(`Card do not actived.`)
    if(password !== desencrypt(checkCardExist.password))res.status(404).send(`Password incorrect.`)
    const cardBlocked = await cardRepository.update(checkCardExist.id,{...checkCardExist,isBlocked:true})
    res.status(200).send(cardBlocked)
}

export async function desblockCard(req:Request,res:Response) {
        //FALTA VALIDAR A VALIDADE DO CARTÃO (data de expirar o cartão)
      //VALIDAR OS ITENS
      const{cardNumber,cardName,expirationDate,password } = req.body

      const checkCardExist = await cardRepository.findByCardDetails(cardNumber,cardName,expirationDate)
      if(!checkCardExist) res.status(404).send(`Card do not exist.`)
      if(!checkCardExist.isBlocked) res.status(404).send(`Card do not blocked.`)
      if(!checkCardExist.password) res.status(404).send(`Card do not actived.`)
      if(password !== desencrypt(checkCardExist.password))res.status(404).send(`Password incorrect.`)
      const cardBlocked = await cardRepository.update(checkCardExist.id,{...checkCardExist,isBlocked:false})
      res.status(200).send(cardBlocked)
}