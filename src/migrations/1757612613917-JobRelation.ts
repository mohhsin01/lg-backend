import { MigrationInterface, QueryRunner } from "typeorm";

export class JobRelation1757612613917 implements MigrationInterface {
    name = 'JobRelation1757612613917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_9b2a70de3cfeb0b4101b5afbd1b"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_bd094d8cbef25d699d752ec131d"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "bd_id"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "assigned_dev_id"`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD "dev_id" integer`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_9027c8f0ba75fbc1ac46647d043" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_9027c8f0ba75fbc1ac46647d043"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "dev_id"`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD "assigned_dev_id" integer`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD "bd_id" integer`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_bd094d8cbef25d699d752ec131d" FOREIGN KEY ("assigned_dev_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_9b2a70de3cfeb0b4101b5afbd1b" FOREIGN KEY ("bd_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
