const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const cookieParser = require("cookie-parser");
const pool = require("../db"); // Importar configuración de la base de datos

module.exports = (app) => {
  app.use(cookieParser());
  app.use(
    session({
      store: new pgSession({
        pool, // Usa la conexión existente
        tableName: "session",
      }),
      secret: process.env.AUTH0_SECRET || "supersecret", // Clave secreta
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 día
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      },
    })
  );
};
