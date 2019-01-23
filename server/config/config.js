//Puerto
process.env.PORT = process.env.PORT || 3000;
//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//Base de datos
let urlDataBase;
if (process.env.NODE_ENV === 'dev') {
    urlDataBase = 'mongodb://localhost:27017/coffe'
} else {
    urlDataBase = 'mongodb://mongodb://Coffe:Hola2019@ds211275.mlab.com:11275/coffe'
}

process.env.URLDB = urlDataBase;