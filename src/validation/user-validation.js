import Joi from "joi";

const reqistrationUserValidation  =  Joi.object({
    username  : Joi.string().max(100).required(),
    password : Joi.string().max(100).required(),
    name :  Joi.string().max(100).required()
});

const loginUserValidation  =  Joi.object({
    username  : Joi.string().max(100).required(),
    password : Joi.string().max(100).required()
})

const getUserValidation  = Joi.string().max(100).required();


const updateUserValidation = Joi.object({
    username : Joi.string().max(100).required(),
    password : Joi.string().max(100).required(),
    name : Joi.string().max(100).optional()
})

export {
    reqistrationUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation
}
