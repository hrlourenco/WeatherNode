var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Schema = mongoose.Schema;

var InscSchema = new Schema({
  bi: String,
  nome: String, 
  morada: String,
  nascimento: String
});

var Inscricao = mongoose.model('inscricao', InscSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
