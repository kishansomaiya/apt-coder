const PORT = 8081
const express = require('express');
const { MongoClient } = require('mongodb');
const {v4: uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');

const uri = process.env.MONGO_URI

const app = express();
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
    res.json("Hello to my app");
})

app.post("/signup", async (req, res) => {
    const client = new MongoClient(uri)
    const { email, password } = req.body

    const generatedUserId = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const existUser = await users.findOne({ email })

        if(existUser) {
            return res.status(409).send('User already exists. Please login')
        }

        const sanitizedEmail = email.toLowerCase()

        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword
        }

        const insertedUser = await users.insertOne(data)

        const token = jwt.sign(insertedUser, sanitizedEmail, { 
            expiresIn: 60 * 24 
        })

        res.status(201).json({ token, userId: generatedUserId })
    } catch (error) {
        console.log(error)
    }
})

app.post('/login', async (req, res) => {
    const client = new MongoClient(uri)
    const { email, password } = req.body

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const user = await users.findOne({ email })

        const correctPassword = await bcrypt.compare(password, user.hashed_password)

        if(user && correctPassword) {
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 24
            })
            res.status(201).json({ token, userId: user.user_id })
        }
        res.send(400).send('Invalid Credentials')
    } catch (error) {
        console.log(error)
    }
})

app.put('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = { user_id: formData.user_id }
        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                dob_name: formData.dob_name,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                show_gender: formData.show_gender,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                url: formData.url,
                about: formData.about,
                matches: formData.matches
            },
        }
        const insertedUser =  await users.updateOne(query, updateDocument)
        res.send(insertedUser)
    } finally {
        await client.close()
    }
})

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
})


app.listen(process.env.PORT || PORT, () => console.log('Server running on port ' + PORT));