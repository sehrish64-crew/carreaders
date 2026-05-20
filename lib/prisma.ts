import { query, queryOne, createId } from "@/lib/db";

function quoteColumn(column: string) {
  return `\`${column}\``;
}

function buildWhere(where: Record<string, any> = {}) {
  const clauses: string[] = [];
  const params: any[] = [];

  for (const [key, value] of Object.entries(where)) {
    if (value === null) {
      clauses.push(`${quoteColumn(key)} IS NULL`);
      continue;
    }

    if (Array.isArray(value)) {
      const placeholders = value.map(() => "?").join(", ");
      clauses.push(`${quoteColumn(key)} IN (${placeholders})`);
      params.push(...value);
      continue;
    }

    clauses.push(`${quoteColumn(key)} = ?`);
    params.push(value);
  }

  if (!clauses.length) {
    return { clause: "", params };
  }

  return { clause: `WHERE ${clauses.join(" AND ")}`, params };
}

function buildSet(data: Record<string, any>) {
  const clauses: string[] = [];
  const params: any[] = [];

  for (const [key, value] of Object.entries(data)) {
    clauses.push(`${quoteColumn(key)} = ?`);
    params.push(value);
  }

  return { clause: clauses.join(", "), params };
}

function buildOrderBy(orderBy: Record<string, any> | undefined) {
  if (!orderBy) return "";
  const entries = Object.entries(orderBy);
  if (!entries.length) return "";
  const [key, value] = entries[0];
  const direction = String(value).toUpperCase() === "DESC" ? "DESC" : "ASC";
  return `ORDER BY ${quoteColumn(key)} ${direction}`;
}

async function insert(table: string, data: Record<string, any>) {
  const row = { ...data };
  row.id = row.id ?? createId();

  const columns = Object.keys(row).map(quoteColumn).join(", ");
  const values = Object.values(row);
  const placeholders = values.map(() => "?").join(", ");

  await query(`INSERT INTO ${quoteColumn(table)} (${columns}) VALUES (${placeholders})`, values);
  return row;
}

async function updateOne(table: string, where: Record<string, any>, data: Record<string, any>) {
  const { clause, params } = buildWhere(where);
  const set = buildSet(data);
  await query(`UPDATE ${quoteColumn(table)} SET ${set.clause} ${clause}`, [...set.params, ...params]);
  const idKey = Object.keys(where)[0];
  const idValue = where[idKey];
  return queryOne(`SELECT * FROM ${quoteColumn(table)} ${clause}`, params);
}

async function updateMany(table: string, where: Record<string, any>, data: Record<string, any>) {
  const { clause, params } = buildWhere(where);
  const set = buildSet(data);
  const result: any = await query(`UPDATE ${quoteColumn(table)} SET ${set.clause} ${clause}`, [...set.params, ...params]);
  return { count: result.affectedRows ?? 0 };
}

async function findMany(table: string, options: { where?: Record<string, any>; orderBy?: Record<string, any>; take?: number } = {}) {
  const { clause, params } = buildWhere(options.where);
  const order = buildOrderBy(options.orderBy);
  const limit = typeof options.take === "number" ? `LIMIT ${options.take}` : "";
  return query(`SELECT * FROM ${quoteColumn(table)} ${clause} ${order} ${limit}`.trim(), params);
}

async function count(table: string, where?: Record<string, any>) {
  const { clause, params } = buildWhere(where);
  const row = await queryOne(`SELECT COUNT(*) as count FROM ${quoteColumn(table)} ${clause}`.trim(), params);
  return Number(row?.count ?? 0);
}

const user = {
  async findUnique({ where }: { where: { id?: string; email?: string } }) {
    const key = where.id ? "id" : "email";
    const value = where.id ?? where.email;
    if (!key || value == null) return null;
    return queryOne(`SELECT * FROM ${quoteColumn("user")} WHERE ${quoteColumn(key)} = ?`, [value]);
  },

  async upsert({ where, update, create }: { where: { email?: string }; update: Record<string, any>; create: Record<string, any> }) {
    const existing = await user.findUnique({ where });
    if (existing) {
      if (Object.keys(update).length) {
        await updateOne("user", { email: where.email }, update);
      }
      return { ...existing, ...update };
    }

    return insert("user", create);
  },
};

