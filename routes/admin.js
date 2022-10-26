require("../models/Categoria");
require("../models/Postagem");

const express = require('express');
const router = express.Router();  //Componente do Express para transformar esse arquivo em arquivo de rotas
const mongoose = require('mongoose');
const Categoria = mongoose.model("Categorias");
const Postagem = mongoose.model("Postagens");

const {eAdmin} = require('../helpers/eAdmin');

//Rotas Administrativas
    //Painel ADM
    router.get('/', eAdmin, (req, res)=>{
        res.render('admin/index');
    });

    //Lista categorias
    router.get('/categorias', eAdmin, (req, res)=>{
        Categoria.find().lean()
        .sort({date: 'desc'})
        .then((categorias)=>{
            res.render('admin/categorias', {categorias: categorias});
        })
        .catch((err)=>{
            req.flash('error_msg','Erro ao listar as categorias: "'+err+'."');
            res.redirect("/admin");
        })
    });
    
    //Form para adicionar nova categoria
    router.get('/categorias/add', eAdmin, (req, res)=>{
        res.render('admin/addcategoria');
    });

    //Adiciona nova categoria
    router.post('/categorias/novacategoria', eAdmin, (req, res)=>{
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

    // Edita categoria
    router.get("/categorias/edit/:id", eAdmin, (req, res)=>{
        // Pesquiso essa categoria no banco
        Categoria.findById(req.params.id).lean()
            .then((cat)=>{
                // Mando a categoria para a página de edição
                res.render("admin/editcategoria",{categoria: cat});
            })
            .catch((err)=>{
                req.flash('error_msg','Categoria não encontrada');
                res.redirect('/admin/categorias');
            });
    });

    // Salva edição
    router.post("/categorias/edit/salvar", eAdmin, (req, res)=>{
        Categoria.findById(req.body.id)
            .then((cat)=>{
                cat.nome = req.body.nome;
                cat.slug = req.body.slug;

                cat.save()
                .then(()=>{
                    req.flash('success_msg','Categoria salva com sucesso!');
                    res.redirect('/admin/categorias');
                })
                .catch((err)=>{
                    req.flash('success_msg','Erro ao editar a categoria: '+err);
                    res.redirect('/admin/categorias');                
                });          
            });
    });

    // Remover categoria
    router.get("/categorias/remove/:id", eAdmin, (req, res)=>{
        Categoria.deleteOne({_id: req.params.id})
            .then(()=>{
                    req.flash('success_msg','Categoria removida!');
                    res.redirect('/admin/categorias');
            })
            .catch((err)=>{
                req.flash('success_msg','Erro ao apagar a categoria: '+err);
                res.redirect('/admin/categorias');                
            });
    });

    // Lista postagens
    router.get('/postagens', eAdmin, (req, res)=>{
        Postagem.find().lean()
            .sort({data: 'desc'})
            .populate('categoria')
            .then((postagens)=>{
                res.render('admin/postagens', {posts: postagens});
            })
            .catch((err)=>{
                req.flash('error_msg','Erro ao exibir as postagens!');
                res.redirect('/admin');
            });
    });

    // Form para adiciona postagem
    router.get('/postagens/add', eAdmin, (req, res)=>{
        Categoria.find().lean()            
            .then((categorias)=>{
                res.render('admin/addpostagens',{categorias: categorias});
            })
            .catch((err)=>{
                req.flash('error_msg','Erro ao carregar!');
                res.redirect('/admin/postagens');
            });
    });

    // Adiciona postagem
    router.post('/postagens/add/nova', eAdmin, (req, res)=>{
        // Valida os dados
            ///////// Por enquanto vou apenas verificar se a categoria que ele enviou tem algum valor
            if (req.body.categoria == -1){
                req.flash('error_msg','Por favor, cadastre uma categoria');
                res.redirect('/admin/postagens/add');
            }
            else {
                // Cria um novo objeto com os dados vindos do req
                const novaPostagem = {
                    titulo: req.body.titulo,
                    slug: req.body.slug,
                    descricao: req.body.descricao,
                    conteudo: req.body.conteudo,
                    categoria: req.body.categoria
                };
                
                // Salva
                new Postagem(novaPostagem)
                .save()
                    .then(()=>{
                        req.flash('success_msg','Nova postagem criada');
                        res.redirect('/admin/postagens');
                    })
                    .catch((err)=>{
                        req.flash('error_msg','Erro ao criar nova postagem');
                        res.redirect('/admin/postagens/add');
                    });
            }
    });

    // Edita postagem
    router.get("/postagens/edit/:id", eAdmin, (req, res)=>{
        // Pesquiso essa categoria no banco
        Postagem.findById(req.params.id).lean()
            .then((post)=>{
                Categoria.find().lean()
                    .then((cat)=>{
                        // Mando a categoria para a página de edição
                        res.render("admin/editpostagem",{postagem: post, categorias: cat});
                    })
                    .catch((err)=>{
                        req.flash('error_msg','Erro ao carregar as categorias');
                        res.redirect('/admin/postagens');
                    });
            })
            .catch((err)=>{
                req.flash('error_msg','Postagem não encontrada');
                res.redirect('/admin/postagens');
            });
    });

    // Salva edição de postagem
    router.post("/postagens/edit/salvar/:id", eAdmin, (req, res)=>{
        Postagem.findById(req.params.id)
            .then((post)=>{
                post.titulo = req.body.titulo;
                post.slug = req.body.slug;
                post.descricao = req.body.descricao;
                post.conteudo = req.body.conteudo;
                post.categoria = req.body.categoria;

                post.save()
                .then(()=>{
                    req.flash('success_msg','Postagem editada com sucesso!');
                    res.redirect('/admin/postagens');
                })
                .catch((err)=>{
                    req.flash('success_msg','Erro ao editar a postagem!');
                    res.redirect('/admin/categorias');
                    console.log(err);
                });          
            });
    });

    // Remover postagem
    router.get("/postagens/remove/:id", eAdmin, (req, res)=>{
        Postagem.deleteOne({_id: req.params.id})
            .then(()=>{
                    req.flash('success_msg','Postagem removida!');
                    res.redirect('/admin/postagens');
            })
            .catch((err)=>{
                req.flash('success_msg','Erro ao apagar a postagem: '+err);
                res.redirect('/admin/postagens');                
            });
    });

//Exporta o módulo
module.exports = router;