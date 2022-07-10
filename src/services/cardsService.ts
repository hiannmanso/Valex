import {faker} from '@faker-js/faker'
import dayjs from 'dayjs'
import Cryptr from 'cryptr'
import cardRepository, { TransactionTypes } from '../repositories/cardRepository.js'

export function generatorInfosCards(userName:string,employeeId:number,type:TransactionTypes) {
    const cryptr = new Cryptr('123')
    // dayjs(expirationDate).isBefore(dayjs(Date.now()).format("MM-YY"));
    const creditCardNumber = faker.finance.creditCardNumber('visa')
    const nameOnCard = geratorNameOnCard(userName)
    const year = dayjs().year()
    const expirationDate = dayjs().set('year',Number(year) + 5).format('MM/YY')
    const cvc = faker.finance.creditCardCVV();
    const cryptedCVC= cryptr.encrypt(cvc)
    
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