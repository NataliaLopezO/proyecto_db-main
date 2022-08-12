var express = require('express');
var router = express.Router();

const connect = require('./db_pool_connect');

/* GET home page. */


router.get('/:email', function (req, res, next) {

   connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
      //use the client for executing the query
    client.query(`select estado_trabajador 
                  from trabajador 
                  natural join usuario 
                  where email = '${req.params.email}';`, function (err, result) {
    //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);
      if (err) {
        return console.error('error running query', err);
      }
    
      res.render("trabajador/menuTrabajador",{email: req.params.email, data:result.rows});

    });
       
  });
});


router.get('/configuracionTrabajador/:email', function(req,res, next){
    connect(function (err, client, done) {
        if (err) {
          return console.error('error fetching client from pool', err);
        }
    
        //use the client for executing the query
        client.query(`SELECT * FROM trabajador NATURAL JOIN usuario where email = '${req.params.email}';`, function (err, result) {
          //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
          done(err);
    
          if (err) {
            return console.error('error running query', err);
          }
    
          res.render("trabajador/configuracionTrabajador", { email : req.params.email, data: result.rows });
        });
      });
});

router.post('/configuracionTrabajador/:email', function(req,res, next){

    var email = req.params.email;
    var rutaRedireccionar='http://localhost:3000/trabajador/configuracionTrabajador/'+email;

    connect(function (err, client, done) {
        if (err) {
          return console.error('error fetching client from pool', err);
        }
    
        //use the client for executing the query
        client.query(`SELECT actualizar_trabajador('${req.body.nombre}','${req.params.email}','${req.body.apellido}', '${req.body.contra}', '${req.body.direccion}',${req.body.coordenadas},'${req.body.ciudad}',${req.body.cuenta});`, function (err, result) {
          //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
          done(err);
    
          if (err) {
            return console.error('error running query', err);
          }

          res.redirect(rutaRedireccionar);
    
          
        });
      });
});


router.get('/puntajeTrabajador/:email', function(req,res, next){

    connect(function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
  
      //use the client for executing the query
      client.query(`select p.puntaje_trabajador, p.reseña, l.nombre_labor, p.fecha_pago
      from pago_servicio as p
      natural join servicio as s
      natural join trabajador_labor as tl
      natural join labor as l
      where id_trabajador = (select t.id_trabajador
                            from trabajador as t
                            natural join usuario as u
                            where email='${req.params.email}');`, function (err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);
       
        
        if (err) {
          return console.error('error running query', err);
        }
  
  
        res.render("trabajador/puntajesReseñaTrabajador",{email : req.params.email, data: result.rows});
  
      });
    });
});

router.get('/serviciosTrabajador/:email', function(req,res, next){

    connect(function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
  
      //use the client for executing the query
      client.query(`SELECT l.nombre_labor, tl.precio_labor, tl.unidad_valor, tl.id_labor, t.id_trabajador
                    from trabajador_labor AS tl
                    NATURAL JOIN labor AS l
                    NATURAL JOIN trabajador as t
                    NATURAL JOIN usuario AS u
                    WHERE email= '${req.params.email}' `, function (err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);
       
        
        if (err) {
          return console.error('error running query', err);
        }
  
        res.render('trabajador/serviciosTrabajador', { email : req.params.email, data: result.rows });
      });
    });
});



router.post('/serviciosTrabajador/:email', function(req,res, next){

  var email = req.params.email;
  var rutaRedireccionar='http://localhost:3000/trabajador/serviciosTrabajador/'+email;

  connect(function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
  
      //use the client for executing the query
      client.query(`SELECT agregar_labor_trabajador('${req.params.email}','${req.body.labor}', '${req.body.precio}', '${req.body.unidad}');`, function (err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);
  
        if (err) {
          return console.error('error running query', err);
        }

        res.redirect(rutaRedireccionar);
  
        
      });
    });
});

router.get('/actividadActualTrabajador/:email', function(req,res, next){
   
    connect(function (err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
  
      //use the client for executing the query
      client.query(`SELECT u.nombre,u.apellido,l.nombre_labor, tl.precio_labor, tl.unidad_valor, s.fecha_inicio,u.direccion_nombre,u.ciudad,u.telefono,u.email
      FROM servicio as s
      NATURAL JOIN trabajador_labor AS tl
      NATURAL JOIN cliente AS c
      NATURAL JOIN labor AS l
      NATURAL JOIN usuario AS u
      where s.estado_servicio = true and tl.id_trabajador = (select id_trabajador
                                                         from usuario
                                                         Natural join trabajador
                                                         where email = '${req.params.email}');`, function (err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);
       
        
        if (err) {
          return console.error('error running query', err);
        }
  
        res.render('trabajador/actividadActualTrabajador',{email : req.params.email, data: result.rows});
  
      });
    });
});

router.get('/historialServiciosTrabajador/:email', function(req,res, next){
  connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    //use the client for executing the query
    client.query(`SELECT u.nombre,l.nombre_labor,tl.precio_labor, tl.unidad_valor, s.fecha_inicio,s.fecha_final
    FROM servicio as s
    NATURAL JOIN trabajador_labor AS tl
    NATURAL JOIN cliente AS c
    NATURAL JOIN labor AS l
    NATURAL JOIN usuario AS u
    where s.estado_servicio = false and tl.id_trabajador = (select id_trabajador
                                                       from usuario as u
                                                       Natural join trabajador as t
                                                       where email = '${req.params.email}');`, function (err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);
     
      
      if (err) {
        return console.error('error running query', err);
      }


      res.render("trabajador/historialServiciosTrabajador",{email : req.params.email, data: result.rows});

    });
  });
   
});

router.get('/historialCobrosTrabajador/:email', function(req,res, next){
  connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    //use the client for executing the query
    client.query(`SELECT u.nombre,l.nombre_labor,tl.precio_labor, tl.unidad_valor, p.fecha_pago, c.medio_pago
                  FROM pago_servicio as p
                  NATURAL JOIN servicio as s
                  NATURAL JOIN trabajador_labor AS tl
                  NATURAL JOIN cliente AS c
                  NATURAL JOIN labor AS l
                  NATURAL JOIN usuario AS u
                  
                  where s.estado_servicio = false and tl.id_trabajador= (select id_trabajador
                                                                    from usuario as u
                                                                    Natural join trabajador as t
                                                                    where email = '${req.params.email}');`, function (err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);
     
      
      if (err) {
        return console.error('error running query', err);
      }

      res.render('trabajador/historialCobrosTrabajador',{email : req.params.email, data: result.rows});

    });
  });
});



module.exports = router;