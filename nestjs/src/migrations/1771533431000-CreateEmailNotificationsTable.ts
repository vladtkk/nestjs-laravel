import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmailNotificationsTable1771533431000 implements MigrationInterface {
    name = 'CreateEmailNotificationsTable1771533431000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_notifications" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "user_id" uuid NOT NULL,
            "subject" character varying NOT NULL,
            "body" text NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_570e676991953930f7813a4087e" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE INDEX "IDX_93532483582457e5b60e659c04" ON "email_notifications" ("user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_93532483582457e5b60e659c04"`);
        await queryRunner.query(`DROP TABLE "email_notifications"`);
    }
}
