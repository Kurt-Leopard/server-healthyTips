import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import { configDotenv } from 'dotenv';
configDotenv();
const app = express();
app.use(express.json());
app.use(cors());
const port = 4000;
const dbcon = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

dbcon.connect((error) => {
    if (error) {
        console.log("Connection failed!");
        return;
    }
    console.log("Connection successful!")
});

app.post('/login', (req, res) => {
    const query = "SELECT email, password FROM users WHERE email=? AND password=?";
    const data = [req.body.email, req.body.password];
    dbcon.query(query, data, (err, result) => {
        if (err) {
            res.json({ success: false, msg: 'Error occurred while querying database' });
            return;
        }

        if (result.length === 0) {
            res.json({ success: false, msg: 'User not found!' });
            return;
        }
        function generateRandomToken(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[{]}|;:,<.>/?';
            const charactersLength = characters.length;
            let token = '';

            for (let i = 0; i < length; i++) {
                token += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            return token;
        }

        const token = generateRandomToken(16);
        console.log('Random Token:', token);

        res.json({ success: true, msg: result, token: token })
    });
});



app.post('/register', (req, res) => {
    const query = "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)";
    const data = [req.body.fullname, req.body.email, req.body.password];
    dbcon.query(query, data, (err, result) => {
        if (err) {
            res.json({ success: false, msg: 'Error occurred while querying database' });
            return;
        }
        res.json({ success: true, msg: 'Register successful!' })
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
