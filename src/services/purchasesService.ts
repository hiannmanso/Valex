import businessesRepository from "../repositories/businessRepository.js";
import cardRepository from "../repositories/cardRepository.js";
import paymentRepository from "../repositories/paymentRepository.js";
import rechargeRepository from "../repositories/rechargeRepository.js";
import { desencrypt } from "../utils/encryptThings.js";


export function verifyPassword(password:number,encryptedPassword:number) {
    if(password != desencrypt(encryptedPassword)){
        throw{
            status:404,
            message:`Password incorrect.`
        }

    }
}


export async function checkBalanceOnCard(cardId:number) {
    let balance = 0
    const checkValueInCard = await rechargeRepository.findByCardId(cardId)
    for (const item of checkValueInCard) {
        balance += item.amount
    }

    return balance
}

export async function purchase(cardId:number,password:number,businessId:number,amount:number) {
    const purchasesData ={cardId,businessId,amount}
    if(amount ===0 ){
        throw{
            status:400,
            message:`Invalid value.`
        }

    }
    const checkCard = await cardRepository.findById(cardId)
    if(!checkCard){
        throw{
            status:404,
            message:`Card not found`
        }
    }
    if(!checkCard.password){
        throw{
            status:404,
            message:`Card not actived`
        }
    }
    if(checkCard.isBlocked){
        throw{
            status:404,
            message:`Card is blocked`
        }
    }
    verifyPassword(password,checkCard.password)
    const checkBusiness = await businessesRepository.findById(businessId)
    if(!checkBusiness){
        throw{
            status:404,
            message:`Business not registered`
        }
    }
    if(checkBusiness.type !== checkCard.type){
        throw{
            status:404,
            message:`Business type do not accepted this card`
        }
    }
    const checkBalance = await checkBalanceOnCard(cardId)
    if( checkBalance < amount){
        throw{
            status:400,
            message:`insufficient account balance`
        }
    }
    await paymentRepository.insert(purchasesData)
    
}