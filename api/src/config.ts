const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

const optional = (key: string, fallback: string): string =>
  process.env[key] ?? fallback;

export const config = {
  nodeEnv: optional("NODE_ENV", "development"),
  port: Number(optional("PORT", "3002")),
  isProduction: optional("NODE_ENV", "development") === "production",

  db: {
    host: optional("PG_HOST", "localhost"),
    port: Number(optional("PG_PORT", "5432")),
    username: optional("PG_USER", "postgres"),
    password: optional("PG_PASSWORD", ""),
    database: optional("PG_DATABASE", "customers_db"),
  },

  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: optional("JWT_EXPIRES_IN", "5m"),
    refreshSecret: required("JWT_REFRESH_SECRET"),
    refreshExpiresIn: optional("JWT_REFRESH_EXPIRES_IN", "7d"),
  },

  admin: {
    email: optional("ADMIN_EMAIL", "admin@example.com"),
    password: optional("ADMIN_PASSWORD", "Admin1234!"),
  },

  clientUrl: optional("CLIENT_URL", "http://localhost:3000"),
};
