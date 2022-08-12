-- Database: mande_db

-- DROP DATABASE mande_db;

CREATE DATABASE mande_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    TEMPLATE template0;

\c mande_db

--Crea tabla usuario

CREATE TABLE USUARIO (
id_usuario SERIAL NOT NULL PRIMARY KEY, 
nombre VARCHAR(64),
apellido VARCHAR(64),
email VARCHAR(64) UNIQUE NOT NULL,
telefono INTEGER UNIQUE NOT NULL, 
cedula INTEGER,  
contraseña VARCHAR(15),
direccion_nombre VARCHAR(64),
direccion POINT,
ciudad VARCHAR(64)
);

--Crea tabla trabajador

CREATE TABLE TRABAJADOR (
id_trabajador SERIAL PRIMARY KEY,
id_usuario INT NOT NULL UNIQUE, 
foto_perfil  BYTEA,
estado_trabajador BOOL,
cuenta_trabajador INT, 

FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)

);

--Crea tabla cliente
CREATE TYPE tipo_pago AS ENUM ('credito', 'debito');

CREATE TABLE CLIENTE(
id_cliente SERIAL PRIMARY KEY,
id_usuario INT NOT NULL UNIQUE, 
recibo BYTEA,
medio_pago tipo_pago,

FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)

);

--Crea tabla labor

CREATE TABLE LABOR(
id_labor SERIAL PRIMARY KEY,
nombre_labor VARCHAR(64)
);


--Crea tipo para la tabla trabajador labor

CREATE TYPE unidad AS ENUM ('dia', 'hora');

--Crea tabla trabajador labor

CREATE TABLE TRABAJADOR_LABOR(
id_trabajador_labor SERIAL PRIMARY KEY,
id_trabajador INT NOT NULL,
id_labor INT NOT NULL,
precio_labor INTEGER,   
unidad_valor unidad,

FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador),
FOREIGN KEY (id_labor) REFERENCES labor(id_labor)

);

--Crea tabla servicio

CREATE TABLE SERVICIO(
id_servicio SERIAL PRIMARY KEY,
id_cliente INT NOT NULL,
id_trabajador_labor INT NOT NULL,
fecha_inicio DATE,
fecha_final DATE,
estado_servicio BOOL,


FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
FOREIGN KEY (id_trabajador_labor) REFERENCES trabajador_labor(id_trabajador_labor)

);

--Crea tabla pago

CREATE TABLE PAGO_SERVICIO(
id_pago SERIAL PRIMARY KEY,
id_servicio INT NOT NULL UNIQUE,
fecha_pago DATE,
puntaje_trabajador INT,
reseña VARCHAR(100) DEFAULT '  ' ,

FOREIGN KEY (id_servicio) REFERENCES servicio(id_servicio)
);


--Validar registro trabajador

Create or replace Function validar_registro_trabajador( nombre VARCHAR(64),
					       apellido VARCHAR(64),
                           email_usuario VARCHAR(64),
                           telefono INTEGER,
                                                                  cedula INTEGER,
                                                                  contraseña VARCHAR(15),
                                                                  direccion_nombre VARCHAR(64),
                                                                  direccion POINT,
                                                                  ciudad VARCHAR(64), 
													              foto_perfil  BYTEA, 				
                                                                  cuenta_trabajador INTEGER,
		id_labor_t INTEGER,
precio INT,
und unidad
	        )
																  
																  Returns INTEGER
As $$
DECLARE 
id integer;
id_trabajador_t INTEGER;

Begin
    If NOT Exists (
        Select
            *
        From
            usuario
        Where
            -- Assuming all three fields are primary key
            email = email_usuario
    ) Then
	INSERT INTO usuario (nombre, apellido, email, telefono,
                      cedula, contraseña, direccion_nombre, direccion, ciudad ) VALUES
(nombre, apellido,email_usuario,telefono, cedula, contraseña, direccion_nombre, direccion, ciudad);

  id:=(select id_usuario from usuario where email=email_usuario);
  INSERT INTO trabajador(id_usuario, foto_perfil, estado_trabajador, cuenta_trabajador) VALUES (id, foto_perfil, TRUE, cuenta_trabajador);

id_trabajador_t:= (select id_trabajador from trabajador where id_usuario = id);
INSERT INTO trabajador_labor(id_trabajador, id_labor, precio_labor, unidad_valor) VALUES (id_trabajador_t, id_labor_t, precio, und);

RETURN 1;
    ELSE 
	RAISE NOTICE 'No se puede ingresar';