const vehicle = {
  async findUnique({ where, include }: { where: { id: string }; include?: any }) {
    const vehicle = await queryOne(`SELECT * FROM ${quoteColumn("vehicle")} WHERE id = ?`, [where.id]);
    if (!vehicle) return null;

    if (include?.images) {
      vehicle.images = await query(`SELECT * FROM ${quoteColumn("vehicleimage")} WHERE vehicleId = ?`, [where.id]);
    }

    if (include?.detections) {
      vehicle.detections = await query(`SELECT * FROM ${quoteColumn("aidetection")} WHERE vehicleId = ? ORDER BY createdAt DESC`, [where.id]);
    }

    return vehicle;
  },

  async update({ where, data }: { where: { id: string }; data: Record<string, any> }) {
    await updateOne("vehicle", where, data);
    return vehicle.findUnique({ where, include: { images: true, detections: true } });
  },
};

const aiDetection = {
  async create({ data }: { data: Record<string, any> }) {
    return insert("aidetection", data);
  },

  async findMany({ where, orderBy }: { where: Record<string, any>; orderBy?: Record<string, any> }) {
    const results = await findMany("aidetection", { where, orderBy });
    return results;
  },
};

const healthAnalysis = {
  async create({ data }: { data: Record<string, any> }) {
    return insert("healthanalysis", data);
  },

  async findUnique({ where, include }: { where: { id: string }; include?: any }) {
    const analysis = await queryOne(`SELECT * FROM ${quoteColumn("healthanalysis")} WHERE id = ?`, [where.id]);
    if (!analysis) return null;

    if (include?.vehicle) {
      analysis.vehicle = await vehicle.findUnique({ where: { id: analysis.vehicleId }, include: include.vehicle?.include });
    }

    if (include?.notes) {
      analysis.notes = await query(`SELECT * FROM ${quoteColumn("adminnote")} WHERE analysisId = ? ORDER BY createdAt DESC`, [where.id]);
    }

    return analysis;
  },

  async update({ where, data }: { where: { id: string }; data: Record<string, any> }) {
    return updateOne("healthanalysis", where, data);
  },

  async findMany({ where, orderBy, take, include }: { where?: Record<string, any>; orderBy?: Record<string, any>; take?: number; include?: any } = {}) {
    const analyses = await findMany("healthanalysis", { where, orderBy, take });
    if (include?.vehicle) {
      for (const analysis of analyses) {
        analysis.vehicle = await vehicle.findUnique({ where: { id: analysis.vehicleId }, include: include.vehicle?.include });
      }
    }
    return analyses;
  },

  async count({ where }: { where?: Record<string, any> } = {}) {
    return count("healthanalysis", where);
  },
};

const payment = {
  async create({ data }: { data: Record<string, any> }) {
    return insert("payment", data);
  },

  async findMany({ where, orderBy, include, take }: { where?: Record<string, any>; orderBy?: Record<string, any>; include?: any; take?: number } = {}) {
    const payments = await findMany("payment", { where, orderBy, take });
    if (include?.user || include?.vehicle) {
      for (const paymentRow of payments) {
        if (include.user) {
          paymentRow.user = await queryOne(`SELECT * FROM ${quoteColumn("user")} WHERE id = ?`, [paymentRow.userId]);
        }
        if (include.vehicle) {
          paymentRow.vehicle = await queryOne(`SELECT * FROM ${quoteColumn("vehicle")} WHERE id = ?`, [paymentRow.vehicleId]);
        }
      }
    }
    return payments;
  },

  async updateMany({ where, data }: { where: Record<string, any>; data: Record<string, any> }) {
    return updateMany("payment", where, data);
  },

  async update({ where, data }: { where: { id: string }; data: Record<string, any> }) {
    return updateOne("payment", where, data);
  },

  async count({ where }: { where?: Record<string, any> } = {}) {
    return count("payment", where);
  },
};

export const prisma = {
  user,
  vehicle,
  healthAnalysis,
  aiDetection,
  payment,
};
