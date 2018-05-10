/**
* 
*  Arquivo: server.js
* Descrição:
* Author: Roberto Withowsky
* 
*/

//Configurar setup da App:

// chamada dos pacotes:
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Produto = require('./app/models/produto');

//URL: MLAB
//mongoose.connect('mongodb://root:12345@ds050869.mlab.com:50869/node-crud-api');

//mongoose.Promise = global.Promise;

//conexão local
mongoose.connect('mongodb://localhost:27017/node-crud-api');

//configuração da variavel app para usar o bodyparser()
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//definindo a porta one sera executada a nossa api:
var port = process.env.port || 8000;

//Rotas da Nossa API: ------------------------------------------------------------

//criando uma instancia das rotas via express:
var router = express.Router();

router.use(function(req, res, next){
    console.log("Algo está acontecendo aqui....");
    next();
});

//rota de exemplo:
router.get('/', function(req, res){
    res.json({ message: 'Beleza! Bem vindo a nossa Loja XYZ'})
});

//API's ---------------------------------------------------------------------------

//rotas que terminarem com /produtos (servir: get all & post)
router.route('/produtos')

    //adiciona um novo produto
    .post(function(req, res){
        var produto = new Produto();

        //setar os campos do produto(via request)
        produto.nome = req.body.nome;
        produto.preco = req.body.preco;
        produto.descricao = req.body.descricao;

        produto.save(function(error){
            if(error){
                res.send('Erro ao tentar salvar o produto...' + error);
            }

            res.json({ message: 'produto cadastrado com sucesso!'})
        });
    })

    //lista todos os produtos
    .get(function(req,res){
        Produto.find(function(error, produtos){
            if(error){
                res.send('Erro ao tentar solicitar todos os produtos... ' + error);
            }

            res.json(produtos);
        })
    });

    //Rotas qe irao terminar em /produtos/:produtos_id(servir tanto para: GET, PUT & DELET : id)
    router.route('/produtos/:produto_id')
    
    //metodo selecionar por ID(acesar em: GET)
    .get(function(req,res){
        Produto.findById(req.params.produto.id, function(error, produto){
            if(error){
                res.send('id do produto nao encontrado....' + error);
            }

            res.json(produto);
        });
    })

    //metoro atualiza por id
    .put(function(req,res){

        Produto.findById(req.params.produto_id, function(error, produto){
            if(error){
                res.send('Id do produto não encontrado...' + error);
            }

            //pega os atributos
            produto.nome = req.body.nome;
            produto.preco = req.body.preco;
            produto.descricao = req.body.descricao;

            produto.save(function(error){
                if(error){
                    res.send('Erro ao atualizar o produto...' + error);
                }

                res.json({message: 'Produto atualizado com sucesso.'})
            })

        })
    })

    //metodo excluir por id
    .delete(function(req, res){
        Produto.remove({
            _id: req.params.produto_id
        }, function(error){
            if(error){
                res.send('id do procuto não encontrado...' + error)
            }

            res.json({message: 'produto excluido com sucesso!'})
        })
    })

    

//definindo um padrão das rotas prefixadas: '/api'
app.use('/api', router);

//iniciando a plaicação(servidor)
app.listen(port);
console.log("iniciando a app na porta" + port)