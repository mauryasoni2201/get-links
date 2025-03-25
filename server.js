const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const connectDb = async () => {
    try {
        await mongoose.connect(`mongodb+srv://admin:admin@records.tc5dog6.mongodb.net/?retryWrites=true&w=majority&appName=RECORDS`);
        console.log(`DB connected`);
    } catch (error) {
        console.log(error);
    }
};
connectDb();

const linkSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true }
});

const Link = mongoose.model('Link', linkSchema);

app.post('/add-link', async (req, res) => {
    try {
        const links = req.body;
        if (!Array.isArray(links) || links.length === 0) {
            return res.status(400).json({ error: "An array of links is required" });
        }
        for (const link of links) {
            if (!link.name || !link.url) {
                return res.status(400).json({ error: "Each link must have a name and URL" });
            }
        }
        const newLinks = await Link.insertMany(links);
        res.status(201).json({ message: "Links added successfully", data: newLinks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/get-links', async (req, res) => {
    try {
        const links = await Link.find();
        res.status(200).json({ data: links });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.listen(4000, () => {
    console.log(`Server running on port 4000.`);
});