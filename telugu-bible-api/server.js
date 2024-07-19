const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const verseSchema = new mongoose.Schema({
    book: String,
    chapter: Number,
    verse: Number,
    text: String
});

const Verse = mongoose.model('Verse', verseSchema);

app.get('/', (req, res) => {
    res.send('Welcome to Telugu Bible API');
});

app.get('/verses', async (req, res) => {
    try {
        const verses = await Verse.find();
        res.json(verses);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/verses/:book/:chapter/:verse', async (req, res) => {
    try {
        const { book, chapter, verse } = req.params;
        const verseData = await Verse.findOne({ book, chapter, verse });
        if (verseData) {
            res.json(verseData);
        } else {
            res.status(404).send('Verse not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/verses', async (req, res) => {
    const verse = new Verse(req.body);
    try {
        await verse.save();
        res.status(201).send(verse);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
