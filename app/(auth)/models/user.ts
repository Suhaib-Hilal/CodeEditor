export default class User {
  id: string;
  email: string;
  password: string;

  constructor(id: string, email: string, password: string) {
    this.id = id;
    this.email = email;
    this.password = password;
  }

  toMap(): { id: string; email: string; password: string } {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
    };
  }

  static fromMap(userData: {
    id: string;
    username: string;
    email: string;
    password: string;
  }): User {
    return new User(
      userData.id,
      userData.email,
      userData.password
    );
  }
}
