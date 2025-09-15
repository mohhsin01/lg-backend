import { MigrationInterface, QueryRunner } from "typeorm";

export class Interviews1757880156609 implements MigrationInterface {
    name = 'Interviews1757880156609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "interviews" ("id" SERIAL NOT NULL, "round_no" integer NOT NULL, "date" date NOT NULL, "time" TIME NOT NULL, "status" character varying NOT NULL DEFAULT 'scheduled', "job_id" integer, "user_id" integer, CONSTRAINT "PK_fd41af1f96d698fa33c2f070f47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "interviews" ADD CONSTRAINT "FK_b4c7cd3eeb65058271b4716c7d9" FOREIGN KEY ("job_id") REFERENCES "jobs"("job_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interviews" ADD CONSTRAINT "FK_b6fa4e1fab2f948fb14c736cd7a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interviews" DROP CONSTRAINT "FK_b6fa4e1fab2f948fb14c736cd7a"`);
        await queryRunner.query(`ALTER TABLE "interviews" DROP CONSTRAINT "FK_b4c7cd3eeb65058271b4716c7d9"`);
        await queryRunner.query(`DROP TABLE "interviews"`);
    }

}
