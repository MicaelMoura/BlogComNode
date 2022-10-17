// Carregando/Importando módulos
    const express = require('express');
    const app = express();
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    // const mongoose = require('mongoose');
    const path = require('path');

    //Módulos de rotas
    const admin = require('./routes/admin');
    
//Configurações
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        
    //HandleBars
        app.engine('handlebars', handlebars.engine({defaltLayout: 'main'}));
        app.set('view engine', 'handlebars');

    //Mongoose
        // ...

    //Public
        //Essa linha serve para informar para o Express qual é a pasta de arquivos estáticos
        app.use(express.static(path.join(__dirname,"public")));

//Rotas
    app.use("/admin", admin); //O admin é o prefixo para o grupo de rotas do arquivo admin.js


//Inicia Servidor
    //Variáveis
    const PORT = 8081;

    //Executa Listen
    app.listen(PORT , ()=>{
        console.log("Servidor rodando na url: 'http://localhost/"+PORT+"'");
    });