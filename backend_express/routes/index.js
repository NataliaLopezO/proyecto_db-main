var express = require('express');

var router = express.Router();

const connect = require('./db_pool_connect');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("inicio",{});
});


router.get('/iniciarSesion', function(req, res, next) {
  res.render("escogerInicio",{});
});

router.get('/registro', function(req, res, next) {
  res.render("escogerRegistro",{});
});

router.get('/inicioClientes', function(req, res, next) {
  res.render("inicioClientes",{});
});

router.post('/inicioClientes', function(req, res, next) {
  connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
      //use the client for executing the query
    client.query(`SELECT validar_login_cliente('${req.body.user}','${req.body.contra}');`, function (err, result) {
    //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);
      if (err) {
        return console.error('error running query', err);
      }
      
      if(result.rows[0].validar_login_cliente){
        
        res.render("cliente/menuCliente",{email: req.body.user});

      }else{
        
        res.render('inicioClientes',{});
      }
      
    });
       
  });

});

router.get('/inicioTrabajadores', function(req, res, next) {
  res.render("inicioTrabajadores",{});
});

router.post('/inicioTrabajadores', function(req, res, next) {
  connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
      //use the client for executing the query
    client.query(`SELECT validar_login_trabajador('${req.body.user}','${req.body.contra}');`, function (err, result) {
    //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);
      if (err) {
        return console.error('error running query', err);
      }
      
      if(result.rows[0].validar_login_trabajador){
        connect(function (err, client, done) {
          if (err) {
            return console.error('error fetching client from pool', err);
          }

        client.query(`select estado_trabajador 
                      from trabajador 
                      natural join usuario 
                      where email = '${req.body.user}'`, function(err,result){
                        done(err);
                        if (err) {
                          return console.error('error running query', err);
                        }

                        res.render("trabajador/menuTrabajador",{email: req.body.user, data:result.rows});
        })
        
      });

      }else{
        
        res.render('inicioTrabajadores',{});
      }
      
    });
       
  });
});

router.get('/registroTrabajador', function(req, res, next) {
  res.render("registroTrabajador",{});
});

router.post('/registroTrabajador', function(req, res, next) {
  
  connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
      //use the client for executing the query
    client.query(`SELECT validar_registro_trabajador('${req.body.nombre}','${req.body.apellido}','${req.body.email}','${req.body.telefono}',
                                          '${req.body.cedula}','${req.body.contraseña}','${req.body.direccion}',
                                          ${req.body.coordenadas},'${req.body.ciudad}',NULL,'${req.body.cuenta}','${req.body.labor}','${req.body.precio}','${req.body.unidad}');`, function (err, result) {
    //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);
      if (err) {
        return console.error('error running query', err);
      }

      res.render("inicio",{});
    });
       
    
    
  });


});



router.get('/registroCliente', function(req, res, next) {
  res.render("registroCliente",{});
});



router.post('/registroCliente', function(req, res, next) {
  
  connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
      //use the client for executing the query
    client.query(`SELECT validar_registro_cliente('${req.body.nombre}','${req.body.apellido}','${req.body.email}','${req.body.telefono}',
                                          '${req.body.cedula}','${req.body.contraseña}','${req.body.direccion}',
                                          ${req.body.coordenadas},'${req.body.ciudad}',NULL,'${req.body.medio_pago}');`, function (err, result) {
    //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);
      if (err) {
        return console.error('error running query', err);
      }

      res.render("inicio",{});
    });
       
    
    
  });


});

module.exports = router;
