import {faker} from '@faker-js/faker'
import dayjs from 'dayjs'
import Cryptr from 'cryptr'
import cardRepository, { TransactionTypes } from '../repositories/cardRepository.js'
import {desencrypt, encrypt} from '../utils/encryptThings.js'
import companyRepository from '../repositories/companyRepository.js'
import employeeRepository from '../repositories/employeeRepository.js'
import paymentRepository from '../repositories/paymentRepository.js'
import rechargeRepository from '../repositories/rechargeRepository.js'

export function generatorInfosCards(userName:string,employeeId:number,type:TransactionTypes) {
    const cryptr = new Cryptr('123')
    // dayjs(expirationDate).isBefore(dayjs(Date.now()).format("MM-YY"));
    const creditCardNumber = faker.finance.creditCardNumber('visa')
    const nameOnCard = geratorNameOnCard(userName)
    const year = dayjs().year()
    const expirationDate = dayjs().set('year',Number(year) + 5).format('MM/YY')
    const cvc = faker.finance.creditCardCVV();
    
    const cryptedCVC = encrypt(cvc)
    const infoCard = {
        employeeId,
        number:creditCardNumber,
        cardholderName:nameOnCard,
        securityCode:cryptedCVC,
        expirationDate,
        password:null,
        isVirtual:false,
        isBlocked:false,
        type,


    }
    const showInfos = {
        employeeId,
        creditCardNumber,
        nameOnCard,
        cvc,
        expirationDate,
        type
    }
    cardRepository.insert(infoCard)
    return showInfos
}

function geratorNameOnCard(userName:string) {
    let nameOnCard:string[] = userName.split(' ')    
    nameOnCard= nameOnCard.filter((item)=>{
        if(item.length >3){
            return true
        }
    })
    for (let index = 0; index < nameOnCard.length; index++) {
        if(index !== 0 && index !== nameOnCard.length-1){
            nameOnCard.splice(index,1,nameOnCard[index][0])
        }
        
    }
    return nameOnCard.join(' ').toUpperCase()
}

export function verifyCvc(cvc:string,securityCode:string) {
    const cryptr = new Cryptr('123')
    if(cvc !== cryptr.decrypt(securityCode)){
        return true
    }
}


export async function newCard(apiKey:any,idUser:number,cardType:TransactionTypes, userName:string) {
    await validateCompany(apiKey)
    await validateEmployee(idUser)
    await validateCard(cardType,idUser)
    const infoCard = generatorInfosCards(userName,idUser,cardType)
    return infoCard
}

export async function activeCard(idUser:number,cvc:string,password:number,type:TransactionTypes) {
   const checkCardExist = await validateExistCard(type,idUser,cvc)
   const encryptedPassword = encrypt(password)
   const result  = await cardRepository.update(checkCardExist.id,{...checkCardExist,password:encryptedPassword})
   return result

}

export async function blockCards(cardNumber:string,cardName:string,expirationDate:string,password:string) {
    const checkCardExist =  await validateExistCardByDetails(cardNumber,cardName,expirationDate)
    console.log(desencrypt(checkCardExist.password))
    if(password != desencrypt(checkCardExist.password)){
        throw {
            status:404,
            message:`Password incorrect.`
        }
    }
    const cardBlocked = await cardRepository.update(checkCardExist.id,{...checkCardExist,isBlocked:true})
    return cardBlocked
}

export async function desblockCards(cardNumber:string,cardName:string,expirationDate:string,password:string) {
    const checkCardExist = await checkCard(cardNumber,cardName,expirationDate)    
    if(password != desencrypt(checkCardExist.password)){
        throw {
            status:404,
            message:`Password incorrect.`
        }
    }
    const cardBlocked = await cardRepository.update(checkCardExist.id,{...checkCardExist,isBlocked:false})
    return cardBlocked
}
export async function balance(cardId:number) {
    await validateCardExistByID(cardId)
    const result = await calculateBalance(cardId)
    return result
}

export async function checkCard(cardNumber:string,cardName:string,expirationDate:string) {
    const checkCardExist = await cardRepository.findByCardDetails(cardNumber,cardName,expirationDate)
      if(!checkCardExist){
        throw{
            status:404,
            message:`Card do not exist.`
        }
      }
      if(!checkCardExist.isBlocked){
        throw{
            status:404,
            message:`Card do not blocked`
        }
    }
    if(!checkCardExist.password){
        throw{
            status:404,
            message:`card do not actived`
        }
    }
    return checkCardExist
}

export async function validateCompany(apiKey:string) {
    const checkCompany = await companyRepository.findByApiKey(String(apiKey))
    if(!checkCompany){
        throw {
            status :404,
            message:`Company not found`
        };
        
    }
}
export async function validateCardExistByID(cardId:number) {
    const checkCardExist = await cardRepository.findById(cardId)
    if(!checkCardExist){
        throw{
            status:404,
            message:`Card not Found`
        }
    }

}
export async function calculateBalance(cardId:number) {
    const payments = await paymentRepository.findByCardId(cardId)
    const recharges = await rechargeRepository.findByCardId(cardId) 
    let totalPayments = 0 
    let totalRecharges = 0 
    for (const payment of payments) {
        totalPayments += Number(payment.amount)
    }
    for (const recharge of recharges) {
        totalRecharges += Number(recharge.amount)
    }
    const result = {
        balance:totalRecharges - totalPayments,
        transactions:[payments],
        recharges:[recharges]
    }
    return result
}
export async function validateEmployee(idUser:number) {
    const checkEmployee = await employeeRepository.findById(idUser)
    if(!checkEmployee){
        throw {
            status:404,
            message:`Employee not found`
        }        
    }
 
}
export async function validateCard(cardType:TransactionTypes,idUser:number) {
    const checkThisCard = await cardRepository.findByTypeAndEmployeeId(cardType,idUser)
    if(checkThisCard){
        throw {
            status:401,
            message:`Employee already owns this card`
        }
    }
    
}
export async function validateExistCard(type:TransactionTypes,idUser:number,cvc:string) {
    const checkThisCard = await cardRepository.findByTypeAndEmployeeId(type,idUser)
    if(!checkThisCard){
        throw {
            status:401,
            message:`Card not found`
        }
    }
    if(checkThisCard.password){
        throw{
            status:406,
            message:`Card already actived`
        }
    }
    if(checkThisCard.isBlocked){
        throw{
            status:404,
            message:`Card already blocked.`
        }
    }
    const checkCvc = verifyCvc(cvc,checkThisCard.securityCode)
    if(checkCvc){
        throw{
            status:404,
            message:`CVC do not match`
        }
    }
    return checkThisCard
}
export async function validateExistCardByDetails(cardNumber:string,cardName:string,expirationDate:string) {
    const checkThisCard = await cardRepository.findByCardDetails(cardNumber,cardName,expirationDate)
    if(!checkThisCard){
        throw {
            status:404,
            message:`Card not found`
        }
    }
    if(!checkThisCard.password){
        throw{
            status:406,
            message:`Card do not actived`
        }
    }
    if(checkThisCard.isBlocked){
        throw{
            status:404,
            message:`Card already blocked.`
        }
    }

    return checkThisCard
}