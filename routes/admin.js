const express = require('express');
const router = express.Router();  //Componente do Express para transformar esse arquivo em arquivo de rotas

//Rotas Administrativas
    //Painel ADM
    router.get('/', (req, res)=>{
        res.render('admin/index');
    });

    //Posts
    router.get('/posts', (req, res)=>{
        res.send("Página de posts");
    });

    //Categorias
    router.get('/categorias', (req, res)=>{
        res.send("Página de categorias");
    });

//Exporta o módulo
module.exports = router;