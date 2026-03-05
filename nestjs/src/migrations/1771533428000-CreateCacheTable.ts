import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCacheTable1771533428000 implements MigrationInterface {
    name = 'CreateCacheTable1771533428000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cache" (
            "key" character varying NOT NULL,
            "value" text NOT NULL,
            "expiration" integer NOT NULL,
            CONSTRAINT "PK_cache_key" PRIMARY KEY ("key")
        )`);

        await queryRunner.query(`CREATE TABLE "cache_locks" (
            "key" character varying NOT NULL,
            "owner" character varying NOT NULL,
            "expiration" integer NOT NULL,
            CONSTRAINT "PK_cache_locks_key" PRIMARY KEY ("key")
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cache_locks"`);
        await queryRunner.query(`DROP TABLE "cache"`);
    }
}
