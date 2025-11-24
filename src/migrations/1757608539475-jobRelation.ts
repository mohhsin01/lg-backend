import { MigrationInterface, QueryRunner } from "typeorm";

export class JobRelation1757608539475 implements MigrationInterface {
    name = 'JobRelation1757608539475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "jobs" ("job_id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "status" character varying NOT NULL DEFAULT 'open', "job_salary" numeric, "location" character varying NOT NULL, "bd_id" integer, "assigned_dev_id" integer, CONSTRAINT "PK_75f2e130e4b1372fea0b6248a17" PRIMARY KEY ("job_id"))`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_9b2a70de3cfeb0b4101b5afbd1b" FOREIGN KEY ("bd_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_bd094d8cbef25d699d752ec131d" FOREIGN KEY ("assigned_dev_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_bd094d8cbef25d699d752ec131d"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_9b2a70de3cfeb0b4101b5afbd1b"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
    }

}
