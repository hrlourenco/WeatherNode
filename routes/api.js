var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/users/:ValHash', function(req, res, next) {
  res.status(200).send('Inscrição com sucesso');
});

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    nome: String,
    ratingsPraias: {
      cidade: String,
      localidade: String,
      praia: String,
      ratingGeral: Number,
      ratingCrianças: Number,
      ratingSeguranca: Number,
      ratingEquipamento: Number
    },
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
    ratingSegurançaNum: Number,
    ratingEquipamento: Number,
    ratingEquipamentoNum: Number
  }]
});

var user = mongoose.model('user', userSchema);
var ratings = mongoose.model('ratings', ratingsSchema);

module.exports = router;
