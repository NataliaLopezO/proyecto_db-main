var express = require('express');
var router = express.Router();

const connect = require('./db_pool_connect');
/* GET home page. */

router.get('/:email', function (req, res, next) {
  res.render("cliente/menuCliente",{email : req.params.email});
});

router.get('/configuracionCliente/:email', function(req,res, next){
  connect(function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
  
      //use the client for executing the query
      client.query(`SELECT * FROM cliente NATURAL JOIN usuario where email = '${req.params.email}';`, function (err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);
  
        if (err) {
          return console.error('error running query', err);
        }
  
        res.render("cliente/configuracionCliente", { email : req.params.email, data: result.rows });
      });
    });
});

router.post('/configuracionCliente/:email', function(req,res, next){

  var email = req.params.email;
  var rutaRedireccionar='http://localhost:3000/cliente/configuracionCliente/'+email;

  connect(function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
  
      //use the client for executing the query
      client.query(`SELECT actualizar_cliente('${req.body.nombre}','${req.params.email}','${req.body.apellido}', '${req.body.contra}', '${req.body.direccion}',${req.body.coordenadas},'${req.body.ciudad}','${req.body.pago}');`, function (err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);
  
        if (err) {
          return console.error('error running query', err);
        }

        res.redirect(rutaRedireccionar);
  
        
      });
    });
});



router.get('/buscarServicio/:email', function (req, res, next) {

  connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    //use the client for executing the query
    client.query(`select u.nombre,u.apellido,u.ciudad,l.nombre_labor,tl.id_trabajador_labor, tl.precio_labor, tl.unidad_valor,avg(puntaje_trabajador) as promedio
                  from pago_servicio as ps
                  right join servicio as s on s.id_servicio = ps.id_servicio
                  right join trabajador_labor as tl on s.id_trabajador_labor = tl.id_trabajador_labor
                  natural join trabajador as t
                  natural join labor as l
                  natural join usuario as u
                  where t.estado_trabajador=true and u.ciudad = (select u.ciudad
                                                                                  from usuario as u
                                                                                  where email= '${req.params.email}' )
                  group by tl.id_trabajador_labor,l.id_labor, u.nombre, tl.precio_labor,u.ciudad, tl.unidad_valor, u.apellido
                  order by nombre
                  LIMIT 10;`, function (err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);
     
      
      if (err) {
        return console.error('error running query', err);
      }

      res.render("cliente/buscarServicio", { email : req.params.email, data: result.rows });

    });
  });
});


router.post('/buscarServicio/:email', function (req, res, next) {
  var email = req.params.email;
  var rutaRedireccionar='http://localhost:3000/cliente/buscarServicio/'+email;
  connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    //use the client for executing the query
    if(req.body.labor== '*'){

      res.redirect(rutaRedireccionar);
    }else{

      client.query(`select u.nombre,u.apellido,u.ciudad,l.nombre_labor, tl.id_trabajador_labor, tl.precio_labor, tl.unidad_valor,avg(puntaje_trabajador) as promedio
                  from pago_servicio as ps
                  right join servicio as s on s.id_servicio = ps.id_servicio
                  right join trabajador_labor as tl on s.id_trabajador_labor = tl.id_trabajador_labor
                  natural join trabajador as t
                  natural join labor as l
                  natural join usuario as u
                  where t.estado_trabajador=true and l.id_labor=${req.body.labor} and u.ciudad = (select u.ciudad
                                                                                  from usuario as u
                                                                                  where email= '${req.params.email}' )
                  group by tl.id_trabajador_labor,l.id_labor, u.nombre, tl.precio_labor,u.ciudad, tl.unidad_valor, u.apellido
                  order by nombre
                  LIMIT 10;`, function (err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);
     
      
      if (err) {
        return console.error('error running query', err);
      }

      res.render("cliente/buscarServicio", { email : req.params.email, data: result.rows });

    });
  }
  });
      
    
    
 

});


