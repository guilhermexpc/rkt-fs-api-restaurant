export default {
  client: "sqlite3",
  connection: {
    filename: "./src/database/database.db"
  },
  pool: {
    afterCreate: (conn: any, cb: any) => {
      conn.run("PRAGMA foreign_keys = ON", cb);
    }
  },

  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./src/database/migrations"
  },
  seeds: {
    extension: "ts",
    directory: "./src/database/seeds"
  }
};
