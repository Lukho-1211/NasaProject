const request = require('supertest');
const app = require('../../app');
const {
    mongoConnect,
    mongoDisconnect,
} = require('../../services/monogo');

describe('Launches API', ()=>{
    beforeAll( async()=>{
        await mongoConnect();
    });

    afterAll(async()=>{
        await mongoDisconnect();
    });

    describe('Test GET /launches', ()=>{
        test('It should respond with 200 success',async()=>{
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
        });
    });

    describe('Test POST /launches',()=>{
        const completeLaunchData = {
            mission: "Auto Worker",
            rocket: "NCC Bolt",
            target: "Kepler-62 f",
            launchDate: 'January 2, 2028',
        };
        const completeLaunchWithoutDate = {
            mission: "Auto Worker",
            rocket: "NCC Bolt",
            target: "Kepler-62 f",
        };
        const launchDataWithInvalidDate ={
            mission: "Auto Worker",
            rocket: "NCC Bolt",
            target: "Kepler-62 f",
            launchDate: 'Beer',
        };


        test('It should respond with 201 success', async()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responsData = new Date(response.body.launchDate).valueOf();

            expect(responsData).toBe(requestDate);
            expect(response.body).toMatchObject(completeLaunchWithoutDate);
        });

        test('It should catch missing required properties', async()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(completeLaunchWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Missing required launch properties',
            });
        });

        test('It should catch invalid date', async()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            });
        }); 
    });

});