export default () => ({
  server: {
    host: process.env.SERVER_HOST || 'http://127.0.0.1',
    port: parseInt(process.env.SERVER_PORT) || '3000',
  },
  database: {
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER || 'student',
    password: process.env.POSTGRES_PASSWORD || 'student',
    name: process.env.POSTGRES_NAME || 'kupipodariday',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'very-secret',
    ttl: process.env.JWT_TTL || '600000',
  },
});