router.get('/buscarServicio/seleccion/:email/:idTrabajador', function (req, res, next) {
  var email = req.params.email;
  var rutaRedireccionar='http://localhost:3000/cliente/buscarServicio/'+email;

  connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    //use the client for executing the query
    client.query(`Select crear_servicio('${req.params.email}', ${req.params.idTrabajador});`, function (err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);
     
      
      if (err) {
        return console.error('error running query', err);
      }

      res.redirect(rutaRedireccionar);

    });
  });


    
});

router.get('/serviciosActuales/:email', function (req, res, next) {
  connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    //use the client for executing the query
    client.query(`SELECT s.id_servicio,u.nombre,l.nombre_labor, u.ciudad,tl.precio_labor, tl.unidad_valor, s.fecha_inicio
                  FROM servicio as s
                  NATURAL JOIN trabajador_labor AS tl
                  NATURAL JOIN trabajador AS t
                  NATURAL JOIN labor AS l
                  NATURAL JOIN usuario AS u
                  where s.estado_servicio = true and s.id_cliente = (select id_cliente
                                                                     from usuario as u
                                                                     Natural join cliente as c
                                                                     where email = '${req.params.email}');`, function (err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);
     
      
      if (err) {
        return console.error('error running query', err);
      }

      res.render("cliente/serviciosActuales",{email : req.params.email, data: result.rows});

    });
  });
});

router.post('/serviciosActuales/:email', function(req,res, next){

  var email = req.params.email;
  var rutaRedireccionar='http://localhost:3000/cliente/serviciosActuales/'+email;

  connect(function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
  
      //use the client for executing the query
      client.query(`SELECT crear_pago(${req.body.servicio},${req.body.puntaje}, '${req.body.descripcion}');`, function (err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);
  
        if (err) {
          return console.error('error running query', err);
        }

        res.redirect(rutaRedireccionar);
  
        
      });
    });
});

router.get('/serviciosActuales/pagar/:email/:idTrabajador', function (req, res, next) {
  var email = req.params.email;
  var rutaRedireccionar='http://localhost:3000/cliente/serviciosActuales/'+email;

  connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    //use the client for executing the query
    client.query(`Select crear_servicio('${req.params.email}', ${req.params.idTrabajador});`, function (err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);
     
      
      if (err) {
        return console.error('error running query', err);
      }

      res.redirect(rutaRedireccionar);

    });
  });


    
});



router.get('/historialServiciosCliente/:email', function (req, res, next) {
 
  connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    //use the client for executing the query
    client.query(`SELECT s.id_servicio,u.nombre,l.nombre_labor, u.ciudad,tl.precio_labor, tl.unidad_valor, s.fecha_inicio,s.fecha_final
                  FROM servicio as s
                  NATURAL JOIN trabajador_labor AS tl
                  NATURAL JOIN trabajador AS t
                  NATURAL JOIN labor AS l
                  NATURAL JOIN usuario AS u
                  where s.estado_servicio = false and s.id_cliente = (select id_cliente
                                                                     from usuario as u
                                                                     Natural join cliente as c
                                                                     where email = '${req.params.email}');`, function (err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);
     
      
      if (err) {
        return console.error('error running query', err);
      }


      res.render("cliente/historialServiciosCliente",{email : req.params.email, data: result.rows});

    });
  });
});

router.get('/historialCobrosCliente/:email', function (req, res, next) {
 
  connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    //use the client for executing the query
    client.query(`SELECT u.nombre,l.nombre_labor,tl.precio_labor, tl.unidad_valor, p.fecha_pago
                  FROM pago_servicio as p
                  NATURAL JOIN servicio as s
                  NATURAL JOIN trabajador_labor AS tl
                  NATURAL JOIN trabajador AS t
                  NATURAL JOIN labor AS l
                  NATURAL JOIN usuario AS u
                  
                  where s.estado_servicio = false and s.id_cliente = (select id_cliente
                                                                    from usuario as u
                                                                    Natural join cliente as c
                                                                    where email ='${req.params.email}');`, function (err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);
     
      
      if (err) {
        return console.error('error running query', err);
      }

      res.render("cliente/historialCobrosCliente",{email : req.params.email, data: result.rows});

    });
  });
});





module.exports = router;