RETURN 0;
    End If;
End;
$$ Language plpgsql;


--validad registro cliente

Create or replace Function validar_registro_cliente( nombre VARCHAR(64),
					                                 apellido VARCHAR(64),
                                                     email_usuario VARCHAR(64),
                                                     telefono INTEGER,
                                                     cedula INTEGER,
                                                     contraseña VARCHAR(15),
                                                     direccion_nombre VARCHAR(64),
                                                     direccion POINT,
                                                     ciudad VARCHAR(64), 
													 recido  BYTEA, 					             
													 medio_pago tipo_pago)

Returns INTEGER
As $$
DECLARE 
id integer;

Begin
    If NOT Exists (
        Select
            *
        From
            usuario
        Where
            -- Assuming all three fields are primary key
            email = email_usuario
    ) Then
	INSERT INTO usuario (nombre, apellido, email, telefono,
                      cedula, contraseña, direccion_nombre, direccion, ciudad ) VALUES
(nombre, apellido,email_usuario,telefono, cedula, contraseña, direccion_nombre, direccion, ciudad);

  id:=(select id_usuario from usuario where email=email_usuario);
  INSERT INTO cliente(id_usuario, recibo, medio_pago) VALUES (id, NULL,medio_pago);

RETURN 1;
    ELSE 
	RAISE NOTICE 'No se puede ingresar';
RETURN 0;
    End If;
End;
$$ Language plpgsql;



--Validar inicio sesión TRABAJADOR
Create or replace Function validar_login_trabajador(email_usuario VARCHAR(64),contrasena_usuario VARCHAR(15)) Returns INTEGER
As $$
Begin
    If NOT Exists (
        Select
            *
        From
            usuario
        Where
            -- Assuming all three fields are primary key
            email = email_usuario
    ) Then

RAISE NOTICE 'No se puede ni validar';
RETURN 0;
End If;

    IF exists(
		select id_trabajador
        from trabajador
        Natural join usuario 
        where email = email_usuario and contraseña = contrasena_usuario
        
	) Then
	
RETURN 1;

   ELSE  
   
   RETURN 0;

End If;
End;
$$ Language plpgsql;

----Validar inicio sesión CLIENTE
Create or replace Function validar_login_cliente(email_usuario VARCHAR(64),contrasena_usuario VARCHAR(15)) Returns INTEGER
As $$
Begin
    If NOT Exists (
        Select
            *
        From
            usuario
        Where
            -- Assuming all three fields are primary key
            email = email_usuario
    ) Then

RAISE NOTICE 'No se puede ni validar';
RETURN 0;
End If;

    IF exists(
		select id_cliente
        from cliente
        Natural join usuario 
        where email = email_usuario and contraseña = contrasena_usuario
        
	) Then
	
RETURN 1;

   ELSE  
   
   RETURN 0;

End If;
End;
$$ Language plpgsql;

--Actualizar datos de un trabajador

Create or replace Function actualizar_trabajador( nombre_t VARCHAR(64),
												  email_usuario VARCHAR(64),

					       apellido_t VARCHAR(64),
                                                                  contraseña_t VARCHAR(15),
                                                                  direccion_nombre_t VARCHAR(64),
                                                                  direccion_t POINT,
                                                                  ciudad_t VARCHAR(64), 
													            					             
													              cuenta_trabajador_t INTEGER
													             )
																  
																  Returns INTEGER
As $$
DECLARE 
id integer;

Begin

    UPDATE usuario
SET nombre= nombre_t, apellido= apellido_t, contraseña=contraseña_t, direccion_nombre= direccion_nombre_t, direccion= direccion_t, ciudad= ciudad_t WHERE email= email_usuario;

  id:=(select id_usuario from usuario where email=email_usuario);
  UPDATE trabajador SET cuenta_trabajador= cuenta_trabajador_t WHERE id_usuario= id;

RETURN 1;

End;
$$ Language plpgsql;

--agrega una nueva labor al trabajador

Create or replace Function agregar_labor_trabajador( email_usuario VARCHAR(64),
       					                           id_labor_t INTEGER,
    precio INT,
    und unidad   )
												  Returns INTEGER
As $$
DECLARE 
id integer;
id_trabajador_t INTEGER;

Begin
    If NOT Exists (
        Select
             id_labor
        From
            trabajador_labor
		NATURAL JOIN trabajador AS t
		NATURAL JOIN usuario AS u
        Where
           id_labor=id_labor_t AND u.email=email_usuario
    ) Then
	
  id:=(select id_usuario from usuario where email=email_usuario);

 id_trabajador_t:= (select id_trabajador from trabajador where id_usuario = id);

