const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');

const app = express();
app.use(express.json());
app.use(verifyToken);
app.get('/protected', (req, res) => {
    res.send('Access granted');
});

describe('verifyToken Middleware', () => {
    it('should allow access with valid token', async () => {
        const token = jwt.sign({_id: 'user123'}, process.env.TOKEN_SECRET);
        await request(app)
        .get('/protected')
        .set('Authorization', token)
        .expect(200)
        .then((response) => {
            expect(response.text).toBe('Access granted');
        });
    });

    it('should deny access without token', async () => {
        await request(app)
        .get('/protected')
        .expect(401)
        .then((response) => {
            expect(response.text).toBe('Access Denied');
        });
    });

    it('should deny access with invalid token', async () => {
        await request(app)
        .get('/protected')
        .set('Authorization', 'invalidToken')
        .expect(400)
        .then((response) => {
            expect(response.text).toBe('Invalid Token');
        });
    });
});