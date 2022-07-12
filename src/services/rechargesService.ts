import cardRepository from "../repositories/cardRepository.js"
import companyRepository from "../repositories/companyRepository.js"
import employeeRepository from "../repositories/employeeRepository.js"
import rechargeRepository from "../repositories/rechargeRepository.js"



export async function recharge(apiKey:any,cardId,value,EmployeeId) {
    const rechargeValues ={cardId, amount:value}
    if(value<=0){
        throw{
            status:400,
            message:`Invalid value.`
        }
    }  
    const checkCompany = await companyRepository.findByApiKey(String(apiKey))
    if(!checkCompany){
        throw{
            status:404,
            message:`Company not found`
        }
    }  
    const checkEmployee = await employeeRepository.findById(EmployeeId)
    if(!checkEmployee){
        throw{
            status:404,
            message:`could not find this employee`
        }
    }
    if(checkCompany.id !==checkEmployee.companyId){
        throw{
            status:400,
            message:`This employee does not belong to the company`
        }
    }
    const checkCardValid = await cardRepository.findById(cardId)
    if(!checkCardValid){
        throw{
            status:404,
            message:`Card not found`
        }
    }
    if(checkCardValid.isBlocked || !checkCardValid.password){
        throw{
            status:404,
            message:`Card not active`
        }
    }
    await rechargeRepository.insert(rechargeValues)
}