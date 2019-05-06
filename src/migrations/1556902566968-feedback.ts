import {MigrationInterface, QueryRunner} from "typeorm";

export class feedback1556902566968 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "feedback" ("id" SERIAL NOT NULL, "authorName" character varying(100) NOT NULL, "authorDescription" character varying(300) NOT NULL, "text" text NOT NULL, "isPublished" boolean NOT NULL, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "feedback"`);
    }

}
