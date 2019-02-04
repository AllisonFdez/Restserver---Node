require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Rutas
app.use(require('./routes/index'));

//mongoose.connect('mongodb://localhost:27017/coffe', (err, res) => {
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('DB online.');
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});