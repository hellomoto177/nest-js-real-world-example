import {MigrationInterface, QueryRunner} from "typeorm";

export class updateSchema1557488957312 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "title" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "content" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "content" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "title" SET NOT NULL`);
    }

}
