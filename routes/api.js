var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login. */
router.get('/users/:stringHash/', function(req, res, next) {
  User.findOne({'passwordHash': req.params.stringHash}, function (err, user) {
    if (err) return res.status(403).send('Acesso negado');
    if (!user.enable) return res.status(403).send('Acesso negado'); 
    res.status(200).json(user);
  })
});

/* POST new user . */
router.post('/users/', function(req, res, next) {
  if(!(req.body.username == '' && req.body.username == undefined)){
    var aux = new User(req.body);
    aux.save(function(err, user){
      if (!err){
        res.status(200).json(user);
      }else{
        res.status(400).send('Erro ao inserir registo');
      }
    });
  }else{
    res.status(400).send('Erro ao inserir registo');
  };
});

/* PUT update user . */
router.put('/users/', function(req, res, next) {
  User.findOneAndUpdate({"_id":req.body._id}, {
    "username":req.body.username,
    "passwordHash":req.body.passwordHash,
    "nome":req.body.nome,
    "ratingsPraias":req.body.ratingsPraias,
    "credito":req.body.credito
  }, function(err, user){
    if (err) return res.status(400).send('Erro ao actualizar registo');
    res.status(200).send('Actualizado com sucesso');
  })
});

/* PUT delete user . */
router.delete('/users/', function(req, res, next) {
  User.findOneAndUpdate({"_id":req.body._id}, {
    "enable":false
  }, function(err, user){
    if (err) return res.status(400).send('Erro ao actualizar registo');
    res.status(200).send('Actualizado com sucesso');
  })
});

var userSchema = mongoose.Schema({
    enable: { type: Boolean, default: true },
    username: String,
    passwordHash: String,
    nome: String,
    ratingsPraias: [{
      cidade: String,
      localidade: String,
      praia: String,
      ratingGeral: Number,
      ratingCriancas: Number,
      ratingSeguranca: Number,
      ratingEquipamento: Number
    }],
    credito: Number,
    timeStamp: { type: Date, default: Date.now }
});

var ratingsSchema = mongoose.Schema({
  cidade: String,
  localidade: String,
  tempo: [{
    data: { type: Date, default: Date.now },
    classificação: Number,
    ratingGeral: Number,
    ratingGeralNum: Number,
    ratingCriancas: Number,
    ratingCriancasNum: Number,
    ratingSeguranca: Number,
    ratingSegurancaNum: Number,
    ratingEquipamento: Number,
    ratingEquipamentoNum: Number
  }]
});

var User = mongoose.model('user', userSchema);
var Ratings = mongoose.model('ratings', ratingsSchema);

module.exports = router;
