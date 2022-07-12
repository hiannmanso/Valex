import joi from 'joi'


const activeCardSchema = joi.object({
    idUser: joi.number().required(),
    cvc:joi.string().required().min(3).max(3),

    cardType: joi.string().valid('groceries', 'restaurants', 'transport', 'education', 'health').required(),
    password:joi.string().required().max(4).min(4),
})

export default activeCardSchema