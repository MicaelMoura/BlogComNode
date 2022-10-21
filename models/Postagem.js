const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Postagem = new schema({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    },
    categoria: {
        type: schema.Types.ObjectId,
        ref: "Categorias",
        required: true
    }
});

mongoose.model("Postagens", Postagem);