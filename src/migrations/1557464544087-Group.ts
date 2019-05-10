import {MigrationInterface, QueryRunner} from "typeorm";

export class Group1557464544087 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "groups" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "groups"`);
    }

}
