import joi from 'joi'


const newCardSchema = joi.object({
    idUser: joi.number().required(),
    cardType: joi.string().valid('groceries', 'restaurants', 'transport', 'education', 'health').required(),
    userName:joi.string().pattern(/^[a-zA-ZãÃÇ-Üá-ú ]*$/i)
})

export default newCardSchema