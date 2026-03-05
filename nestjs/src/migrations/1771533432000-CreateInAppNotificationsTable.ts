import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInAppNotificationsTable1771533432000 implements MigrationInterface {
    name = 'CreateInAppNotificationsTable1771533432000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "in_app_notifications" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "user_id" uuid NOT NULL,
            "message" text NOT NULL,
            "is_read" boolean NOT NULL DEFAULT false,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_0664e83c7064d7f57a3e792c3a5" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE INDEX "IDX_5928d29864b449f87f94101e47" ON "in_app_notifications" ("user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_5928d29864b449f87f94101e47"`);
        await queryRunner.query(`DROP TABLE "in_app_notifications"`);
    }
}
