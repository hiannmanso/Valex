import { Request, Response } from "express";
import cardRepository from "../repositories/cardRepository.js";
import companyRepository from "../repositories/companyRepository.js";
import employeeRepository from "../repositories/employeeRepository.js";
import rechargeRepository from "../repositories/rechargeRepository.js";
import { recharge } from "../services/rechargesService.js";



export async function rechargeCardPOST(req: Request, res:Response) {
    
    //FALTA VALIDAÇÃO SE TA EXPIRADO O CARTÃO
    const apiKey = req.headers[`x-api-key`]
    const { cardId,value,EmployeeId } = req.body
    await recharge(apiKey,cardId,value,EmployeeId)
   
    res.status(200).send(`Recharge Card successfully`)

}