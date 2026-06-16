const request = require('supertest')
const app = require('../index'); //the main index
const pool = require('../configs/database') //main database

//create table for test_blogs
beforeAll( async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(255) NOT NULL
        );
        `);
});

//clean the data in the table after each test
afterEach( async () => {
    await pool.query(`TRUNCATE TABLE blogs RESTART IDENTITY CASCADE;`);
})

//stop: close the databse connection after the test
afterAll(async() => {
    await pool.end();
})

//integrate the testing controller
describe('Blogs API Controller Integration Test', () => {

    //testing 1 add blogs data
    it('POST /blog -> should create a new blogs', async () => {
        const response = await request(app)
        .post('/blog')
        .send({
            title: 'Postgres API', content: 'Integration testing'
        })

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Blogs Added');
    })

    //get the database testing
    it('GET /blog -> should fetch a single blog by ID', async () => {
        await pool.query('INSERT INTO blogs (title, content) VALUES($1, $2);', ['Test API', 'It would success'])

        const response = await request(app).get('/blog')

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1)
        expect(response.body[0].title).toBe('Test API')
    })

    //testing get a single data (success or not found)
    it('GET /blog/:id -> should fetch a single data with ID',async () => {
        await pool.query('INSERT INTO blogs (title, content) VALUES($1, $2);',
            ['Test 1', 'should get this test 1']
        )

        const response = await request(app).get('/blog/1');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe('Test 1');
    })

    it('GET /blogs/:id -> should we get 404 not found',async () => {
        const response = await request(app).get('/blog/999');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('blog is not found')
    })

    it('PUT /blogs/:id -> should be update the data of ID',async () => {
        await pool.query('INSERT INTO blogs (title, content) VALUES($1, $2);', 
            ['Old Title', 'Old Content']
        );

        const response = await request(app).put('/blog/1')
            .send({
                title: 'New Title', content: 'New Content'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('update successful!');
        expect(response.body.data.title).toBe('New Title');
    })

    //delete testing one data 
    it('DELETE /blogs/:id -> should delete a one specific blog data ID', async () => {
        await pool.query('INSERT INTO blogs (title, content) VALUES ($1, $2);', ['To Be Deleted', 'Content']);


        const response = await request(app).delete('/blog/1');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Deleted successful!')
    })
})
