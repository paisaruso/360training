const pool = require("../db");

// Controlador para la evolución del puntaje promedio por flecha
const getEvolucionPuntaje = async (req, res) => {
  try {
    // Obtenemos el id_deportista y/o el rango de fechas de la query string
    // Ejemplo: GET /api/analytics/evolucion-puntaje?nombre=Juan&fechaInicio=2023-01-01&fechaFin=2023-12-31
    const { nombre, fechaInicio, fechaFin } = req.query;

    // Validamos si hay nombre
    if (!nombre) {
      return res.status(400).json({
        error: "Debe proporcionar el nombre del deportista.",
      });
    }

    // 2. Obtener id_usuario a partir del nombre
    //    Suponiendo que la columna en la tabla Usuarios sea 'nombre' (ajústalo si difiere).
    const usuarioResult = await pool.query(
      "SELECT id_usuario FROM Usuarios WHERE nombre = $1",
      [nombre]
    );
    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({
        error: `No se encontró un usuario con el nombre: ${nombre}`,
      });
    }
    const idUsuario = usuarioResult.rows[0].id_usuario;

    // 3. Obtener el id_deportista usando la tabla Deportistas
    const deportistaResult = await pool.query(
      "SELECT id_deportista FROM Deportistas WHERE id_usuario = $1",
      [idUsuario]
    );
    if (deportistaResult.rows.length === 0) {
      return res.status(404).json({
        error: `El usuario ${nombre} no está registrado como Deportista.`,
      });
    }
    const id_deportista = deportistaResult.rows[0].id_deportista;
    // Preparamos el WHERE dinámico (p.ej. si se incluyen rango de fechas)
    let whereClause = "WHERE re.id_deportista = $1";
    const params = [id_deportista];

    if (fechaInicio && fechaFin) {
      whereClause += " AND re.fecha BETWEEN $2 AND $3";
      params.push(fechaInicio, fechaFin);
    } else if (fechaInicio) {
      whereClause += " AND re.fecha >= $2";
      params.push(fechaInicio);
    } else if (fechaFin) {
      whereClause += " AND re.fecha <= $2";
      params.push(fechaFin);
    }

    // Consulta SQL para obtener la evolución del promedio
    // Ejemplo: Queremos: fecha, promedio_por_flecha
    const query = `
      SELECT re.fecha, ed.promedio_por_flecha
      FROM ejercicio_disparo ed
      JOIN rutina_especifica re ON re.id_rutina = ed.id_rutina_especifica
      ${whereClause}
      ORDER BY re.fecha ASC
    `;

    const result = await pool.query(query, params);

    // Formateamos los datos para enviarlos al frontend de forma amigable.
    // Por ejemplo, { labels: [...], data: [...] }
    const labels = [];
    const data = [];

    for (const row of result.rows) {
      // Asumiendo que 'fecha' es de tipo date o timestamp
      labels.push(row.fecha);
      data.push(row.promedio_por_flecha);
    }

    return res.json({
      labels,
      data,
    });
  } catch (error) {
    console.error("Error al obtener evolución de puntaje:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al procesar la solicitud" });
  }
};

