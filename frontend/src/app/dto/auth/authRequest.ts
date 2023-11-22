export interface AuthRequestDto {
  password: string
}

export class AuthRequest implements AuthRequest {
  constructor(password: string, username: string) {
    this.password = password;
    this.username = username;
  }

  password: string;
  username: string;

}
