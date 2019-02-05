require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Rutas
app.use(require('./routes/index'));

//Habilitar carpeta public.
app.use(express.static(path.resolve(__dirname, '../public')))
    //console.log(path.resolve(__dirname, '../public'));

//mongoose.connect('mongodb://localhost:27017/coffe', (err, res) => {
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('DB online.');
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});