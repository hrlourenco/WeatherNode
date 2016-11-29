var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var where = require('where');
var Forecast = require('forecast');
var GooglePlaces = require('node-googleplaces');
var multer = require('multer');


/* GET home page. */
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Express' });
});

/* GET login. */
router.get('/users/:stringHash/', function(req, res, next) {
  User.findOne({'passwordHash': req.params.stringHash}, function (err, user) {
    if (err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
    if (!user) return res.status(404).json({"httpCodeResponse": 404, "internalErrorCode": 101, "Message": "Utilizador não encontrado"});
    if (!user.enable) return res.status(403).json({"httpCodeResponse": 404, "internalErrorCode": 102, "Message": "Acesso negado"});
    return res.status(200).json(user);
  })
});

/* POST new user . */
router.post('/users/', function(req, res, next) {
  User.findOne({"username":req.body.username}, function(err, user){
    if(err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
    if(user) return res.status(400).json({"httpCodeResponse": 400, "internalErrorCode": 103, "Message": "Utilizador já existente"});
    if(!(req.body.username == '' && req.body.username == undefined)){
      var aux = new User(req.body);
      aux.save(function(err, user){
        if (!err){
          return res.status(200).json(user);
        }else{
          return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
        }
      });
    }else{
      return res.status(400).json({"httpCodeResponse": 400, "internalErrorCode": 104, "Message": "Dados inválidos"});
    };
  })
});

/* PUT update user . */
router.put('/users/', function(req, res, next) {
  User.findOneAndUpdate({"_id":req.body._id}, {"username": req.body.username, "passwordHash": req.body.passwordHash}, function(err, user){
    if (err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
    return res.status(200).send('Actualizado com sucesso');
  })
});

/* DELETE delete user . */
router.delete('/users/', function(req, res, next) {
  User.findOneAndUpdate({"_id":req.body._id}, {
    "enable":false
  }, function(err, user){
    if (err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
    return res.status(200).send('Actualizado com sucesso');
  })
});

/* GET all praias. */
router.get('/praias/', function(req, res, next) {
  Praia.find({"enable": "true"}, function (err, praias) {
    if (err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
    return res.status(200).json(praias);
  })
});

/* POST new praia . */
router.post('/praias/', function(req, res, next) {
  var userFound = false;
  if(req.body.userId){
    User.findOne({"_id":req.body.userId}, function(err, user){
      if(user){
        userFound = true;
        User.findOneAndUpdate({"_id":req.body.userId}, {"credito":user.credito-1}, function(err, user){
          if (err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
        })
      }
    })
  }
  Praia.findOne({"praia":req.body.praia, "enable":"true"}, function(err, praia){
    var praiaLocation = new where.Point(req.body.coordenadas.lat, req.body.coordenadas.long);
    Praia.find({"enable":"true"}, function(err, praias){
      var proximas = [];
      if(err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
      if (praia){
        for (var i in praias) {
          var local = new where.Point(praias[i].coordenadas.lat, praias[i].coordenadas.long)
          if (praiaLocation.distanceTo(local)<5 && !praia._id.equals(praias[i]._id)){
            if(!req.body.userId){
              praias[i].rating=[];
            }
            proximas.push(praias[i]);
          }
        }
        var hora = 60*60*1000;
        var currDt = new Date();
        var tempDt = new Date(praia.dataTempo.toISOString());

        var diffHoras = (currDt-tempDt)/hora;

        if (diffHoras>4){
          forecast.get([req.body.coordenadas.lat, req.body.coordenadas.long], function(err, weather) {
            if(err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});

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
              if (err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
              if(!userFound){
                resPraia.rating=[];
              }
              return res.status(200).json({"praia":resPraia, "proximas": proximas});
            });
          });
        }else{
          if(!userFound){
            praia.rating=[];
          }
          return res.status(200).json({"praia":praia, "proximas": proximas});
        }
      }else{
          const places = new GooglePlaces("AIzaSyBITKEHhyk2e-LG-XA59DfpxxFqoDmzqm4");
          const params = {
            location: req.body.coordenadas.lat + "," + req.body.coordenadas.long,
            radius: 1000
          };
        places.nearbySearch(params, function(err, response) {
          if (!err && response) {
            forecast.get([req.body.coordenadas.lat, req.body.coordenadas.long], function(err, weather) {
              if(err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
              var img="";
              for(var i=0; response.body.results.length; i++){
                console.log(i);
                if(response.body.results[i].hasOwnProperty("photos")){
                  img = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + response.body.results[i].photos[0].photo_reference + "&key=AIzaSyBITKEHhyk2e-LG-XA59DfpxxFqoDmzqm4";
                  break;
                }
              }
              var newPraia = new Praia({
                "praia":req.body.praia,
                "imagem":img,
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
              for (var i in praias) {
                var local = new where.Point(praias[i].coordenadas.lat, praias[i].coordenadas.long)
                if (praiaLocation.distanceTo(local)<5 && !newPraia._id.equals(praias[i]._id)){
                  if(!req.body.userId){
                    praias[i].rating=[];
                  }
                  proximas.push(praias[i]);
                }
              }
              newPraia.save(function(err, praia){
                if (err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
                return res.status(200).json({"praia":praia, "proximas": proximas});
              });
            });
          }
        });
      }
    })
  })
});

router.post('/rate/', function(req, res, next){
  var auxPraia = {};
  var auxUser = {};
  User.findOne({"_id":req.body.userId, "enable":"true"}, function (err, user){
    if (err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
    if (!user) return res.status(400).json({"httpCodeResponse": 404, "internalErrorCode": 101, "Message": "Utilizador não encontrado"});

    var hora = 60*60*1000;
    var currDt = new Date();
    var tempDt = new Date(user.ultimoRate.toISOString());

    var diffHoras = (currDt-tempDt)/hora;

    if (diffHoras>4){
      auxUser = user;
      Praia.findOne({"_id":req.body.praiaId, "enable":"true"}, function (err, praia){
        auxPraia = praia;
        var bonus = 3;

        if(req.body.img){

          var storage = multer.diskStorage({
            destination: function (req, file, callback) {
              callback(null, './uploads');
            },
            filename: function (req, file, callback) {
              callback(null, file.fieldname + '-' + Date.now());
            }
          });
          var upload = multer({ storage : storage}).single('img');

          upload(req,res,function(err) {
            if(err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
            res.end("File is uploaded");
          });
          bonus = 5;
        }
        var userPraiaFound = false;
        if(praia.rating.ratingGeral){
          if(user.praias.length > 0){
            for(var i=0; i<user.praias.length; i++){
              if(user.praias[i].praia == praia.praia){

                auxPraia.rating.ratingGeral = praia.rating.ratingGeral - user.praias[i].ratingGeral + req.body.ratingGeral;
                auxPraia.rating.ratingCriancas = praia.rating.ratingCriancas - user.praias[i].ratingCriancas + req.body.ratingCriancas;
                auxPraia.rating.ratingEquipamento = praia.rating.ratingEquipamento - user.praias[i].ratingEquipamento + req.body.ratingEquipamento;
                auxPraia.rating.ratingSeguranca = praia.rating.ratingSeguranca - user.praias[i].ratingSeguranca + req.body.ratingSeguranca;

                auxUser.praias[i].ratingGeral = req.body.ratingGeral;
                auxUser.praias[i].ratingCriancas = req.body.ratingCriancas;
                auxUser.praias[i].ratingEquipamento = req.body.ratingEquipamento;
                auxUser.praias[i].ratingSeguranca = req.body.ratingSeguranca;

                userPraiaFound = true;
                break;
              }
            }
            if(!userPraiaFound){
              auxPraia.rating.ratingGeral = praia.rating.ratingGeral + req.body.ratingGeral;
              auxPraia.rating.ratingGeralNum = auxPraia.rating.ratingGeralNum + 1;
              auxPraia.rating.ratingCriancas = praia.rating.ratingCriancas + req.body.ratingCriancas;
              auxPraia.rating.ratingCriancasNum = auxPraia.rating.ratingCriancasNum + 1;
              auxPraia.rating.ratingEquipamento = praia.rating.ratingEquipamento + req.body.ratingEquipamento;
              auxPraia.rating.ratingEquipamentoNum = auxPraia.rating.ratingEquipamentoNum + 1;
              auxPraia.rating.ratingSeguranca = praia.rating.ratingSeguranca + req.body.ratingSeguranca;
              auxPraia.rating.ratingSegurancaNum = auxPraia.rating.ratingSegurancaNum + 1;

              auxUser.praias.push({"praia":praia.praia, "coordenadas":{"lat":praia.coordenadas.lat, "long":praia.coordenadas.long}, "ratingGeral":req.body.ratingGeral, "ratingCriancas":req.body.ratingCriancas, "ratingEquipamento":req.body.ratingEquipamento, "ratingSeguranca":req.body.ratingSeguranca});
            }
          }else{
            auxPraia.rating.ratingGeral = praia.rating.ratingGeral + req.body.ratingGeral;
            auxPraia.rating.ratingGeralNum = auxPraia.rating.ratingGeralNum + 1;
            auxPraia.rating.ratingCriancas = praia.rating.ratingCriancas + req.body.ratingCriancas;
            auxPraia.rating.ratingCriancasNum = auxPraia.rating.ratingCriancasNum + 1;
            auxPraia.rating.ratingEquipamento = praia.rating.ratingEquipamento + req.body.ratingEquipamento;
            auxPraia.rating.ratingEquipamentoNum = auxPraia.rating.ratingEquipamentoNum + 1;
            auxPraia.rating.ratingSeguranca = praia.rating.ratingSeguranca + req.body.ratingSeguranca;
            auxPraia.rating.ratingSegurancaNum = auxPraia.rating.ratingSegurancaNum + 1;

            auxUser.praias.push({"praia":praia.praia, "coordenadas":{"lat":praia.coordenadas.lat, "long":praia.coordenadas.long}, "ratingGeral":req.body.ratingGeral, "ratingCriancas":req.body.ratingCriancas, "ratingEquipamento":req.body.ratingEquipamento, "ratingSeguranca":req.body.ratingSeguranca});
          }
        }else{
          if(user.praias.length > 0){
            for(var i=0; i<user.praias.length; i++){
              if(user.praias[i].praia == praia.praia){
                auxPraia.rating = {"ratingGeral":req.body.ratingGeral, "ratingGeralNum":1,
                                  "ratingCriancas":req.body.ratingCriancas, "ratingCriancas":1,
                                  "ratingEquipamento":req.body.ratingEquipamento, "ratingEquipamento":1,
                                  "ratingSeguranca":req.body.ratingSeguranca, "ratingSeguranca":1};

                auxUser.praias[i].ratingGeral = req.body.ratingGeral;
                auxUser.praias[i].ratingCriancas = req.body.ratingCriancas;
                auxUser.praias[i].ratingEquipamento = req.body.ratingEquipamento;
                auxUser.praias[i].ratingSeguranca = req.body.ratingSeguranca;

                userPraiaFound = true;
                break;
              }
            }
            if(!userPraiaFound){
              auxPraia.rating = {"ratingGeral":req.body.ratingGeral, "ratingGeralNum":1,
                                  "ratingCriancas":req.body.ratingCriancas, "ratingCriancasNum":1,
                                  "ratingEquipamento":req.body.ratingEquipamento, "ratingEquipamentoNum":1,
                                  "ratingSeguranca":req.body.ratingSeguranca, "ratingSegurancaNum":1};

              auxUser.praias.push({"praia":praia.praia, "coordenadas":{"lat":praia.coordenadas.lat, "long":praia.coordenadas.long}, "ratingGeral":req.body.ratingGeral, "ratingCriancas":req.body.ratingCriancas, "ratingEquipamento":req.body.ratingEquipamento, "ratingSeguranca":req.body.ratingSeguranca});
            }
          }else{
            auxPraia.rating = {"ratingGeral":req.body.ratingGeral, "ratingGeralNum":1,
                                  "ratingCriancas":req.body.ratingCriancas, "ratingCriancasNum":1,
                                  "ratingEquipamento":req.body.ratingEquipamento, "ratingEquipamentoNum":1,
                                  "ratingSeguranca":req.body.ratingSeguranca, "ratingSegurancaNum":1};

            auxUser.praias.push({"praia":praia.praia, "coordenadas":{"lat":praia.coordenadas.lat, "long":praia.coordenadas.long}, "ratingGeral":req.body.ratingGeral, "ratingCriancas":req.body.ratingCriancas, "ratingEquipamento":req.body.ratingEquipamento, "ratingSeguranca":req.body.ratingSeguranca});
          }
        }
        auxUser.credito = auxUser.credito + bonus;
        auxUser.ultimoRate = new Date();
        User.findOneAndUpdate({"_id":auxUser._id}, auxUser, function(err, userUpdated){
          if(err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
          Praia.findOneAndUpdate({"_id":auxPraia._id}, auxPraia, function(er, praiaUpdated){
            if(err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
              res.json({auxUser, auxPraia});
          })
        })
      })
    } else {
      return res.status(203).json({"httpCodeResponse": 203, "internalErrorCode": 150, "Message": "Negado o acesso"});
    }
  })
});

router.post('/praias/fav/', function(req, res, next){
  User.findOne({"_id":req.body.userId}, function (err, user){
    if(err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
    for(var i=0; i<user.praias.length; i++){
      if(user.praias[i]._id == req.body.praiaUserId){
        user.praias[i].favorita = req.body.favorita;
      }
    }
    User.findOneAndUpdate({"_id":req.body.userId}, user, function(err, userUpdated){
       if(err) return res.status(500).json({"httpCodeResponse": 500, "internalErrorCode": 100, "Message": "Erro de acesso"});
       res.json(user);
    })
  })
});

router.post('/file_upload/', function (req, res) {
  //Set the directory names
  var photoDir = __dirname + "/../public/images/";
  var photoName = req.files.source.name;

  fs.rename(
    req.files.source.path,
    photoDir+photoName,
    function(err){
      if(err != null){
        res.send({error:"Server Writting No Good"});
      };
    }
  );
});

var userSchema = mongoose.Schema({
  enable: { type: Boolean, default: true },
  username: String,
  passwordHash: String,
  praias: [{
    praia: String,
    coordenadas: {
      lat: Number,
      long: Number
    },
    ratingGeral: Number,
    ratingCriancas: Number,
    ratingSeguranca: Number,
    ratingEquipamento: Number,
    favorita: { type: Boolean, default: false }
  }],
  ultimoRate: { type: Date, default: new Date("2000-01-01T00:00:00.000Z") },
  credito: { type: Number, default: 10 }
});

var praiaSchema = mongoose.Schema({
  enable: { type: Boolean, default: true },
  praia: String,
  imagem: String,
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
  rating: {
    ratingGeral: Number,
    ratingGeralNum: Number,
    ratingCriancas: Number,
    ratingCriancasNum: Number,
    ratingSeguranca: Number,
    ratingSegurancaNum: Number,
    ratingEquipamento: Number,
    ratingEquipamentoNum: Number
  }
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
