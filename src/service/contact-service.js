import { validate } from "../validation/validation.js";
import { createContactValidation, getContactValidation, removeContactValidation, updateContactValidation, searchContactValidation } from "../validation/contact-validation.js";
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

 const remove  = async (request, contactId) =>{
        const id = validate(removeContactValidation, contactId);
        const result  =  await prismaClient.contact.count({
            where : {
                username : request.username,
                id : id
            }
           });

        if(result < 1){
            throw new ResponseError(404, "Contact is not found")
        }else{
            const resultDelete = await prismaClient.contact.delete({
                where :{
                    username : request.username,
                    id : id
                }
            });

            if(resultDelete.id === id){
                return "OK";
            }
        }
 }

 const search = async (user, request) =>{
    request =  validate(searchContactValidation, request);

    // 1 ((page - 1) * size) = 0
    // 2 ((page - 1) * size) = 10
    const skip = (request.page - 1) * request.size;

    const filters = [];

    filters.push({
        username: user.username
    })

    if (request.name) {
        filters.push({
            OR: [
                {
                    first_name: {
                        contains: request.name
                    }
                },
                {
                    last_name: {
                        contains: request.name
                    }
                }
            ]
        });
    }
    if (request.email) {
        filters.push({
            email: {
                contains: request.email
            }
        });
    }
    if (request.phone) {
        filters.push({
            phone: {
                contains: request.phone
            }
        });
    }

    const contacts =  await prismaClient.contact.findMany({
        where :{
            AND : filters
        },
        take : request.size,
        skip : skip
    });

    const totalItems = await prismaClient.contact.count({
        where: {
            AND: filters
        }
    });

    return {
        data: contacts,
        paging: {
            page: request.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / request.size)
        }
 }
}

export default {
    create,
    get,
    update,
    remove,
    search
}