const getComparacionPuntajeDisparo = async (req, res) => {
  try {
    // 1. Desestructuramos los parámetros de la query:
    //    - nombre: el nombre del deportista (obligatorio, según tu requerimiento).
    //    - groupBy: si agrupamos por tamano_diana o distancia. tambien se puede agrupar por cantidad_flechas y flechas_por_serie
    //    - fechaInicio, fechaFin: para filtrar por rango (opcional).
    const { nombre, groupBy = "distancia", fechaInicio, fechaFin } = req.query;

    // Validamos si hay nombre
    if (!nombre) {
      return res.status(400).json({
        error: "Debe proporcionar el nombre del deportista.",
      });
    }

    // 2. Obtener id_usuario a partir del nombre
    //    Suponiendo que la columna en la tabla Usuarios sea 'nombre' (ajústalo si difiere).
    const usuarioResult = await pool.query(
      "SELECT id_usuario FROM Usuarios WHERE nombre = $1",
      [nombre]
    );
    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({
        error: `No se encontró un usuario con el nombre: ${nombre}`,
      });
    }
    const idUsuario = usuarioResult.rows[0].id_usuario;

    // 3. Obtener el id_deportista usando la tabla Deportistas
    const deportistaResult = await pool.query(
      "SELECT id_deportista FROM Deportistas WHERE id_usuario = $1",
      [idUsuario]
    );
    if (deportistaResult.rows.length === 0) {
      return res.status(404).json({
        error: `El usuario ${nombre} no está registrado como Deportista.`,
      });
    }
    const idDeportista = deportistaResult.rows[0].id_deportista;

    // 4. Construir la cláusula WHERE dinámica
    //    - Obviamente necesitamos filtrar por re.id_deportista = idDeportista
    //    - (Opcional) también filtrar por fechas en rutina_especifica (re.fecha).
    let whereClause = "WHERE re.id_deportista = $1";
    const params = [idDeportista];
    let paramIndex = 2; // El siguiente índice para los placeholders de SQL

    if (fechaInicio && fechaFin) {
      whereClause += ` AND re.fecha BETWEEN $${paramIndex} AND $${
        paramIndex + 1
      }`;
      params.push(fechaInicio, fechaFin);
      paramIndex += 2;
    } else if (fechaInicio) {
      whereClause += ` AND re.fecha >= $${paramIndex}`;
      params.push(fechaInicio);
      paramIndex++;
    } else if (fechaFin) {
      whereClause += ` AND re.fecha <= $${paramIndex}`;
      params.push(fechaFin);
      paramIndex++;
    }

    // 5. Construir el query principal
    //    - Hacemos JOIN con rutina_especifica para tener 'fecha' y filtrar por fechas
    //    - Agrupamos por la columna elegida (distancia o tamano_diana)
    const query = `
        SELECT ed.${groupBy} AS categoria,
               AVG(ed.promedio_por_flecha) AS puntaje_promedio,
               COUNT(*) AS total_ejercicios
          FROM ejercicio_disparo ed
          JOIN rutina_especifica re 
            ON re.id_rutina = ed.id_rutina_especifica
        ${whereClause}
        GROUP BY ed.${groupBy}
        ORDER BY ed.${groupBy} ASC
      `;

    // 6. Ejecutar la consulta
    const result = await pool.query(query, params);

    // 7. Formatear la salida para que el frontend la graficque fácilmente
    const labels = [];
    const data = [];

    result.rows.forEach((row) => {
      labels.push(row.categoria); // Ej: '18m', '70m' o '40cm', '60cm', etc.
      data.push(parseFloat(row.puntaje_promedio));
    });

    return res.json({
      deportista: nombre,
      labels,
      data,
      totalItems: data.length,
    });
  } catch (error) {
    console.error("Error en comparación de puntaje de disparo:", error);
    return res.status(500).json({
      error: "Ocurrió un error al procesar la solicitud",
    });
  }
};

// 3) Cantidad total de flechas lanzadas por un deportista
const getTotalFlechasLanzadas = async (req, res) => {
  try {
    const { nombre, fechaInicio, fechaFin } = req.query;

    // 1. Validar que exista 'nombre'
    if (!nombre) {
      return res.status(400).json({
        error: "Debe proporcionar el nombre del deportista",
      });
    }

    // 2. Buscar id_usuario
    const usuarioResult = await pool.query(
      "SELECT id_usuario FROM Usuarios WHERE nombre = $1",
      [nombre]
    );
    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({
        error: `No se encontró un usuario con el nombre: ${nombre}`,
      });
    }
    const idUsuario = usuarioResult.rows[0].id_usuario;

    // 3. Buscar id_deportista
    const deportistaResult = await pool.query(
      "SELECT id_deportista FROM Deportistas WHERE id_usuario = $1",
      [idUsuario]
    );
    if (deportistaResult.rows.length === 0) {
      return res.status(404).json({
        error: `El usuario ${nombre} no está registrado como Deportista.`,
      });
    }
    const idDeportista = deportistaResult.rows[0].id_deportista;

    // 4. Construir WHERE con rango de fechas (opcional)
    let whereClause = "WHERE re.id_deportista = $1";
    const params = [idDeportista];
    let paramIndex = 2;

    if (fechaInicio && fechaFin) {
      whereClause += ` AND re.fecha BETWEEN $${paramIndex} AND $${
        paramIndex + 1
      }`;
      params.push(fechaInicio, fechaFin);
      paramIndex += 2;
    } else if (fechaInicio) {
      whereClause += ` AND re.fecha >= $${paramIndex}`;
      params.push(fechaInicio);
      paramIndex++;
    } else if (fechaFin) {
      whereClause += ` AND re.fecha <= $${paramIndex}`;
      params.push(fechaFin);
      paramIndex++;
    }

    // 5. Consulta para sumar flechas
    const query = `
        SELECT COALESCE(SUM(ed.cantidad_flechas), 0) AS total_flechas
        FROM ejercicio_disparo ed
        JOIN rutina_especifica re ON re.id_rutina = ed.id_rutina_especifica
        ${whereClause}
      `;

    const result = await pool.query(query, params);
    const totalFlechas = parseInt(result.rows[0].total_flechas, 10);

    return res.json({
      deportista: nombre,
      totalFlechas,
    });
  } catch (error) {
    console.error("Error al obtener total de flechas lanzadas:", error);
    return res.status(500).json({
      error: "Ocurrió un error al procesar la solicitud",
    });
  }
};

