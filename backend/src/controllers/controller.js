const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const fs = require('fs');


const Joi = require('joi');
const validateRequest = require('src/middlewares/validate-request');
const authorize = require('src/middlewares/authorize')
const Role = require('src/database/role');
const accountService = require('src/services/account.service');

// grpc
const setup = require('src/_gRPC/class/setup');
const grpc = require('src/_gRPC/grpc');


// gRPC 
router.post('/:route/:action', system_log);
// router.post('/listActivity', grpc.listActivity());
// router.post('/listRepo', grpc.listRepo());
// router.post('/listUser', grpc.listUser());
// router.post('/listCatalog', grpc.listCatalog());
// router.post('/getUserInfo', grpc.getUserInfo());
// router.post('/getCatalogInfo', grpc.getCatalogInfo());
// router.post('/createRepo', grpc.createRepo());
// router.post('/registerUser', grpc.registerUser());
// router.post('/registerCatalog', grpc.registerCatalog());
router.get('/download/:path', downloadFile);
router.post('/upload/:repo_id',
    fileUpload({
        createParentPath: true,
        safeFileNames: true,
        preserveExtension: 10,
        useTempFiles: true,
        tempFileDir: 'src/cache/upload/'
    }), uploadFile)


async function uploadFile(req, res) {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field to retrieve the uploaded file
            let up = req.files.up;
            
            //Use the mv() method to place the file in upload directory
            // up.mv('src/_gRPC/data/upload/' + up.name);

            let request = {
                id: req.params.repo_id,
                name: up.name.split('.').shift(),
                type: up.name.split('.').pop(),
                size: up.size
            }

            grpc.uploadFile(request)

            //send response
            res.send({
                status: '200',
                message: 'File is uploaded',
                data: {
                    name: up.name,
                    mimetype: up.mimetype,
                    size: up.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
};


async function downloadFile(req, res) {
    const meta = req.params.path.split('.');
    const request = {
        path: req.params.path,
        name: meta[2],
        type: meta[3]
    }

    grpc.downloadFile(request).then(path => {
        res.download(path, function (err) {
            if (err) throw err
            fs.unlinkSync(path)
        })
    }).catch(err => {
        console.log(err)
    })
}




function system_log(req, res, next){
    let request = new setup(
        req.params.route,
        req.params.action,
        req.body.jsonParam
    )
    grpc.systemLog(request).then(response => {

        const responseObject = ({
            system: JSON.parse(response.system),
            action: JSON.parse(response.action),
            result: JSON.parse(response.result)
        })

        res.json(responseObject)

    }).catch(err => {
        console.log(err)
    })
}


// function uploadFile(req, res, next){
//     let request = new setup(
//         req.body.route,
//         req.body.jsonAction,
//         req.body.jsonParam
//     )
//     grpc.countActivity(request).then(response => {
//         res.json(response)
//     }).catch(err => {
//         console.log(err)
//     })
// }


// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', authorize(), revokeTokenSchema, revokeToken);
router.post('/register', registerSchema, register);
router.post('/verify-email', verifyEmailSchema, verifyEmail);
router.post('/forgot-password', forgotPasswordSchema, forgotPassword);
router.post('/validate-reset-token', validateResetTokenSchema, validateResetToken);
router.post('/reset-password', resetPasswordSchema, resetPassword);
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(Role.Admin), createSchema, create); 
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;





function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    const {
        email,
        password
    } = req.body;
    const ipAddress = req.ip;
    accountService.authenticate({
            email,
            password,
            ipAddress
        })
        .then(({
            refreshToken,
            ...account
        }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

function refreshToken(req, res, next) {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    accountService.refreshToken({
            token,
            ipAddress
        })
        .then(({
            refreshToken,
            ...account
        }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

function revokeTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function revokeToken(req, res, next) {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (!token) return res.status(400).json({
        message: 'Token is required'
    });

    // users can revoke their own tokens and admins can revoke any tokens
    if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    accountService.revokeToken({
            token,
            ipAddress
        })
        .then(() => res.json({
            message: 'Token revoked'
        }))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        acceptTerms: Joi.boolean().valid(true).required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    accountService.register(req.body, req.get('origin'))
        .then(() => res.json({
            message: 'Registration successful, please check your email for verification instructions'
        }))
        .catch(next);
}

function verifyEmailSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function verifyEmail(req, res, next) {
    accountService.verifyEmail(req.body)
        .then(() => res.json({
            message: 'Verification successful, you can now login'
        }))
        .catch(next);
}

function forgotPasswordSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });
    validateRequest(req, next, schema);
}

function forgotPassword(req, res, next) {
    accountService.forgotPassword(req.body, req.get('origin'))
        .then(() => res.json({
            message: 'Please check your email for password reset instructions'
        }))
        .catch(next);
}

function validateResetTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function validateResetToken(req, res, next) {
    accountService.validateResetToken(req.body)
        .then(() => res.json({
            message: 'Token is valid'
        }))
        .catch(next);
}

function resetPasswordSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });
    validateRequest(req, next, schema);
}

function resetPassword(req, res, next) {
    accountService.resetPassword(req.body)
        .then(() => res.json({
            message: 'Password reset successful, you can now login'
        }))
        .catch(next);
}

function getAll(req, res, next) {
    accountService.getAll()
        .then(accounts => res.json(accounts))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own account and admins can get any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    accountService.getById(req.params.id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        role: Joi.string().valid(Role.Admin, Role.User).required()
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    accountService.create(req.body)
        .then(account => res.json(account))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schemaRules = {
        title: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
    };

    // only admins can update role
    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
    }

    const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    // users can update their own account and admins can update any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    accountService.update(req.params.id, req.body)
        .then(account => res.json(account))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own account and admins can delete any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    accountService.delete(req.params.id)
        .then(() => res.json({
            message: 'Account deleted successfully'
        }))
        .catch(next);
}

// helper functions

function setTokenCookie(res, token) {
    // create cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}