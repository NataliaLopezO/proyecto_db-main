\c mande_db

INSERT INTO LABOR(nombre_labor) VALUES ('Mecanico');
INSERT INTO LABOR(nombre_labor) VALUES ('Carpintero');
INSERT INTO LABOR(nombre_labor) VALUES ('Albañil');
INSERT INTO LABOR(nombre_labor) VALUES ('Pintor');
INSERT INTO LABOR(nombre_labor) VALUES ('Cerrajero');
INSERT INTO LABOR(nombre_labor) VALUES ('Peluquero');
INSERT INTO LABOR(nombre_labor) VALUES ('Paseador de perros');
INSERT INTO LABOR(nombre_labor) VALUES ('Cocinero');
INSERT INTO LABOR(nombre_labor) VALUES ('Niñero');
INSERT INTO LABOR(nombre_labor) VALUES ('Tutor');
INSERT INTO LABOR(nombre_labor) VALUES ('Chofer');
INSERT INTO LABOR(nombre_labor) VALUES ('Exterminador');

SELECT validar_registro_trabajador('Natalia','Lopez','nn@gmail.com',1,1193086608,'1','calle 1', POINT(3.43722, -76.5225),'Cali',NULL,1,1,30000,'dia');
SELECT validar_registro_trabajador('Juan','Perez','jj@gmail.com',2,78930608,'2','calle 2', POINT(3.43722, -76.5225),'Cali',NULL,2,2,35000,'dia');
SELECT validar_registro_trabajador('Andres','Gomez','aa@gmail.com',3,32830408,'3','calle 3', POINT(6.217, -75.567),'Medellin',NULL,3,3,40000,'dia');
SELECT validar_registro_trabajador('Oscar','Medina','oo@gmail.com',4,53050008,'4','calle 4', POINT(3.53944, -76.30361),'Palmira',NULL,4,4,15000,'hora');
SELECT validar_registro_trabajador('Gabriela','giraldo','gg@gmail.com',5,113050112,'5','calle 5', POINT(3.53944, -76.30361),'Palmira',NULL,5,4,14000,'hora');
SELECT validar_registro_trabajador('Ximena','Perez','xx@gmail.com',6,1121203108,'6','calle 6', POINT(3.53944, -76.30361),'Palmira',NULL,6,6,11000,'hora');
SELECT validar_registro_trabajador('Pedro','Camacho','pp@gmail.com',7,107203998,'7','calle 7', POINT(3.43722, -76.5225),'Cali',NULL,7,7,5000,'hora');
SELECT validar_registro_trabajador('Kevin','Moreno','kk@gmail.com',8,11109928,'8','calle 8', POINT(3.43722, -76.5225),'Cali',NULL,8,2,30000,'dia');
SELECT validar_registro_trabajador('Stella','Agudelo','ss@gmail.com',9,234050028,'9','calle 9',  POINT(6.217, -75.567),'Medellin',NULL,9,3,50000,'dia');
SELECT validar_registro_trabajador('Bibiana','Arango','bb@gmail.com',10,6050001,'10','calle 10',  POINT(6.217, -75.567),'Medellin',NULL,10,8,35000,'dia');
SELECT validar_registro_trabajador('Victoria','Fajardo','vv@gmail.com',11,1105791,'11','calle 11',  POINT(3.43722, -76.5225),'Cali',NULL,11,8,35000,'dia');

SELECT validar_registro_cliente('Carolain','Jimenez','cc@gmail.com',12,56720409,'12','calle 1 a', POINT(3.43722, -76.5225),'Cali',NULL,'debito');
SELECT validar_registro_cliente('Hernando','Lopez','hh@gmail.com',13,66721119,'13','calle 1 b', POINT(3.43722, -76.5225),'Cali',NULL,'credito');
SELECT validar_registro_cliente('Luisa','Lara','ll@gmail.com',14,66540418,'14','calle 3 a', POINT(6.217, -75.567),'Medellin',NULL,'credito');
SELECT validar_registro_cliente('Maria','Castro','mm@gmail.com',15,715540018,'15','calle 4 a', POINT(3.53944, -76.30361),'Palmira',NULL,'debito');

SELECT agregar_labor_trabajador('nn@gmail.com', 2, '10000', 'hora');
SELECT agregar_labor_trabajador('xx@gmail.com', 8, '50000', 'dia');
SELECT agregar_labor_trabajador('ss@gmail.com', 11, '60000', 'hora');


SELECT crear_servicio( 'cc@gmail.com', 1);
SELECT crear_servicio( 'cc@gmail.com', 2);
SELECT crear_servicio( 'cc@gmail.com', 7);
SELECT crear_servicio( 'hh@gmail.com', 11);
SELECT crear_servicio( 'll@gmail.com', 3);
SELECT crear_servicio( 'll@gmail.com', 10);
SELECT crear_servicio( 'mm@gmail.com', 4);

SELECT crear_pago( 1, 4, 'Muy bien ');
SELECT crear_pago( 5, 2, 'Lo peor');


