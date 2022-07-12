import rechargeRepository from "../repositories/rechargeRepository.js";
import { desencrypt } from "../utils/encryptThings.js";


export function verifyPassword(password:number,encryptedPassword:number) {
    if(password !== desencrypt(encryptedPassword)){
        return true

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