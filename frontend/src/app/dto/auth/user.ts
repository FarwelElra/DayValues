export interface UserDto {
  name: string,
}

export class User implements UserDto {
  constructor(name: string) {
    this.name = name;
  }

  name: string;

}
