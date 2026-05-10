const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer'); 
const Item = require('./models/Item');

// --- DATABASE CONNECTION ---
mongoose.connect('mongodb+srv://abhinavshri_2001:Shrijal2003@cluster0.xi7k6es.mongodb.net/lostfoundDB=Cluster0')
  .then(() => console.log("✅ Badhai ho! Local Database Connect ho gaya!"))
  .catch((err) => console.log("❌ DB Connection Error: ", err));

// --- SETTINGS ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// --- MULTER STORAGE ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'public/uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. Home Page
app.get('/', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.render('index', { items: items });
    } catch (err) {
        res.status(500).send("Error fetching items.");
    }
});

// 2. Report Page
app.get('/report', (req, res) => {
    res.render('report');
});

// 3. Add Item (Sahi Brackets ke sath)
app.post('/addItem', upload.single('image'), async (req, res) => {
    try {
        const newItem = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            contact: req.body.contact,
            image: req.file ? '/uploads/' + req.file.filename : ''
        });
        await newItem.save();
        res.redirect('/'); 
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

// 4. Admin Delete Route (Sahi Brackets ke sath)
app.post('/delete/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id); 
        res.redirect('/'); 
    } catch (err) {
        res.send("Delete karne mein error aaya: " + err);
    }
});

// --- SERVER START ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});