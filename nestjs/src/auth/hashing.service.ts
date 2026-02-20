import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { Options as Argon2Options } from 'argon2';

@Injectable()
export class HashingService {
  constructor(private readonly configService: ConfigService) {}

  async hash(plain: string): Promise<string> {
    const options = this.configService.get<Argon2Options>('argon2');
    return argon2.hash(plain, { ...options, raw: false });
  }

  async verify(hashed: string, plain: string): Promise<boolean> {
    return argon2.verify(hashed, plain);
  }
}
