-- Tabla Deporte
CREATE TABLE Deporte (
    id_deporte SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

-- Tabla Usuarios
CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) CHECK (tipo_usuario IN ('Entrenador', 'Deportista')) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    club VARCHAR(100) NOT NULL
);

-- Tabla Deportistas
CREATE TABLE Deportistas (
    id_deportista SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(10),
    peso DECIMAL(5, 2),
    altura DECIMAL(5, 2),
    nivel_experiencia VARCHAR(20),
    id_deporte INT REFERENCES Deporte(id_deporte) ON DELETE SET NULL
);

-- Tabla Entrenadores
CREATE TABLE Entrenadores (
    id_entrenador SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    especialidad VARCHAR(100)
);

CREATE TABLE "usuario_deporte" (
  "id_usuario" integer NOT NULL,
  "id_deporte" integer NOT NULL,
   PRIMARY KEY(id_usuario,id_deporte)
);

CREATE TABLE "rutina_especifica" (
  "id_rutina" integer PRIMARY KEY,
  "id_deportista" integer NOT NULL,
  "id_deporte" integer NOT NULL,
  "fecha" date,
  "comentario_deportista" text,
  "comentario_entrenador" text
);

CREATE TABLE "rutina_fisica" (
  "id_rutina" integer PRIMARY KEY,
  "id_deportista" integer NOT NULL,
  "fecha" date,
  "comentario_deportista" text,
  "comentario_entrenador" text
);

CREATE TABLE "ejercicio_disparo" (
  "id_ejercicio" integer PRIMARY KEY,
  "id_rutina_especifica" integer NOT NULL,
  "cantidad_flechas" integer,
  "flechas_por_serie" integer,
  "promedio_por_flecha" integer,
  "tamano_diana" integer,
  "distancia" integer,
  "evaluacion" bool
);

CREATE TABLE "ejercicio_fisico" (
  "id_ejercicio_fisico" integer PRIMARY KEY,
  "id_rutina_fisica" integer NOT NULL,
  "id_creado_por" integer NOT NULL,
  "tipo" varchar,
  "tiempo" integer,
  "repeticiones" integer,
  "series" integer,
  "peso" integer
);

CREATE TABLE "tipo_ejercicio" (
  "id_tipo_ejercicio" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(255) NOT NULL,
  "usa_tiempo" BOOLEAN DEFAULT FALSE,
  "usa_repeticiones" BOOLEAN DEFAULT FALSE,
  "usa_series" BOOLEAN DEFAULT FALSE,
  "usa_peso" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "comentarios" (
  "id_comentario" integer PRIMARY KEY,
  "id_entrenador" integer NOT NULL,
  "id_deportista" integer NOT NULL,
  "contenido" text,
  "fecha" timestamp
);

CREATE TABLE tipo_ejercicio_especifico (
    id_tipo_ejercicio SERIAL PRIMARY KEY, -- ID único del tipo de ejercicio
    nombre_ejercicio VARCHAR(100) NOT NULL, -- Nombre del ejercicio (ej. "Disparo")
    id_deporte INT NOT NULL REFERENCES deporte(id_deporte) ON DELETE CASCADE, -- Relación con la tabla Deporte
    descripcion TEXT, -- Descripción opcional del ejercicio
    tabla_asociada VARCHAR(100) NOT NULL -- Nombre de la tabla donde se guardan los datos del ejercicio
);

ALTER TABLE "deportistas" ADD COLUMN "id_entrenador" integer;

ALTER TABLE "deportistas" ADD FOREIGN KEY ("id_entrenador") REFERENCES "entrenadores" ("id_entrenador");

ALTER TABLE "usuario_deporte" ADD FOREIGN KEY ("id_usuario") REFERENCES "usuarios" ("id_usuario");

ALTER TABLE "usuario_deporte" ADD FOREIGN KEY ("id_deporte") REFERENCES "deporte" ("id_deporte");

ALTER TABLE "rutina_especifica" ADD FOREIGN KEY ("id_deporte") REFERENCES "deporte" ("id_deporte");

ALTER TABLE "rutina_especifica" ADD FOREIGN KEY ("id_deportista") REFERENCES "deportistas" ("id_deportista");

ALTER TABLE "rutina_fisica" ADD FOREIGN KEY ("id_deportista") REFERENCES "deportistas" ("id_deportista");

ALTER TABLE "ejercicio_fisico" ADD FOREIGN KEY ("id_creado_por") REFERENCES "entrenadores" ("id_entrenador");

ALTER TABLE "ejercicio_fisico" ADD FOREIGN KEY ("id_rutina_fisica") REFERENCES "rutina_fisica" ("id_rutina");

ALTER TABLE "ejercicio_disparo" ADD FOREIGN KEY ("id_rutina_especifica") REFERENCES "rutina_especifica" ("id_rutina");

ALTER TABLE "comentarios" ADD FOREIGN KEY ("id_entrenador") REFERENCES "entrenadores" ("id_entrenador");

ALTER TABLE "comentarios" ADD FOREIGN KEY ("id_deportista") REFERENCES "deportistas" ("id_deportista");

ALTER TABLE "entrenadores" ADD FOREIGN KEY ("id_usuario") REFERENCES "usuarios" ("id_usuario");

ALTER TABLE "deportistas" ADD FOREIGN KEY ("id_usuario") REFERENCES "usuarios" ("id_usuario");

ALTER TABLE "tipo_ejercicio" ADD COLUMN "id_creado_por" INTEGER;

ALTER TABLE "tipo_ejercicio" 
ADD FOREIGN KEY ("id_creado_por") REFERENCES "entrenadores" ("id_entrenador") ON DELETE SET NULL;

ALTER TABLE "ejercicio_fisico" RENAME COLUMN "tipo" TO "id_tipo_ejercicio";

ALTER TABLE "ejercicio_fisico" 
ALTER COLUMN "id_tipo_ejercicio" TYPE INTEGER USING "id_tipo_ejercicio"::INTEGER;

ALTER TABLE "ejercicio_fisico" 
ADD FOREIGN KEY ("id_tipo_ejercicio") REFERENCES "tipo_ejercicio" ("id_tipo_ejercicio") ON DELETE RESTRICT;

ALTER TABLE rutina_fisica ALTER COLUMN id_rutina DROP DEFAULT;
ALTER TABLE rutina_fisica ALTER COLUMN id_rutina ADD GENERATED ALWAYS AS IDENTITY;

ALTER TABLE ejercicio_disparo ALTER COLUMN id_ejercicio DROP DEFAULT;
ALTER TABLE ejercicio_disparo ALTER COLUMN id_ejercicio ADD GENERATED ALWAYS AS IDENTITY;

ALTER TABLE ejercicio_fisico ALTER COLUMN id_ejercicio_fisico DROP DEFAULT;
ALTER TABLE ejercicio_fisico ALTER COLUMN id_ejercicio_fisico ADD GENERATED ALWAYS AS IDENTITY;

ALTER TABLE comentarios ALTER COLUMN id_comentario DROP DEFAULT;
ALTER TABLE comentarios ALTER COLUMN id_comentario ADD GENERATED ALWAYS AS IDENTITY;

ALTER TABLE rutina_especifica ALTER COLUMN fecha SET DEFAULT CURRENT_DATE;
ALTER TABLE rutina_fisica ALTER COLUMN fecha SET DEFAULT CURRENT_DATE;
ALTER TABLE comentarios ALTER COLUMN fecha SET DEFAULT CURRENT_DATE;


