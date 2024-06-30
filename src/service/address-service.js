import { validate } from "../validation/validation.js";
import { createAddressValidation, validationAddressId, updateAddressValidation } from "../validation/address-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { getContactValidation } from "../validation/contact-validation.js";
import { logger } from "../application/logging.js";

const checkContactMustExists = async(user, contactId)=>{
    contactId = validate(getContactValidation, contactId);
    const totalContactInDatabase = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contactId
        }
    });

    if (totalContactInDatabase !==1){
        throw new ResponseError(404, "Contact is not found");
    }
    return contactId;
}
const create = async (user, contactId, request) => {
    contactId = await checkContactMustExists(user, contactId);


    const address = validate(createAddressValidation, request);

    address.contact_id = contactId;
    return await prismaClient.address.create({
        data: address,
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    });
}

const getAddress = async(user, contactId, addressId)=>{
    contactId =  await checkContactMustExists(user, contactId);

    addressId = validate(validationAddressId, addressId);
    
    const result =  await prismaClient.address.findUnique({
        where :{
            id: addressId,
            contact_id: contactId
        },
        select:{
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    });
    
    if(result === null){
        throw new ResponseError(404, "Address is not found");
    }
    logger.info(`Result Address ${result}`);
    return result;
}


const update  = async(user, contactId, request)=>{
    contactId =  await checkContactMustExists(user, contactId);

    request = validate(updateAddressValidation, request);

    const result =  await prismaClient.address.count({
        where :{
            id: request.id,
            contact_id: contactId
        }
    });

    if(result !==1){
        throw new ResponseError(404, "Address is not found");
    }

    return await prismaClient.address.update({
        data: request,
        where: {
            id: request.id,
            contact_id: contactId
        },
        select:{
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    })

}
const remove = async (user, contactId, addressId) => {
    contactId = await checkContactMustExists(user, contactId);
    addressId = validate(validationAddressId, addressId);

    const totalAddressInDatabase = await prismaClient.address.count({
        where: {
            contact_id: contactId,
            id: addressId
        }
    });

    if (totalAddressInDatabase !== 1) {
        throw new ResponseError(404, "address is not found");
    }

    return prismaClient.address.delete({
        where: {
            id: addressId
        }
    });
}
export default {
    create,
    getAddress,
    update,
    remove
}