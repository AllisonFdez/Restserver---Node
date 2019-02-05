//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Fecha de expiración del Token 60*60*24*30
process.env.CADUCIDAD_TOKEN = 60 * 60 * 30 * 24

//SEED del Token. (Autenticación)
process.env.SEED = process.env.SEED || 'Secret'

//Google CLIENT_ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '977609547546-g7rafhen2rpm1iaksq91v0990vq67fne.apps.googleusercontent.com'

//Base de datos
let urlDataBase;
if (process.env.NODE_ENV === 'dev') {
    urlDataBase = 'mongodb://localhost:27017/coffe'
} else {
    // Hacer variable de entorno con Heroku para no mostrar esto.
    //urlDataBase = 'mongodb://Coffe:Hola2019@ds211275.mlab.com:11275/coffe'
    urlDataBase = process.env.MONGO_URL
}

process.env.URLDB = urlDataBase;