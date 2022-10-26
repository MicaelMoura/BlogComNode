// Carregando/Importando módulos
    const express = require('express');
    const app = express();
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const mongoose = require('mongoose');
    const path = require('path');
    const flash = require('connect-flash');
    require('./models/Postagem');
    const Postagem = mongoose.model('Postagens');
    const passport = require('passport');
    const session = require('express-session');
    require('./config/auth')(passport);

    //Módulos de rotas
    const admin = require('./routes/admin');
    const postagens = require('./routes/postagens');
    const usuarios = require('./routes/usuarios');

//Configurações
    //Session
        app.use(session({
            secret: "F&6xb!Ls*#d6$*aj6WL#@@U3",
            resave: true, // Se a cada requisição deve salvar a sessão
            saveUnitialized: true, // Se deve salvar sesões anônimas
            cookie: { maxAge: 30 * 60 * 1000 } // Duração do cookie valido (min * seg * mili seg) [Nesse caso, será 2 minutos]
            //store: // A sessão, por padrão, é salva na memória, para salvar no db precisa preencher isso
        }));
        //A variável 'secret' precisa ser bem forte.

        //Passport
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(flash());

    //Middleware
        app.use((req, res, next)=>{
            //Declara variáveis globais
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            // res.locals.error = req.flash("error");
            res.locals.user = req.user || null;

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
    //Index
    app.get('/',(req, res)=>{
        Postagem.find().lean()
            .populate('categoria')
            .sort({data: 'desc'})
            .then((postagens)=>{
                res.render("index",{postagens: postagens});
            })
            .catch((err)=>{
                req.flash('error_msg','Houve um erro ao carregar a página.')
                res.redirect("/404");
            });
    });

    // 404
    app.get("/404", (req, res)=>{
        res.send("Página não encontrada");
    });

//Grupo de Roas
    app.use("/admin", admin); //O admin é o prefixo para o grupo de rotas do arquivo admin.js
    app.use("/postagens", postagens);
    app.use("/usuarios", usuarios);

//Inicia Servidor
    //Variáveis
    const PORT = 8081;

    //Executa Listen
    app.listen(PORT , ()=>{
        console.log("Servidor rodando na url: 'http://localhost:"+PORT+"'");
    });