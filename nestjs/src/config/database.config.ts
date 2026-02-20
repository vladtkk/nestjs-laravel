import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'nestjs_laravel',
  // Never synchronize schema in production by default
  synchronize: process.env.NODE_ENV !== 'production' && process.env.DB_SYNCHRONIZE === 'true',
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
}));
