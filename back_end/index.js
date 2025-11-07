require('dotenv').config();
const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 

const userRoutes = require('./routes/userRoutes');
const filmRoutes = require('./routes/filmsRoutes/filmRoutes');
const favoriRoutes = require('./routes/filmsRoutes/favoriRoutes');


const app = express();
const port = 3000;

//Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/favoris', favoriRoutes);
// app.use('/api/users/:id', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
}); 

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');})
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

app.listen(port, () => {
  console.log(`Server online at http://localhost:${port}`);
});