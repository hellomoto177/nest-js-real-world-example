import {MigrationInterface, QueryRunner} from "typeorm";

export class megaMigration1557670149664 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notes" ("id" SERIAL NOT NULL, "title" character varying, "content" character varying, "groupId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "groups" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags_notes" ("tagsId" integer NOT NULL, "notesId" integer NOT NULL, CONSTRAINT "PK_1e600d5a3a41a3ee57b643f26de" PRIMARY KEY ("tagsId", "notesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a511007ecc8ec562a9b2f11856" ON "tags_notes" ("tagsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8da69f2cc0f10a2406202cb0db" ON "tags_notes" ("notesId") `);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_07c1a3af20c8969e0a85d9c0b71" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tags_notes" ADD CONSTRAINT "FK_a511007ecc8ec562a9b2f118564" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tags_notes" ADD CONSTRAINT "FK_8da69f2cc0f10a2406202cb0db5" FOREIGN KEY ("notesId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tags_notes" DROP CONSTRAINT "FK_8da69f2cc0f10a2406202cb0db5"`);
        await queryRunner.query(`ALTER TABLE "tags_notes" DROP CONSTRAINT "FK_a511007ecc8ec562a9b2f118564"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_07c1a3af20c8969e0a85d9c0b71"`);
        await queryRunner.query(`DROP INDEX "IDX_8da69f2cc0f10a2406202cb0db"`);
        await queryRunner.query(`DROP INDEX "IDX_a511007ecc8ec562a9b2f11856"`);
        await queryRunner.query(`DROP TABLE "tags_notes"`);
        await queryRunner.query(`DROP TABLE "groups"`);
        await queryRunner.query(`DROP TABLE "notes"`);
        await queryRunner.query(`DROP TABLE "tags"`);
    }

}
