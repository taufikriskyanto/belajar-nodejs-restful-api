import contactService from "../service/contact-service.js";

const create = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const result = await contactService.create(user, request);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) =>{
    try{
        const request =  req.user.username;
        const contactId =  req.params.contactId;
        const result = await contactService.get(request, contactId);
        res.status(200).json({
            data : result
        })
    }catch(e){
        next(e);
    }
}

const update = async (req, res, next) =>{
    try{
        const username =  req.user.username;
        const request = req.body;
        request.id =  req.params.contactId;
        const result = await contactService.update(username, request);
        res.status(200).json({
            data : result
        })
    }catch(e){
        next(e)
    }
}

const remove = async (req, res, next) =>{
    try{
        const request = req.user
        const id = req.params.contactId;
        const result = await contactService.remove(request, id);
        res.status(200).json({
            data : result
        });
    }catch(e){
        next(e)
    }
}

const search = async (req, res, next) => {
    try {
        const user = req.user;
        const request = {
            name: req.query.name,
            email: req.query.email,
            phone: req.query.phone,
            page: req.query.page,
            size: req.query.size
        };

        const result = await contactService.search(user, request);
        res.status(200).json({
            data: result.data,
            paging: result.paging
        });
    } catch (e) {
        next(e);
    }
}

export default{
 create,
 get,
 update,
 remove,
 search
}