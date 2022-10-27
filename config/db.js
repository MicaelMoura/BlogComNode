if (process.env.NODE_ENV) {
    // Ambiente de produção
    module.exports = {mongoURI: "mongodb+srv://TecMhaicky_Micael:Q0j5Z2RDIjWFVTgt@tecmhaickydbs.qjnbgdp.mongodb.net/?retryWrites=true&w=majority"}
} else {
    // Ambiente de desenvolvimento
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}