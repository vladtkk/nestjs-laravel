import { registerAs } from '@nestjs/config';
import { Options } from 'argon2';

export default registerAs('argon2', (): Options & { type: number } => ({
  // Argon2id is the default (type 2)
  type: 2,
  memoryCost: parseInt(process.env.ARGON2_MEMORY_COST ?? '65536', 10), // 64 MB
  timeCost: parseInt(process.env.ARGON2_TIME_COST ?? '3', 10),
  parallelism: parseInt(process.env.ARGON2_PARALLELISM ?? '4', 10),
}));
