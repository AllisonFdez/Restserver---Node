const jwt = require('jsonwebtoken');

// Verificar Token 
// Next lo que hace es continuar  con la ejecución del programa.

// Si no llama el "Next" ahí muere el código.
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    //Aquí se ejecuta el middleware y hace el next.
    //console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario = decoded.usuario;
        next()
    })
}

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next()
    })
}

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next()
    } else {
        res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es admin.'
            }
        })
    }
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}