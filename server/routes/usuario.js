const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();

app.get('/', function(req, res) {
    res.send('Sistra')
});

app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 5;
    limite = Number(limite)

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde) //Saltar registros.
        .limit(limite) //Cantidad de registros que quiero traer.
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, count) => {
                res.json({
                    ok: true,
                    cantidad: count,
                    usuarios

                })
            })
        })
});

app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
            //img: body.img
    });

    //Forma para no retornar el valor de Password.
    //usuarioDB.password = null

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         estado   : false,
    //         mensaje: 'El nombre es necesario.'
    //     })
    // } else {
    //     res.json({
    //         body
    //     })
    // }

});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //Una forma de no permitir que se actualicen registros.
    // delete body.password;
    // delete body.google 

    Usuario.findOneAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    // De esta manera se borra un registro físicamente.
    //Usuario.findByIdAndRemove(id, body, (err, usuarioDeleted) => {
    let newEstado = {
        estado: false
    }
    Usuario.findOneAndUpdate(id, newEstado, { new: true }, (err, usuarioDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        // Otra forma usuarioDeleted===null
        if (!usuarioDeleted) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado.'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDeleted
        })
    })
});

module.exports = app;