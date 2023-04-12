import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsEmail({}, { message: 'Invalid Email' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;
  name?: string;
  title: string;
  content: string;
}
