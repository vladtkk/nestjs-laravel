import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobsTable1771533433000 implements MigrationInterface {
    name = 'CreateJobsTable1771533433000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "jobs" (
            "id" BIGSERIAL NOT NULL,
            "queue" character varying NOT NULL,
            "payload" text NOT NULL,
            "attempts" smallint NOT NULL,
            "reserved_at" integer,
            "available_at" integer NOT NULL,
            "created_at" integer NOT NULL,
            CONSTRAINT "PK_jobs_id" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE INDEX "IDX_jobs_queue" ON "jobs" ("queue")`);

        await queryRunner.query(`CREATE TABLE "job_batches" (
            "id" character varying NOT NULL,
            "name" character varying NOT NULL,
            "total_jobs" integer NOT NULL,
            "pending_jobs" integer NOT NULL,
            "failed_jobs" integer NOT NULL,
            "failed_job_ids" text NOT NULL,
            "options" text,
            "cancelled_at" integer,
            "created_at" integer NOT NULL,
            "finished_at" integer,
            CONSTRAINT "PK_job_batches_id" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE TABLE "failed_jobs" (
            "id" BIGSERIAL NOT NULL,
            "uuid" character varying NOT NULL,
            "connection" text NOT NULL,
            "queue" text NOT NULL,
            "payload" text NOT NULL,
            "exception" text NOT NULL,
            "failed_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_failed_jobs_id" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_failed_jobs_uuid" UNIQUE ("uuid")
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "failed_jobs"`);
        await queryRunner.query(`DROP TABLE "job_batches"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
    }
}
