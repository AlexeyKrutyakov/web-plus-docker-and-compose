export default () => ({
  server: {
    host: process.env.SERVER_HOST || 'http://127.0.0.1',
    port: parseInt(process.env.SERVER_PORT) || '3000',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'student',
    password: process.env.DB_PASSWORD || 'student',
    name: process.env.DB_NAME || 'kupipodariday',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'very-secret',
    ttl: process.env.JWT_TTL || '600000',
  },
});
