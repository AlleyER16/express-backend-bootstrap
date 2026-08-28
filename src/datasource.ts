import fs from "fs";
import { types } from "pg";
import { DataSource } from "typeorm";

import entities from "./models";
import migrations from "./migrations";

import env from "./env";

// Configure pg to parse DECIMAL types to JavaScript numbers
types.setTypeParser(types.builtins.NUMERIC, (value) => parseFloat(value));
types.setTypeParser(types.builtins.FLOAT8, (value) => parseFloat(value));
types.setTypeParser(types.builtins.INT8, (value) => parseFloat(value));

const dataSource = new DataSource({
  type: env.db.type,
  url: env.db.url,
  ssl: env.db.ssl
    ? env.db.certificate
      ? {
          ca: fs.readFileSync(env.db.certificate).toString(),
        }
      : true
    : false,
  synchronize: false,
  entities,
  migrations,
});

export default dataSource;
