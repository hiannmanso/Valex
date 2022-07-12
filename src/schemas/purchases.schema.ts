import joi from 'joi'


const purchasesSchema = joi.object({
    cardId: joi.number().required(),
    password:joi.number().required(),
    businessId:joi.number().required(),
    amount:joi.number().required()
})

export default purchasesSchema