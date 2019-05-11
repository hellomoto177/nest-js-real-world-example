import {MigrationInterface, QueryRunner} from "typeorm";

export class updateSchema1557489969120 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_07c1a3af20c8969e0a85d9c0b71"`);
        await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "groupId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_07c1a3af20c8969e0a85d9c0b71" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_07c1a3af20c8969e0a85d9c0b71"`);
        await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "groupId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_07c1a3af20c8969e0a85d9c0b71" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
