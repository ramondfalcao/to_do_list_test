import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateTaskDto {
    @IsNotEmpty()
    @IsNotEmpty()
    @ApiProperty()
    id_user: number;

    @IsNotEmpty()
    @IsNotEmpty()
    @ApiProperty()
    description: string;
}
