import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTodosTable1771533430000 implements MigrationInterface {
    name = 'CreateTodosTable1771533430000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todos" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "title" character varying NOT NULL,
            "status" character varying NOT NULL DEFAULT 'pending',
            "user_id" uuid NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_ca860d2da940f09a4d2c0b430c2" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE INDEX "IDX_7447605d3b666a7b218408f090" ON "todos" ("user_id")`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "FK_7447605d3b666a7b218408f090d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "FK_7447605d3b666a7b218408f090d"`);
        await queryRunner.query(`DROP INDEX "IDX_7447605d3b666a7b218408f090"`);
        await queryRunner.query(`DROP TABLE "todos"`);
    }
}
