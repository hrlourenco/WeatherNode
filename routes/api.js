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
  var a1 = new Inscricao(
    {
      bi:'123',
      nome:'hugo',
      morada:'vila verde',
      nascimento:'1-1-1'
    }
  );
  a1.save(function(err, result) {
    res.send(result);
  })
//  res.render('index', { title: 'Express' });
});

module.exports = router;
