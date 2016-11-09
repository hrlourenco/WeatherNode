var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var mongoose = require('mongoose');
var where = require('where');
var Forecast = require('forecast');
var panorama = require('google-panorama-by-location')

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Express' });
});

/* GET login. */
router.get('/users/:stringHash/', function(req, res, next) {
  User.findOne({'passwordHash': req.params.stringHash}, function (err, user) {
    if (err) return res.status(403).send('Acesso negado');
    if (!user.enable) return res.status(403).send('Acesso negado'); 
    return res.status(200).json(user);
  })
});

/* POST new user . */
router.post('/users/', function(req, res, next) {
  if(!(req.body.username == '' && req.body.username == undefined)){
    var aux = new User(req.body);
    aux.save(function(err, user){
      if (!err){
        return res.status(200).json(user);
      }else{
        return res.status(400).send('Erro ao inserir registo');
      }
    });
  }else{
    return res.status(400).send('Erro ao inserir registo');
  };
});

/* PUT update user . */
router.put('/users/', function(req, res, next) {
  User.findOneAndUpdate({"_id":req.body._id}, {"username": req.body.username, "passwordHash": req.body.passwordHash}, function(err, user){
    if (err) return res.status(400).send('Erro ao actualizar registo');
    return res.status(200).send('Actualizado com sucesso');
  })
});

/* DELETE delete user . */
router.delete('/users/', function(req, res, next) {
  User.findOneAndUpdate({"_id":req.body._id}, {
    "enable":false
  }, function(err, user){
    if (err) return res.status(400).send('Erro ao actualizar registo');
    return res.status(200).send('Actualizado com sucesso');
  })
});

/* GET all praias. */
router.get('/praias/', function(req, res, next) {
  Praia.find({"enable": "true"}, function (err, praias) {
    if (err) return res.status(400).send('Erro de acesso');
    return res.status(200).json(praias);
  })
});

/* POST new praia . */
router.post('/praias/', function(req, res, next) {
  Praia.findOne({"praia":req.body.praia, "enable":"true"}, function(err, praia){
    var praiaLocation = new where.Point(req.body.coordenadas.lat, req.body.coordenadas.long);
    Praia.find({"enable":"true"}, function(err, praias){
      if(err) return res.status(400).send('Erro ao carregar praia');
      if (praia){
        var proximas = [];
        for (var i in praias) {
          var local = new where.Point(praias[i].coordenadas.lat, praias[i].coordenadas.long)
          if (praiaLocation.distanceTo(local)<5 && !praia._id.equals(praias[i]._id)){
            proximas.push(praias[i]);
          }
        }
        var hora = 10000; //60*60*1000;
        var currDt = new Date();
        var tempDt = new Date(praia.dataTempo.toISOString());
        
        var diffHoras = (currDt-tempDt)/hora;
        
        if (diffHoras>4){
          forecast.get([req.body.coordenadas.lat, req.body.coordenadas.long], function(err, weather) {
            if(err) return res.status(400).send('Erro ao carregar forecast');

            praia.dataTempo = Date.now();
            praia.tempo = [{
                "tempMin":weather.currently.temperature,
                "tempMax":weather.currently.temperature,
                "vento":weather.currently.windSpeed,
                "humidade":weather.currently.humidity,
                "pressao":weather.currently.pressure,
                "mensagem":weather.currently.summary,
                "icon":weather.currently.icon},                   //Tempo actual
                {
                "tempMin":weather.daily.data[0].temperatureMin,
                "tempMax":weather.daily.data[0].temperatureMax,
                "vento":weather.daily.data[0].windSpeed,
                "humidade":weather.daily.data[0].cumidity,
                "pressao":weather.daily.data[0].pressure,
                "mensagem":weather.daily.data[0].summary,
                "icon":weather.daily.data[0].icon},                   //Previsão +1 dia
                {
                "tempMin":weather.daily.data[1].temperatureMin,
                "tempMax":weather.daily.data[1].temperatureMax,
                "vento":weather.daily.data[1].windSpeed,
                "humidade":weather.daily.data[1].humidity,
                "pressao":weather.daily.data[1].pressure,
                "mensagem":weather.daily.data[1].summary,
                "icon":weather.daily.data[1].icon},                   //Previsão +2 dia
                {
                "tempMin":weather.daily.data[2].temperatureMin,
                "tempMax":weather.daily.data[2].temperatureMax,
                "vento":weather.daily.data[2].windSpeed,
                "humidade":weather.daily.data[2].humidity,
                "pressao":weather.daily.data[2].pressure,
                "mensagem":weather.daily.data[2].summary,
                "icon":weather.daily.data[2].icon},                   //Previsão +3 dia
                {
                "tempMin":weather.daily.data[3].temperatureMin,
                "tempMax":weather.daily.data[3].temperatureMax,
                "vento":weather.daily.data[3].windSpeed,
                "humidade":weather.daily.data[3].humidity,
                "pressao":weather.daily.data[3].pressure,
                "mensagem":weather.daily.data[3].summary,
                "icon":weather.daily.data[3].icon},                   //Previsão +4 dia
                {
                "tempMin":weather.daily.data[4].temperatureMin,
                "tempMax":weather.daily.data[4].temperatureMax,
                "vento":weather.daily.data[4].windSpeed,
                "humidade":weather.daily.data[4].humidity,
                "pressao":weather.daily.data[4].pressure,
                "mensagem":weather.daily.data[4].summary,
                "icon":weather.daily.data[4].icon}];                   //Previsão +5 dia

            Praia.findOneAndUpdate({"_id":praia._id}, praia, function(err, resPraia){
              if (err) return res.status(400).send('Erro ao actualizar registo');
              return res.status(200).json({"praia":resPraia, "proximas": proximas});
            });
          });
        }else{
          return res.status(200).json({"praia":praia, "proximas": proximas});
        }
      }else{
        forecast.get([req.body.coordenadas.lat, req.body.coordenadas.long], function(err, weather) {
          if(err) return res.status(400).send('Erro ao carregar forecast');
          var newPraia = new Praia({
            "praia":req.body.praia,
            "coordenadas":{
              "lat":req.body.coordenadas.lat,
              "long":req.body.coordenadas.long
            },
            "tempo":[{
              "tempMin":weather.currently.temperature,
              "tempMax":weather.currently.temperature,
              "vento":weather.currently.windSpeed,
              "humidade":weather.currently.humidity,
              "pressao":weather.currently.pressure,
              "mensagem":weather.currently.summary,
              "icon":weather.currently.icon},                   //Tempo actual
              {
              "tempMin":weather.daily.data[0].temperatureMin,
              "tempMax":weather.daily.data[0].temperatureMax,
              "vento":weather.daily.data[0].windSpeed,
              "humidade":weather.daily.data[0].cumidity,
              "pressao":weather.daily.data[0].pressure,
              "mensagem":weather.daily.data[0].summary,
              "icon":weather.daily.data[0].icon},                   //Previsão +1 dia
              {
              "tempMin":weather.daily.data[1].temperatureMin,
              "tempMax":weather.daily.data[1].temperatureMax,
              "vento":weather.daily.data[1].windSpeed,
              "humidade":weather.daily.data[1].humidity,
              "pressao":weather.daily.data[1].pressure,
              "mensagem":weather.daily.data[1].summary,
              "icon":weather.daily.data[1].icon},                   //Previsão +2 dia
              {
              "tempMin":weather.daily.data[2].temperatureMin,
              "tempMax":weather.daily.data[2].temperatureMax,
              "vento":weather.daily.data[2].windSpeed,
              "humidade":weather.daily.data[2].humidity,
              "pressao":weather.daily.data[2].pressure,
              "mensagem":weather.daily.data[2].summary,
              "icon":weather.daily.data[2].icon},                   //Previsão +3 dia
              {
              "tempMin":weather.daily.data[3].temperatureMin,
              "tempMax":weather.daily.data[3].temperatureMax,
              "vento":weather.daily.data[3].windSpeed,
              "humidade":weather.daily.data[3].humidity,
              "pressao":weather.daily.data[3].pressure,
              "mensagem":weather.daily.data[3].summary,
              "icon":weather.daily.data[3].icon},                   //Previsão +4 dia
              {
              "tempMin":weather.daily.data[4].temperatureMin,
              "tempMax":weather.daily.data[4].temperatureMax,
              "vento":weather.daily.data[4].windSpeed,
              "humidade":weather.daily.data[4].humidity,
              "pressao":weather.daily.data[4].pressure,
              "mensagem":weather.daily.data[4].summary,
              "icon":weather.daily.data[4].icon}]                   //Previsão +5 dia]
          });
          newPraia.save(function(err, praia){
            if (err) return res.status(400).send('Erro ao inserir registo');
            return res.status(200).json({"praia":praia, "proximas": proximas});
          });
        });
      }
    })
  })
});









