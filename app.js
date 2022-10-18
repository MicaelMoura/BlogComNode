// Carregando/Importando módulos
    const express = require('express');
    const app = express();
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const mongoose = require('mongoose');
    const path = require('path');
    const session = require('express-session');
    const flash = require('connect-flash');

    //Módulos de rotas
    const admin = require('./routes/admin');

//Configurações
    //Session
        app.use(session({
            secret: "F&6xb!Ls*#d6$*aj6WL#@@U3",
            resave: true,
            saveUnitialized: true
        }));
        //A variável 'secret' precisa ser bem forte.

        app.use(flash());

    //Middleware
        app.use((req, res, next)=>{
            //Cria variáveis globais
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");

            next();
        });

    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        
    //HandleBars
        app.engine('handlebars', handlebars.engine({defaltLayout: 'main'}));
        app.set('view engine', 'handlebars');

    //Mongoose
        mongoose.Promise = global.Promise;    

        //Conecta o Mongo
        mongoose.connect("mongodb://localhost/blogapp")
            .then(()=>{
                console.log("Conectado ao MongoDB...");                
            })
            .catch((err)=>{
                console.log("Erro ao conectar ao banco de dados: "+err);
                console.log("Confirme se o banco está rodando.");
            });

    //Public
        //Essa linha serve para informar para o Express qual é a pasta de arquivos estáticos
        app.use(express.static(path.join(__dirname,"public")));

//Rotas
    app.get('/',(req, res)=>{
        res.redirect('/admin');
    });

    //admin
    app.use("/admin", admin); //O admin é o prefixo para o grupo de rotas do arquivo admin.js

//Inicia Servidor
    //Variáveis
    const PORT = 8081;

    //Executa Listen
    app.listen(PORT , ()=>{
        console.log("Servidor rodando na url: 'http://localhost:"+PORT+"'");
    });