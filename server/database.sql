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

CREATE TABLE "comentarios" (
  "id_comentario" integer PRIMARY KEY,
  "id_entrenador" integer NOT NULL,
  "id_deportista" integer NOT NULL,
  "contenido" text,
  "fecha" timestamp
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
