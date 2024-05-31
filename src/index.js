const express = require("express");
const path = require("path");
const LogInCollection = require("./mongo"); // Adjust path if necessary
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
// Paths
const rootPath = path.join(__dirname, '..'); // Move one directory up to reach the root folder
const publicPath = path.join(rootPath, 'public');
const templatePath = path.join(rootPath, 'templates');

// View engine setup
app.set('view engine', 'hbs');
app.set('views', templatePath); // Set the views directory to templates

// Static files
app.use(express.static(publicPath));

// Routes
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/signup', async (req, res) => {
    try {
        const { name, password } = req.body;
        const checking = await LogInCollection.findOne({ name });

        if (checking) {
            res.send("User details already exist");
        } else {
            const data = new LogInCollection({ name, password });
            await data.save();
            res.status(201).render('home');
        }
    } catch (error) {
        console.error("Error during signup:", error);
        res.send("Wrong inputs");
    }
});

app.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        const check = await LogInCollection.findOne({ name });

        if (check && check.password === password) {
            // Redirect to the specified URL after successful login
            res.redirect('https://adityaraj-restaurant-nexus-project2.netlify.app/');
        } else {
            res.send("Incorrect password");
        }
    } catch (e) {
        console.error("Error during login:", e);
        res.send("Wrong details");
    }
});

app.listen(port, (err) => {
    if (err) {
        console.error("Failed to connect to port:", err);
    } else {
        console.log(`Port connected on ${port}`);
    }
});
