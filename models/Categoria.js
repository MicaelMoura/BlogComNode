const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Categoria = schema({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("Categorias", Categoria);