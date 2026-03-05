import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePasswordResetTokensTable1771533434000 implements MigrationInterface {
    name = 'CreatePasswordResetTokensTable1771533434000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_reset_tokens" (
            "email" character varying NOT NULL,
            "token" character varying NOT NULL,
            "created_at" TIMESTAMP,
            CONSTRAINT "PK_password_reset_tokens_email" PRIMARY KEY ("email")
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "password_reset_tokens"`);
    }
}
