import {MigrationInterface, QueryRunner} from "typeorm";

export class feedback1557074542221 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "feedback" ALTER COLUMN "isPublished" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "feedback" ALTER COLUMN "isPublished" DROP DEFAULT`);
    }

}
