import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumberString, IsString, IsStrongPassword, Length } from "class-validator";

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class SignupRequestOTPDTO {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email!: string;
}

export class SignupDTO {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  full_name!: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email!: string;

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: "Password must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol",
    },
  )
  password!: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6, {
    message: "The number must be exactly 6 digits",
  })
  otp!: string;
}
