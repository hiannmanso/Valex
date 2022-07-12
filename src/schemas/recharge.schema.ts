import joi from 'joi'


const rechargeSchema = joi.object({
    cardId: joi.number().required(),
    value:joi.number().required(),
    EmployeeId:joi.number().required(),
})

export default rechargeSchema