INSERT INTO trabajador_labor(id_trabajador, id_labor, precio_labor, unidad_valor) VALUES (id_trabajador_t, id_labor_t, precio, und);

RETURN 1;
    ELSE 
	RAISE NOTICE 'No se puede ingresar';
    RETURN 0;
    End If;
End;
$$ Language plpgsql;


--Actualizar datos de un cliente

Create or replace Function actualizar_cliente( nombre_c VARCHAR(64),
												  email_usuario VARCHAR(64),

					       apellido_c VARCHAR(64),
                                                                  contraseña_c VARCHAR(15),
                                                                  direccion_nombre_c VARCHAR(64),
                                                                  direccion_c POINT,
                                                                  ciudad_c VARCHAR(64), 
													            					             
													              pago_c tipo_pago
													             )
																  
																  Returns INTEGER
As $$
DECLARE 
id integer;

Begin

    UPDATE usuario
SET nombre= nombre_c, apellido= apellido_c, contraseña=contraseña_c, direccion_nombre= direccion_nombre_c, direccion= direccion_c, ciudad= ciudad_c WHERE email= email_usuario;

  id:=(select id_usuario from usuario where email=email_usuario);
  UPDATE cliente SET medio_pago= pago_c WHERE id_usuario= id;

RETURN 1;

End;
$$ Language plpgsql;

--Crear servicios
Create or replace Function crear_servicio( email_usuario_cliente VARCHAR(64), trabajador_labor INTEGER)
Returns INTEGER
As $$
DECLARE 
id integer;
fecha DATE; 

Begin
	
  id:=(select c.id_cliente from cliente AS c 
	   NATURAL JOIN usuario AS u 
	   where u.email=email_usuario_cliente);
	   
  fecha:=(SELECT NOW() AS fecha_inicial);

INSERT INTO servicio (id_cliente, id_trabajador_labor,fecha_inicio, fecha_final, estado_servicio) VALUES (id, trabajador_labor, fecha , NULL , true);

RETURN 1;
End;
$$ Language plpgsql;


--cambiar estado del trabajador a falso (ocupado) cuando recibe un servicio
Create or replace Function cambio_estado_ocupado() Returns trigger
As $$
DECLARE 
id integer;
Begin

id:=(select t.id_trabajador 
        from trabajador as t
        NATURAL JOIN trabajador_labor as tl
        where tl.id_trabajador_labor =  NEW.id_trabajador_labor );


UPDATE trabajador SET estado_trabajador= FALSE where id_trabajador= id;
RETURN NULL; 
End;
$$ Language plpgsql;


create trigger cambio_estado_ocupado AFTER INSERT ON servicio FOR EACH ROW EXECUTE PROCEDURE cambio_estado_ocupado();


--crea pagos nuevos

Create or replace Function crear_pago( id_servicio_t INTEGER, puntaje_t INTEGER, descripcion VARCHAR(100))
Returns INTEGER
As $$
DECLARE 
fecha DATE; 

Begin
	   
  fecha:=(SELECT NOW() AS fecha_inicial);

INSERT INTO PAGO_SERVICIO(id_servicio, fecha_pago, puntaje_trabajador, reseña) VALUES (id_servicio_t, fecha,puntaje_t, descripcion);

RETURN 1;
End;
$$ Language plpgsql;


--cambia estado del trabajador a disponible cuando termina un servicio y cambia el estado del servicio a false
Create or replace Function cambio_estado_disponible() Returns trigger
As $$
DECLARE 
id INTEGER;
fecha DATE;
Begin

id:= (select t.id_trabajador
	  from pago_servicio AS ps
	  NATURAL JOIN servicio AS s
      NATURAL JOIN trabajador_labor as tl
      NATURAL JOIN trabajador as t
	  WHERE ps.id_servicio = NEW.id_servicio);
fecha:=(SELECT NOW() AS fecha_inicial);

UPDATE trabajador SET estado_trabajador= TRUE where id_trabajador= id;
UPDATE servicio SET estado_servicio =FALSE where id_servicio = NEW.id_servicio;
UPDATE servicio SET fecha_final = fecha where id_servicio = NEW.id_servicio;

RETURN NULL; 
End;
$$ Language plpgsql;

create trigger cambio_estado_disponible AFTER INSERT ON pago_servicio FOR EACH ROW EXECUTE PROCEDURE cambio_estado_disponible();


