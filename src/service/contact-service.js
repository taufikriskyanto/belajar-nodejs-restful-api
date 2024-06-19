import { validate } from "../validation/validation.js";
import { createContactValidation, getContactValidation, updateContactValidation } from "../validation/contact-validation.js";
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

const update = async (username, request)=>{
    const contact =  validate(updateContactValidation, request);
    const result  =  await prismaClient.contact.count({
        where : {
            username : username,
            id : contact.id
        }
       });

    if(result !==1){
        throw new ResponseError(404, "User is not found")
    }

    const data = {}
    if(contact.first_name){
        data.first_name = contact.first_name;
    }
    if(contact.last_name){
        data.last_name =  contact.last_name;
    }

    if(contact.email){
        data.email = contact.email
    }

    if(contact.phone){
        data.phone = contact.phone
    }
        return await prismaClient.contact.update({
            where :{
                username : username,
                id : contact.id
            },
            data : data,
            select : {
                id : true,
                first_name : true,
                last_name : true,
                email : true,
                phone : true
            }
        })
}

export default {
    create,
    get,
    update
}