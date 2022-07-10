import { application, Request, Response } from "express";
import cardRepository from "../repositories/cardRepository.js";
import employeeRepository from "../repositories/employeeRepository.js";
import { generatorInfosCards } from "../services/cardsService.js";
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
    const {idUser,cvc,password,type}= req.body

    const checkCardExist = await cardRepository.findByTypeAndEmployeeId(type,idUser)
    if(!checkCardExist) res.status(404).send(`Card not found`)
    console.log(checkCardExist)

    res.status(200).send(checkCardExist)
}