/* PUT update praia . */
router.put('/praias/', function(req, res, next) {
  if(!(req.body._id == '' && req.body._id == undefined)){
    Praia.findOneAndUpdate({"_id":req.body._id}, req.body, function(err, rating){
      if (err) return res.status(400).send('Erro ao actualizar registo');
      return res.status(200).send('Actualizado com sucesso');
    })
  }else{
    return res.status(400).send('Erro ao actualizar registo');
  };
});

/* DELETE delete rating. */
router.delete('/praias/', function(req, res, next) {
  Praia.findOneAndUpdate({"_id":req.body._id}, {
    "enable":false
  }, function(err, rating){
    if (err) return res.status(400).send('Erro ao actualizar registo');
    return res.status(200).send('Actualizado com sucesso');
  })
});



router.get('/teste/', function(req, res, next) {
  var location = [ 51.50700703827454, -0.12791916931155356 ]
  panorama(location, function (err, result) {
    if (err) throw err
    
    // pano ID 
    console.log(result.id)
  
    // actual latitude, longitude 
    console.log(result.latitude)
    console.log(result.longitude)
  
    // other details from Google API 
    console.log(result.copyright)
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
  credito: { type: Number, default: 10 }
});

var praiaSchema = mongoose.Schema({
  enable: { type: Boolean, default: true },
  praia: String,
  coordenadas: {
    lat: Number,
    long: Number
  },
  tempo: [{
    tempMin: Number,
    tempMax: Number,
    vento: Number,
    humidade: Number,
    pressao: Number,
    mensagem: String,
    icon: String
  }],
  dataTempo: { type: Date, default: Date },
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

// Initialize 
var forecast = new Forecast({
  service: 'darksky',
  key: '16ef7feb45a9ccf2fe4ec027a2fbdda8',
  units: 'celcius',
  lang: 'pt',
  cache: true,      // Cache API requests 
  ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/ 
    minutes: 27,
    seconds: 45
  }
});

module.exports = router;
