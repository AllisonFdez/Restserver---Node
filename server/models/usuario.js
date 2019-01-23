const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido.'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombres es obligatorio.']
    },
    email: {
        type: String,
        index: true,
        unique: true,
        required: [true, 'El email es obligatorio.']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria.']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// De esta manera no se imprime el valor de Password.
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único.' })
module.exports = mongoose.model('Usuario', usuarioSchema)