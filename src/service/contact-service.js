import { validate } from "../validation/validation.js";
import { createContactValidation, getContactValidation } from "../validation/contact-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const create = async (user, request) => {
    const contact = validate(createContactValidation, request);
    contact.username = user.username;

    return prismaClient.contact.create({
        data: contact,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });
}

const get = async (request, requestId) =>{
    const contact =  validate(getContactValidation, requestId);

    const contactResult  =  await prismaClient.contact.findFirst({
        where :{
            id : contact,
            username :  request
        },
        select :{
            id :  true,
            first_name : true,
            last_name : true,
            email : true,
            phone : true
        }
    });

    if(!contactResult){
        throw new ResponseError(404, "Contact is not found")
    }
    return contactResult;


}

export default {
    create,
    get
}