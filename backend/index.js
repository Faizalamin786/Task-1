const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors'); // Import CORS module
const path = require('path');
// Middleware
app.use(bodyParser.json());
app.use(cors()); // Use CORS middleware





//-------------------------video section---------------------------------//




// MongoDB Connection
mongoose.connect('mongodb+srv://Faizal:Faizal786@faizal.atlxp5u.mongodb.net/login', {})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
const authRoutes = require('./auth/authRoutes');
app.use('/api/auth', authRoutes);


var __dirname = path.resolve();

app.use(express.static(path.join(__dirname,"/frontend/dist")));

app.get("*",(req, res) => {
  res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
})
 
//connecting front-end








// Start Server
const PORT = "https://task-1-0ob5.onrender.com/";
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
