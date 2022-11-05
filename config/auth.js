const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var i = 0;

// Model de Usuário
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');

module.exports = (passport)=>{
    // Configurações
    // Serialize serve para salvar um cookie no front-end e uma sessão no back-end com os dados do usuário
    //Nessa função definimos as regras para salvar e o que vamos salvar
    passport.serializeUser((user, done)=>{
      done(null, user._id); // O done é uma função de callback. O null é o erro (que nesse caso não teve). É bom salvar apenas o id do user
    });
    
    //O Deserialize serve para pegar o cookie e transformar em objeto para veificar se ele é válido ou não
    passport.deserializeUser((id, done)=>{
      try {
        Usuario.findById({_id: id})
          .then((user)=>{
            done(null, user);
          })
          .catch((err)=>{
            console.log(err);
            done(err, null);
          })
      }
      catch(err){
        console.log(err);
        done(err, null);
      }
    });
    
    passport.use(
      //O construtor LocalStrategy espera um objeto e uma função
      new LocalStrategy(
        {
          // No objeto informamos para o passport quais são os campos que virão do login para fazer a autenticação
          usernameField: "email",
          passwordField: "senha"
        },
        (email, senha, done)=>{
          // Na função ele espera um user, password e callback como parâmetros
          // Aqui dentro faremos a autenticação
          try {
            // Procura o usuário pelo nome
            Usuario.findOne({email: email})
              .then((user)=>{
                if (user) {
                  // Usuário encontrado
                  // Compara as senhas
                  bcrypt.compare(senha, user.senha)
                    .then((isValid)=>{
                      if (isValid) {

                        // Senha correta
                        return done(null, user);
                      }
                      else {
                        //Senha errada
                        return done(null, false);
                      }
                    })
                    .catch((err)=>{
                      // Erro ao comparar as senhas
                      console.log(err);
                      return done(err, false);
                    })

                }
                else {
                  // Usuário não encontrado
                  return done(null, false);
                }
                
              })
              .catch((err)=>{
                // Erro ao pesquisar o usuário
                console.log(err);
                return done(err, false);
              });
          } catch (err) {
            console.log(err);
            return done(err, false); //Nesse callback ele espera o erro no 1º parâmetro e se autenticou ou não no 2º
          }
        })
    );
}
