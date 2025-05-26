import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateTaskDto {
    @ApiProperty()
    id_user: number;

    @IsNotEmpty()
    @ApiProperty()
    description: string;
}
