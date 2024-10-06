import { IsString } from "class-validator";

export class CreateNoteDto {
  @IsString()
  appointmentId: string;

  @IsString()
  description: string;

  @IsString()
  title: string;

  @IsString()
  type: string;

  @IsString()
  userId: string;
}

export class UpdateNoteDto extends CreateNoteDto {}
