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
  User.findOneAndUpdate({"_id":req.body._id}, req.body, function(err, user){
    if (err) return res.status(400).send('Erro ao actualizar registo');
    res.status(200).send('Actualizado com sucesso');
  })
});

/* DELETE delete user . */
router.delete('/users/', function(req, res, next) {
  User.findOneAndUpdate({"_id":req.body._id}, {
    "enable":false
  }, function(err, user){
    if (err) return res.status(400).send('Erro ao actualizar registo');
    res.status(200).send('Actualizado com sucesso');
  })
});

/* GET all praias. */
router.get('/praias/', function(req, res, next) {
  Praia.find({"enable": "true"}, function (err, ratings) {
    if (err) return res.status(400).send('Erro de acesso');
    res.status(200).json(ratings);
  })
});

/* POST new praia . */
router.post('/praias/', function(req, res, next) {
  
});

/* PUT update praia . */
router.put('/praias/', function(req, res, next) {
  if(!(req.body._id == '' && req.body._id == undefined)){
    Praia.findOneAndUpdate({"_id":req.body._id}, req.body, function(err, rating){
      if (err) return res.status(400).send('Erro ao actualizar registo');
      res.status(200).send('Actualizado com sucesso');
    })
  }else{
    res.status(400).send('Erro ao actualizar registo');
  };
});

/* DELETE delete rating. */
router.delete('/praias/', function(req, res, next) {
  Praia.findOneAndUpdate({"_id":req.body._id}, {
    "enable":false
  }, function(err, rating){
    if (err) return res.status(400).send('Erro ao actualizar registo');
    res.status(200).send('Actualizado com sucesso');
  })
});


// router.post('/rate/', function(req, res, next){
//   var cidade = req.body.cidade;
//   var localidade = req.body.localidade;
//   User.findOne({"_id" : req.body.userId, "enable":"true"}, function (err, user){
//     if (err) return res.status(400).send("Utilizador não encontrado");
//     for (var i=0; i<user.ratingsPraias.length; i++){
//       if(user.ratingsPraias[i].cidade == req.body.cidade){
//         return res.json(user.ratingsPraias[i]).status(200);
//       }
//     }
//     res.json(user).status(200);
//   })
// });


var userSchema = mongoose.Schema({
    enable: { type: Boolean, default: true },
    username: String,
    passwordHash: String,
    praias: [{
      praia: String,
      coordenadas: {
        Lat: Number,
        Long: Number
      },
      ratingGeral: Number,
      ratingCriancas: Number,
      ratingSeguranca: Number,
      ratingEquipamento: Number,
      favorita: Boolean
    }],
    credito: Number
});

var praiaSchema = mongoose.Schema({
  enable: { type: Boolean, default: true },
  praia: String,
  coordenadas: {
    Lat: Number,
    Long: Number
  },
  tempo: [{
    tempMin: Number,
    tempMax: Number,
    vento: Number,
    humidade: Number,
    pressao: Number,
    mensagem: String,
    icon: Number
  }],
  dataTempo: Date,
  rating: [{
    classificacao: Number,
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
var Praia = mongoose.model('praia', praiaSchema);

module.exports = router;
