import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePersonalAccessTokensTable1771533429000 implements MigrationInterface {
    name = 'CreatePersonalAccessTokensTable1771533429000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "personal_access_tokens" (
            "id" BIGSERIAL NOT NULL,
            "tokenable_type" character varying NOT NULL,
            "tokenable_id" uuid NOT NULL,
            "name" character varying NOT NULL,
            "token" character varying(64) NOT NULL,
            "abilities" text,
            "last_used_at" TIMESTAMP,
            "expires_at" TIMESTAMP,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_personal_access_tokens_id" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_personal_access_tokens_token" UNIQUE ("token")
        )`);
        await queryRunner.query(`CREATE INDEX "IDX_personal_access_tokens_tokenable" ON "personal_access_tokens" ("tokenable_type", "tokenable_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_personal_access_tokens_tokenable"`);
        await queryRunner.query(`DROP TABLE "personal_access_tokens"`);
    }
}
