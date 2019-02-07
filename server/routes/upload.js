const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //Validar tipo
    let tipoValidos = ['productos', 'usuarios'];

    if (tipoValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Los tipos validos son' + tipoValidos,
            tipos: tipoValidos
        })
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado archivo.'
            }
        })
    };

    let simpleFile = req.files.archivo;
    let nombreArchivo = simpleFile.name.split('.')
    let extension = nombreArchivo[nombreArchivo.length - 1]

    let extensionsValidas = ['png', 'jpg', 'jpeg']

    //Validar extension.
    if (extensionsValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Las extensiones validas son' + extensionsValidas,
            extension: extension
        })
    }

    //Nombre del archivo - Asegurar que sea unico.
    let nombreArchivog = `${id}-${new Date().getMilliseconds()}.${extension}`

    simpleFile.mv(`uploads/${tipo}/${nombreArchivog}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivog)
        } else {
            imagenProducto(id, res, nombreArchivog)
        }
        //Aquí, es seguro que la imagen es guardada.

        // res.json({
        //     ok: true,
        //     message: 'Archivo guardado.'
        // })
    })
});

function imagenUsuario(id, res, nombreArchivog) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivog, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivog, 'usuarios')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El usuario no existe.'
                }
            })
        }

        borrarArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivog;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivog
            })
        })
    })
}

function imagenProducto(id, res, nombreArchivog) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivog, 'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivog, 'productos')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no existe.'
                }
            })
        }

        borrarArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivog;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivog
            })
        })
    })
}

function borrarArchivo(nombreImagen, tipo) {
    // Esta es la imagen que se quiere borrar.
    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}

module.exports = app;