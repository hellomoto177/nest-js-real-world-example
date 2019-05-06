import {MigrationInterface, QueryRunner} from "typeorm";

export class feedback1556903449286 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "feedback" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "feedback" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD "updatedAt" date NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD "createdAt" date NOT NULL DEFAULT now()`);
    }

}
