require("../models/Categoria");

const express = require('express');
const router = express.Router();  //Componente do Express para transformar esse arquivo em arquivo de rotas
const mongoose = require('mongoose');
const Categoria = mongoose.model("Categorias");

//Rotas Administrativas
    //Painel ADM
    router.get('/', (req, res)=>{
        res.render('admin/index');
    });

    //Lista categorias
    router.get('/categorias', (req, res)=>{
        res.render('admin/categorias');
    });
    
    //Form para adicionar nova categoria
    router.get('/categorias/add', (req, res)=>{
        res.render('admin/addcategoria');
    });

    //Adiciona nova categoria
    router.post('/categorias/novacategoria', (req, res)=>{
        // Faz a validação antes de cadastrar a categoria
        
        var erros = [];
        
        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: "Nome da categoria inválido!"});
        } else if (req.body.nome.length < 3){
            erros.push({texto: "O nome da categoria precisa ter no mínimo 2 caracteres."});
        };
        
        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            erros.push({texto: "Slug da categoria inválido!"});
        };

        if (erros.length > 0) {
            res.render("admin/addcategoria", {erros: erros})
        }
        else {
            //Pega o nome e slug enviados pelo usuário
            const novaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            }

            //Grava as informações no banco
            new Categoria(novaCategoria)
            .save()
            .then(()=>{
                // console.log("----------------------------------------");
                // console.log("Nova categoria cadastrada!");
                // console.log(">> nome: "+novaCategoria.nome);
                // console.log(">> slug: "+novaCategoria.slug);
                // console.log("----------------------------------------");

                req.flash('success_msg','Nova categoria cadastrada!');
                res.redirect('/admin/categorias');
            })
            .catch((err)=>{
                // console.log("Erro ao cadastrar nova categoria: "+err);

                req.flash('error_msg','Erro ao cadastrar nova categoria!');
                res.redirect('/admin');
            });
        }
    });

//Exporta o módulo
module.exports = router;