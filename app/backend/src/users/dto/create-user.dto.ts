import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty()
  password: string;
}
