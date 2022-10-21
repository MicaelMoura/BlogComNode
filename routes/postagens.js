require('../models/Postagem');
require('../models/Categoria');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Postagem = mongoose.model('Postagens');
const Categoria = mongoose.model('Categorias');

// Caso a rota "/postagens" seja acessada redireciona para a página inicial
router.get('/', (req, res)=>{
    res.redirect("../");
});

// Rota de postagens (individuais)
router.get('/post=:slug', (req, res)=>{
    Postagem.findOne({slug: req.params.slug}).lean()
        .populate('categoria')
        .then((post)=>{
            if (post) {
                res.render("postagens/index", {post: post});
            }
            else {
                req.flash('error_msg','Postagem não encontrada');
                res.redirect("../");
            }
        })
        .catch((err)=>{
            req.flash('error_msg','Erro ao procurar a postagem selecionada');
            res.redirect("../");
        });
});

// Lista categorias
router.get('/categorias', (req, res)=>{
    Categoria.find().lean()
        .then((categorias)=>{
            res.render('postagens/categorias', {categorias: categorias});
        })
        .catch((err)=>{
            req.flash('error_msg', 'Erro ao carregar as categorias');
            res.redirect('../');
        })
});


// Exibe posts por categoria
router.get('/categorias/:slug', (req, res)=>{
    Categoria.findOne({slug: req.params.slug})
        .then((categoria)=>{
            Postagem.find({categoria: categoria}).lean()
                .then((postagens)=>{
                    res.render('postagens/postsCategoria',{postagens: postagens});
                })
                .catch((err)=>{
                    req.flash('error_msg','Erro ao localizar posts da categoria selecionada.');
                    res.redirect('../');
                });
        })
        .catch((err)=>{
            req.flash('error_msg','Categoria não encontrada.');
            res.redirect('../');
        });
});

//Exporta o módulo
module.exports = router;