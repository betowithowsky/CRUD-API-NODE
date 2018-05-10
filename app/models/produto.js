var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProdutoSchema = new Schema({
    nome: String,
    preco: String,
    descricao: String    
});

module.exports = mongoose.model('Produto', ProdutoSchema);