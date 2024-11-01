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
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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



-- Tabla Entrenador_Deportista
CREATE TABLE Entrenador_Deportista (
    id SERIAL PRIMARY KEY,
    id_entrenador INT REFERENCES Entrenadores(id_entrenador) ON DELETE CASCADE,
    id_deportista INT REFERENCES Deportistas(id_deportista) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_finalizacion TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Rutina (
    id_rutina SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    duracion INTEGER,  -- Duración en minutos
    frecuencia_semanal INTEGER,  -- Número de días por semana
    objetivo VARCHAR(50)  -- Ejemplo: 'fuerza', 'resistencia', 'flexibilidad'
);


-- Crear índice para la relación Entrenador-Deportista
CREATE INDEX idx_entrenador_deportista ON Entrenador_Deportista(id_entrenador, id_deportista);

CREATE TABLE Ejercicios (
    id_ejercicio SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    grupo_muscular VARCHAR(50),
    volumen INTEGER,
    promedio_flecha FLOAT,
    puntaje_eval INTEGER,
    tiempo_descanso INTEGER,
    incluye_flechas BOOLEAN DEFAULT FALSE
);

CREATE TABLE Asignacion_Ejercicios_Rutinas (
    id_asignacion SERIAL PRIMARY KEY,
    id_rutina INTEGER NOT NULL,
    id_ejercicio INTEGER NOT NULL,
    orden INTEGER,
    dia_semana VARCHAR(20),
    FOREIGN KEY (id_rutina) REFERENCES Rutina(id_rutina),
    FOREIGN KEY (id_ejercicio) REFERENCES Ejercicios(id_ejercicio)
);

