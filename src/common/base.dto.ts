import { ApiModelPropertyOptional } from '@nestjs/swagger';

// Swagger
const sw = {
  date: { type: String, example: new Date(Date.now()).toLocaleString() },
  id: { type: Number, example: 1 },
};

export class BaseDTO {
  @ApiModelPropertyOptional(sw.date)
  createdAt: Date;

  @ApiModelPropertyOptional(sw.date)
  updatedAt: Date;

  @ApiModelPropertyOptional(sw.id)
  id: number;
}
