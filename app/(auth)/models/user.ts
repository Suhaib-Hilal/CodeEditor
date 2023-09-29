export default class User {
  id: string;
  username: string;
  email: string;
  password: string;

  constructor(id: string, username: string, email: string, password: string) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  toMap(): { id: string; username: string; email: string; password: string } {
    return {
      id: this.id,
      username: this.username,
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
      userData.username,
      userData.email,
      userData.password
    );
  }
}
