import { IsString } from "class-validator";

export class CreateDoctorDto {
  @IsString()
  bio: string;

  @IsString()
  name: string;

  @IsString()
  professionId: string;

  @IsString()
  userId: string;
}

export class UpdateDoctorDto extends CreateDoctorDto {}
