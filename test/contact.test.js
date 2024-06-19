import supertest from "supertest";
import {createTestUser, getTestContact, removeAllTestContacts, removeTestUser, createTestContact } from "./test-util";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";



describe('POST /api/contacts', function () {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('should can create new contact', async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set('Authorization', 'test')
            .send({
                first_name: "test",
                last_name: "test",
                email: "test@pzn.com",
                phone: "08090000000"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe("test");
        expect(result.body.data.last_name).toBe("test");
        expect(result.body.data.email).toBe("test@pzn.com");
        expect(result.body.data.phone).toBe("08090000000");
    });

    it('should reject if request is not valid', async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set('Authorization', 'test')
            .send({
                first_name: "",
                last_name: "test",
                email: "test",
                phone: "0809000000043534534543534534543535345435435"
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});


describe('GET /api/contacts/:id', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    })

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('should can get contact', async () => {
        const contact =  await getTestContact();
        const result = await supertest(web)
            .get("/api/contacts/" + contact.id)
            .set('Authorization', 'test');

        logger.error(`Response Error ${result.body.errors}`);
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe("test");
        expect(result.body.data.last_name).toBe("test");
        expect(result.body.data.email).toBe("test@pzn.com");
        expect(result.body.data.phone).toBe("080900000");
    });

    it('should return 404 if contact id is not found', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get("/api/contacts/" + (testContact.id + 1))
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});