// 4) Comparación del puntaje promedio entre dos o más deportistas
const comparePuntajeEntreDeportistas = async (req, res) => {
  try {
    /**
     * Esperamos algo como:
     * GET /api/analytics/compare-puntaje-deportistas?nombres=Juan,Ana,Pedro
     * &fechaInicio=2023-01-01&fechaFin=2023-03-31
     */
    const { nombres, fechaInicio, fechaFin } = req.query;
    if (!nombres) {
      return res.status(400).json({
        error:
          "Debe proporcionar uno o varios nombres de deportistas separados por coma.",
      });
    }

    // 1. Convertimos la lista de nombres en un array
    const listaNombres = nombres.split(",").map((n) => n.trim());

    // 2. Por cada nombre, buscamos el id_deportista
    const deportistaIds = [];
    for (let nombre of listaNombres) {
      // Buscar id_usuario
      const usuarioRes = await pool.query(
        "SELECT id_usuario FROM Usuarios WHERE nombre = $1",
        [nombre]
      );
      if (usuarioRes.rows.length === 0) {
        return res.status(404).json({
          error: `No se encontró un usuario con el nombre: ${nombre}`,
        });
      }
      const idUsuario = usuarioRes.rows[0].id_usuario;

      // Buscar id_deportista
      const deportistaRes = await pool.query(
        "SELECT id_deportista FROM Deportistas WHERE id_usuario = $1",
        [idUsuario]
      );
      if (deportistaRes.rows.length === 0) {
        return res.status(404).json({
          error: `El usuario ${nombre} no está registrado como Deportista.`,
        });
      }
      deportistaIds.push(deportistaRes.rows[0].id_deportista);
    }

    // 3. Construir WHERE con "id_deportista IN (...)"
    let whereClause = `WHERE re.id_deportista = ANY($1)`;
    const params = [deportistaIds];
    let paramIndex = 2;

    // Filtrado por fechas
    if (fechaInicio && fechaFin) {
      whereClause += ` AND re.fecha BETWEEN $${paramIndex} AND $${
        paramIndex + 1
      }`;
      params.push(fechaInicio, fechaFin);
      paramIndex += 2;
    } else if (fechaInicio) {
      whereClause += ` AND re.fecha >= $${paramIndex}`;
      params.push(fechaInicio);
      paramIndex++;
    } else if (fechaFin) {
      whereClause += ` AND re.fecha <= $${paramIndex}`;
      params.push(fechaFin);
      paramIndex++;
    }

    // 4. Consulta SQL para agrupar por (id_deportista, distancia, tamano_diana)
    const query = `
        SELECT re.id_deportista,
               ed.distancia,
               ed.tamano_diana,
               AVG(ed.promedio_por_flecha) AS puntaje_promedio
          FROM ejercicio_disparo ed
          JOIN rutina_especifica re 
            ON re.id_rutina = ed.id_rutina_especifica
        ${whereClause}
        GROUP BY re.id_deportista, ed.distancia, ed.tamano_diana
        ORDER BY ed.distancia, ed.tamano_diana, re.id_deportista
      `;

    const result = await pool.query(query, params);

    /**
     * 5. Estructuramos los datos.
     *    - Cada fila: { id_deportista, distancia, tamano_diana, puntaje_promedio }
     *    - Necesitamos la intersección de (distancia,tamano_diana) para TODOS los deportistas consultados.
     */

    // Para simplificar, haremos un mapeo:
    // combos["distancia|tamano_diana"] = {
    //   distancia,
    //   tamano_diana,
    //   puntajes: { [idDeportista1]: X, [idDeportista2]: Y, ... }
    // }
    const combos = {};

    for (const row of result.rows) {
      const key = `${row.distancia}|${row.tamano_diana}`;
      if (!combos[key]) {
        combos[key] = {
          distancia: row.distancia,
          tamano_diana: row.tamano_diana,
          puntajes: {},
        };
      }
      combos[key].puntajes[row.id_deportista] = parseFloat(
        row.puntaje_promedio
      );
    }

    // 6. Filtrar únicamente los combos que TODOS los deportistas tengan
    //    (la intersección). Es decir, combos donde combos[key].puntajes tenga
    //    N entradas, siendo N = deportistaIds.length
    const validCombos = [];
    for (const key in combos) {
      const puntajesObj = combos[key].puntajes;
      // Verificamos si existen todos los deportistas
      let todos = true;
      for (const dId of deportistaIds) {
        if (!puntajesObj[dId]) {
          todos = false;
          break;
        }
      }
      if (todos) {
        validCombos.push(combos[key]);
      }
    }

    // 7. Retornamos la data en un formato que el front pueda manejar
    //    Ejemplo:
    //    [
    //      {
    //        distancia: 18,
    //        tamano_diana: 60,
    //        puntajes: {
    //          "3": 8.5,    // deportista con id=3
    //          "5": 7.9     // deportista con id=5
    //        }
    //      },
    //      ...
    //    ]
    return res.json({
      deportistas: listaNombres,
      resultados: validCombos,
    });
  } catch (error) {
    console.error("Error comparando puntaje entre deportistas:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

// 5) Historial de asistencia y cantidad de ejercicios por deportista bajo un mismo entrenador
const getHistorialAsistenciaPorEntrenador = async (req, res) => {
  try {
    const { nombreEntrenador, fechaInicio, fechaFin } = req.query;
    if (!nombreEntrenador) {
      return res.status(400).json({
        error: "Debe proporcionar el nombre del entrenador.",
      });
    }

    // 1. Buscar id_usuario del entrenador
    const userRes = await pool.query(
      "SELECT id_usuario FROM Usuarios WHERE nombre = $1",
      [nombreEntrenador]
    );
    if (userRes.rows.length === 0) {
      return res.status(404).json({
        error: `No se encontró un usuario con el nombre: ${nombreEntrenador}`,
      });
    }
    const idUsuario = userRes.rows[0].id_usuario;

    // 2. Buscar id_entrenador
    const entrenadorRes = await pool.query(
      "SELECT id_entrenador FROM Entrenadores WHERE id_usuario = $1",
      [idUsuario]
    );
    if (entrenadorRes.rows.length === 0) {
      return res.status(404).json({
        error: `El usuario ${nombreEntrenador} no está registrado como Entrenador.`,
      });
    }
    const idEntrenador = entrenadorRes.rows[0].id_entrenador;

    // 3. Encontrar todos los deportistas de este entrenador
    //    (En tu base: la tabla Deportistas tiene un campo id_entrenador)
    const deportistasRes = await pool.query(
      "SELECT d.id_deportista, u.nombre AS nombre_deportista " +
        "FROM Deportistas d " +
        "JOIN Usuarios u ON d.id_usuario = u.id_usuario " +
        "WHERE d.id_entrenador = $1",
      [idEntrenador]
    );
    if (deportistasRes.rows.length === 0) {
      return res.json({
        entrenador: nombreEntrenador,
        deportistas: [],
      });
    }

    const deportistas = deportistasRes.rows;
    // Ej: [ { id_deportista: 10, nombre_deportista: 'Juan' }, ... ]

    // 4. Para cada deportista, contar rutinas o ejercicios en un rango
    //    - Podríamos contar entradas en ejercicio_disparo y ejercicio_fisico,
    //      unidas a su respectiva rutina (rutina_especifica / rutina_fisica),
    //      filtrando por fecha de la tabla de rutinas.
    //    - Por simplicidad, haré un EJEMPLO: contar TODAS las rutinas (específicas + físicas).

    // Generar un array de resultados
    const resultados = [];
    for (let dep of deportistas) {
      const { id_deportista, nombre_deportista } = dep;

      // 1) Construye la cláusula base de filtrado (por id_deportista, fechas, etc.)
      let baseWhere = "id_deportista = $1";
      const params = [id_deportista];
      let paramIndex = 2;

      if (fechaInicio && fechaFin) {
        baseWhere += ` AND fecha BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
        params.push(fechaInicio, fechaFin);
        paramIndex += 2;
      } else if (fechaInicio) {
        baseWhere += ` AND fecha >= $${paramIndex}`;
        params.push(fechaInicio);
        paramIndex++;
      } else if (fechaFin) {
        baseWhere += ` AND fecha <= $${paramIndex}`;
        params.push(fechaFin);
        paramIndex++;
      }

      // 2) Para rutina_especifica:
      const queryRutEspecifica = `
        SELECT COUNT(*)::int AS total_especificas
        FROM rutina_especifica
        WHERE ${baseWhere}
        `;
      const especRes = await pool.query(queryRutEspecifica, params);
      const totalEsp = especRes.rows[0].total_especificas;

      // 3) Para rutina_fisica:
      const queryRutFisica = `
        SELECT COUNT(*)::int AS total_fisicas
        FROM rutina_fisica
        WHERE ${baseWhere}
        `;
      const fisicaRes = await pool.query(queryRutFisica, params);
      const totalFis = fisicaRes.rows[0].total_fisicas;

      resultados.push({
        id_deportista,
        nombre_deportista,
        totalRutinasEspecificas: totalEsp,
        totalRutinasFisicas: totalFis,
        totalRutinas: totalEsp + totalFis,
      });
    }

    return res.json({
      entrenador: nombreEntrenador,
      rangoFechas: fechaInicio || fechaFin ? { fechaInicio, fechaFin } : null,
      deportistas: resultados,
    });
  } catch (error) {
    console.error("Error obteniendo historial de asistencia:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

// 6) Comparación del rendimiento en ejercicios físicos
const getRendimientoFisico = async (req, res) => {
  try {
    const { nombre, nombreEjercicio, fechaInicio, fechaFin } = req.query;

    if (!nombre || !nombreEjercicio) {
      return res.status(400).json({
        error:
          "Debe proporcionar el nombre del deportista y el nombreEjercicio.",
      });
    }

    // 1. Obtener id_deportista (similar a los otros casos)
    const usuarioRes = await pool.query(
      "SELECT id_usuario FROM Usuarios WHERE nombre = $1",
      [nombre]
    );
    if (usuarioRes.rows.length === 0) {
      return res.status(404).json({
        error: `No se encontró un usuario con el nombre: ${nombre}`,
      });
    }
    const idUsuario = usuarioRes.rows[0].id_usuario;

    const deportistaRes = await pool.query(
      "SELECT id_deportista FROM Deportistas WHERE id_usuario = $1",
      [idUsuario]
    );
    if (deportistaRes.rows.length === 0) {
      return res.status(404).json({
        error: `El usuario ${nombre} no está registrado como Deportista.`,
      });
    }
    const idDeportista = deportistaRes.rows[0].id_deportista;

    // 2. Encontrar el id_tipo_ejercicio basado en "nombreEjercicio"
    const tipoEjercicioRes = await pool.query(
      "SELECT id_tipo_ejercicio FROM tipo_ejercicio WHERE nombre = $1",
      [nombreEjercicio]
    );
    if (tipoEjercicioRes.rows.length === 0) {
      return res.status(404).json({
        error: `No se encontró un ejercicio físico llamado: ${nombreEjercicio}`,
      });
    }
    const idTipoEjEsp = tipoEjercicioRes.rows[0].id_tipo_ejercicio;

    // 3. Construir WHERE con id_deportista, id_tipo_ejercicio_especifico, fechas
    let whereClause =
      "WHERE rf.id_deportista = $1 AND ef.id_tipo_ejercicio = $2";
    const params = [idDeportista, idTipoEjEsp];
    let paramIndex = 3;

    if (fechaInicio && fechaFin) {
      whereClause += ` AND rf.fecha BETWEEN $${paramIndex} AND $${
        paramIndex + 1
      }`;
      params.push(fechaInicio, fechaFin);
      paramIndex += 2;
    } else if (fechaInicio) {
      whereClause += ` AND rf.fecha >= $${paramIndex}`;
      params.push(fechaInicio);
      paramIndex++;
    } else if (fechaFin) {
      whereClause += ` AND rf.fecha <= $${paramIndex}`;
      params.push(fechaFin);
      paramIndex++;
    }

    // 4. Consulta: unimos 'rutina_fisica' (fecha, id_deportista) y 'ejercicio_fisico'
    //    (tiempo, repeticiones, series, peso)
    const query = `
        SELECT rf.fecha,
               ef.tiempo,
               ef.repeticiones,
               ef.series,
               ef.peso
          FROM ejercicio_fisico ef
          JOIN rutina_fisica rf ON rf.id_rutina = ef.id_rutina_fisica
        ${whereClause}
        ORDER BY rf.fecha ASC
      `;

    const result = await pool.query(query, params);

    // 5. Formatear la respuesta. Por ejemplo, devolvemos un array de objetos
    //    con la fecha y los campos aplicables.
    const ejercicios = result.rows.map((row) => ({
      fecha: row.fecha,
      tiempo: row.tiempo,
      repeticiones: row.repeticiones,
      series: row.series,
      peso: row.peso,
    }));

    return res.json({
      deportista: nombre,
      ejercicio: nombreEjercicio,
      totalEntradas: ejercicios.length,
      datos: ejercicios,
    });
  } catch (error) {
    console.error("Error en getRendimientoFisico:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

// 7) Promedio de puntajes en ejercicios específicos por categoría/nivel
const getPromedioPuntajesPorCategoria = async (req, res) => {
  try {
    // Datos de entrada: nombreCategoria (por ej. "Principiante"), rango de fechas (opcional)
    const { nombreCategoria, fechaInicio, fechaFin } = req.query;
    if (!nombreCategoria) {
      return res.status(400).json({
        error: "Debe proporcionar la categoría o nivel de los deportistas.",
      });
    }

    // 1. Filtrar deportistas por su nivel_experiencia = nombreCategoria
    //    Unimos con rutina_especifica + ejercicio_disparo para obtener el puntaje
    let whereClause = "WHERE d.nivel_experiencia = $1";
    const params = [nombreCategoria];
    let paramIndex = 2;

    if (fechaInicio && fechaFin) {
      whereClause += ` AND re.fecha BETWEEN $${paramIndex} AND $${
        paramIndex + 1
      }`;
      params.push(fechaInicio, fechaFin);
      paramIndex += 2;
    } else if (fechaInicio) {
      whereClause += ` AND re.fecha >= $${paramIndex}`;
      params.push(fechaInicio);
      paramIndex++;
    } else if (fechaFin) {
      whereClause += ` AND re.fecha <= $${paramIndex}`;
      params.push(fechaFin);
      paramIndex++;
    }

    const query = `
        SELECT d.nivel_experiencia,
               AVG(ed.promedio_por_flecha) AS promedio_puntaje
          FROM Deportistas d
          JOIN rutina_especifica re ON re.id_deportista = d.id_deportista
          JOIN ejercicio_disparo ed ON ed.id_rutina_especifica = re.id_rutina
        ${whereClause}
        GROUP BY d.nivel_experiencia
      `;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.json({
        categoria: nombreCategoria,
        promedio_puntaje: 0,
        mensaje:
          "No se encontraron datos para esta categoría en el rango dado.",
      });
    }

    const row = result.rows[0];
    return res.json({
      categoria: row.nivel_experiencia,
      promedio_puntaje: parseFloat(row.promedio_puntaje),
    });
  } catch (error) {
    console.error("Error en getPromedioPuntajesPorCategoria:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

// 8) Cantidad de rutinas registradas (por tipo) durante un período (diario, semanal, mensual)
const getCantidadRutinasPorPeriodo = async (req, res) => {
  try {
    // Entrada: el "modo" (daily, weekly, monthly), fechaInicio, fechaFin
    const { modo = "daily", fechaInicio, fechaFin } = req.query;
    // Validar que existan ambas fechas, si se requiere
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: "Debe proporcionar fechaInicio y fechaFin",
      });
    }

    // Definir la función de agrupación temporal según 'modo'
    // En Postgres, se puede usar DATE_TRUNC('month', re.fecha) o 'week', 'day'
    let dateTruncArg;
    switch (modo) {
      case "weekly":
        dateTruncArg = "week";
        break;
      case "monthly":
        dateTruncArg = "month";
        break;
      default:
        dateTruncArg = "day";
    }

    // Consulta con UNION ALL para combinar rutinas específicas y físicas
    const query = `
        SELECT tipo_rutina, periodo, COUNT(*)::int as total
        FROM (
          SELECT 'especifica' AS tipo_rutina,
                 DATE_TRUNC('${dateTruncArg}', re.fecha) AS periodo
          FROM rutina_especifica re
          WHERE re.fecha BETWEEN $1 AND $2
          
          UNION ALL
          
          SELECT 'fisica' AS tipo_rutina,
                 DATE_TRUNC('${dateTruncArg}', rf.fecha) AS periodo
          FROM rutina_fisica rf
          WHERE rf.fecha BETWEEN $1 AND $2
        ) sub
        GROUP BY tipo_rutina, periodo
        ORDER BY periodo, tipo_rutina
      `;

    const result = await pool.query(query, [fechaInicio, fechaFin]);

    // Estructuramos la respuesta
    // Podríamos devolver un array de { periodo, tipo_rutina, total }
    // O un objeto: { [periodo]: { especifica: X, fisica: Y } }
    // Aquí haremos la segunda forma para ilustrar.
    const dataMap = {};
    for (const row of result.rows) {
      const periodKey = row.periodo.toISOString(); // o formateas la fecha
      if (!dataMap[periodKey]) {
        dataMap[periodKey] = { especifica: 0, fisica: 0 };
      }
      dataMap[periodKey][row.tipo_rutina] = row.total;
    }

    return res.json({
      modo,
      fechaInicio,
      fechaFin,
      resumen: dataMap,
    });
  } catch (error) {
    console.error("Error en getCantidadRutinasPorPeriodo:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

// 9) Comparación entre distancias más frecuentes y puntajes asociados
const getComparacionDistanciasFrecuentes = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    let whereClause = "";
    const params = [];
    let paramIndex = 1;

    if (fechaInicio && fechaFin) {
      whereClause = `WHERE re.fecha BETWEEN $${paramIndex} AND $${
        paramIndex + 1
      }`;
      params.push(fechaInicio, fechaFin);
      paramIndex += 2;
    } else if (fechaInicio) {
      whereClause = `WHERE re.fecha >= $${paramIndex}`;
      params.push(fechaInicio);
      paramIndex++;
    } else if (fechaFin) {
      whereClause = `WHERE re.fecha <= $${paramIndex}`;
      params.push(fechaFin);
      paramIndex++;
    }

    const query = `
        SELECT ed.distancia,
               COUNT(*)::int AS frecuencia,
               AVG(ed.promedio_por_flecha) AS puntaje_promedio
          FROM ejercicio_disparo ed
          JOIN rutina_especifica re ON re.id_rutina = ed.id_rutina_especifica
        ${whereClause}
        GROUP BY ed.distancia
        ORDER BY frecuencia DESC
        -- Podrías LIMITar si quieres solo las "top 5" distancias
      `;

    const result = await pool.query(query, params);
    return res.json({
      rangoFechas: fechaInicio || fechaFin ? { fechaInicio, fechaFin } : null,
      distancias: result.rows.map((r) => ({
        distancia: r.distancia,
        frecuencia: r.frecuencia,
        puntaje_promedio: parseFloat(r.puntaje_promedio),
      })),
    });
  } catch (error) {
    console.error("Error en getComparacionDistanciasFrecuentes:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

module.exports = {
  getEvolucionPuntaje,
  getComparacionPuntajeDisparo,
  getTotalFlechasLanzadas,
  comparePuntajeEntreDeportistas,
  getHistorialAsistenciaPorEntrenador,
  getRendimientoFisico,
  getPromedioPuntajesPorCategoria,
  getCantidadRutinasPorPeriodo,
  getComparacionDistanciasFrecuentes,
  // Podrías exportar más funciones aquí (comparaciones, distribuciones, etc.)
};
