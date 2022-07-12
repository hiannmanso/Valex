import { Request, Response } from "express";
import cardRepository from "../repositories/cardRepository.js";
import companyRepository from "../repositories/companyRepository.js";
import employeeRepository from "../repositories/employeeRepository.js";
import rechargeRepository from "../repositories/rechargeRepository.js";



export async function rechargeCardPOST(req: Request, res:Response) {
    
    //FALTA VALIDAÇÃO SE TA EXPIRADO O CARTÃO
    const apiKey = req.headers[`x-api-key`]
    const { cardId,value,EmployeeId } = req.body
    const rechargeValues ={cardId, amount:value}
    if(value <= 0)return res.status(404).send(`invalid value.`)
    const checkCompany = await companyRepository.findByApiKey(String(apiKey))
    if(!checkCompany)return res.status(404).send(`Company not found.`)
    const checkEmployee = await employeeRepository.findById(EmployeeId)
    if(checkCompany.id !== checkEmployee.companyId)return res.status(404).send(`This employee does not belong to the company`)
    const checkCardValid = await cardRepository.findById(cardId)
    if(!checkCardValid)return res.status(404).send(`Card do not found.`)
    if(checkCardValid.isBlocked || !checkCardValid.password)return res.status(404).send(`Card not active`)
    await rechargeRepository.insert(rechargeValues)
   
    res.status(200).send(`Recharge Card successfully`)

}