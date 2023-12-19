-- Eliminar tablas si existen
DROP TABLE IF EXISTS elementos_orden;
DROP TABLE IF EXISTS ordenes;
DROP TABLE IF EXISTS elementos_menu;
DROP TABLE IF EXISTS categorias_menu;
DROP TABLE IF EXISTS restaurantes;

CREATE TABLE restaurantes (
  restaurante_id VARCHAR(100) PRIMARY KEY ,
  nombre VARCHAR(100) NOT NULL,
  direccion VARCHAR(100) NOT NULL,
  telefono VARCHAR(100) NOT NULL
);

CREATE TABLE categorias_menu (
  categoria_id VARCHAR(100) PRIMARY KEY ,
  nombre_categoria VARCHAR(100) NOT NULL
);


CREATE TABLE elementos_menu (
  elemento_id VARCHAR(100) PRIMARY KEY ,
  nombre_elemento VARCHAR(100) NOT NULL,
  precio VARCHAR(100) NOT NULL,
  categoria_id VARCHAR(100),
  FOREIGN KEY (categoria_id) REFERENCES categorias_menu(categoria_id)
);

CREATE TABLE ordenes (
  orden_id VARCHAR(100) PRIMARY KEY ,
  restaurante_id VARCHAR(100),
  numero_mesa VARCHAR(100) NOT NULL,
  fecha VARCHAR(100) ,
  importe_total VARCHAR(100) NOT NULL,
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes(restaurante_id)

);

CREATE TABLE elementos_orden (
  elemento_orden_id VARCHAR(100) PRIMARY KEY ,
  orden_id VARCHAR(100),
  elemento_id VARCHAR(100),
  cantidad VARCHAR(100) NOT NULL,
  subtotal VARCHAR(100) NOT NULL,
  FOREIGN KEY (orden_id) REFERENCES ordenes(orden_id),
  FOREIGN KEY (elemento_id) REFERENCES elementos_menu(elemento_id)
);

