require('../models/Usuario');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Usuario = mongoose.model('usuarios');
const bcrypt = require('bcryptjs');

// Formulário de login
router.get('/login', (req, res)=>{
    res.render('usuarios/login');
});

// Formulário de cadastro de novo usuário
router.get('/cadastrar', (req, res)=>{
    res.render('usuarios/cadastrar');
});

// Cadastrar novo usuário
router.post('/cadastrar', (req, res)=>{
    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome inválido!'});
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: 'E-mail inválido!'});
    }

    // Verifica se a senha é muito curta
    if (req.body.senha.length < 8) {
        erros.push({texto: 'A senha precisa ser pelo menos 8 dígitos'});
    }

    // Verifica se as senhas correspondem
    if (req.body.senha != req.body.reSenha) {
        erros.push({texto: 'As senhas não correspondem!'});
    }

    if (erros.length > 0) {
        res.render('usuarios/cadastrar', {erros: erros});
    }
    else {
        // Verifica se o email já está cadastrado na base
        Usuario.findOne({email: req.body.email})
            .then((mailUser)=>{
                if (mailUser) {
                    erros.push({texto: 'E-mail já cadastrado'});
                    res.render('usuarios/cadastrar', {erros: erros});
                }
                else {
                    // Cria o objeto com o novo usuário
                    const novoUser = new Usuario({
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha
                    });
            
                    // Gera um hash para essa senha
                    bcrypt.genSalt(10, (err, salt) =>{
                        bcrypt.hash(novoUser.senha, salt, (err, hash)=>{
                            if (err) {
                                req.flash('error_msg', "Houve um erro ao cadastrar novo usuário.");
                                res.redirect('/usuarios/cadastro');
                            }
                            else {
                                // Cadastra o novo usuário
                                novoUser.senha = hash; // Troca a senha pela hash no objeto
            
                                // Salva o usuário na base
                                novoUser.save()
                                    .then(()=>{
                                        req.flash('success_msg',"Novo usuário cadastrado!");
                                        res.redirect('/');
                                    })
                                    .catch((err)=>{
                                        req.flash('error_msg', "Houve um erro ao cadastrar novo usuário.");
                                        res.redirect('/usuarios/cadastro');
                                    });
                            }
                        });
                    });
                }
            })
    }
});

//Exporta o módulo
module.exports = router;