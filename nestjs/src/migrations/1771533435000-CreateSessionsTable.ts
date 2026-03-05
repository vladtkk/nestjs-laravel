import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSessionsTable1771533435000 implements MigrationInterface {
    name = 'CreateSessionsTable1771533435000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sessions" (
            "id" character varying NOT NULL,
            "user_id" uuid,
            "ip_address" character varying(45),
            "user_agent" text,
            "payload" text NOT NULL,
            "last_activity" integer NOT NULL,
            CONSTRAINT "PK_sessions_id" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE INDEX "IDX_sessions_user_id" ON "sessions" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_sessions_last_activity" ON "sessions" ("last_activity")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_sessions_last_activity"`);
        await queryRunner.query(`DROP INDEX "IDX_sessions_user_id"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
    }
}
