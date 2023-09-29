import { createHash, randomBytes } from 'crypto';

export class Password {
  static async hashPassword(password: string): Promise<string> {
    // Generate a random salt
    const salt = randomBytes(16).toString('hex');

    // Hash the password with the salt
    const hashedPassword = await hashWithSalt(password, salt);

    // Combine the salt and hashed password for storage
    const storedPassword = `${salt}:${hashedPassword}`;
    
    return storedPassword;
  }

  static async comparePassword(plaintextPassword: string, storedPassword: string): Promise<boolean> {
    // Split the stored password into salt and hashed password
    const [salt, hashedPassword] = storedPassword.split(':');

    // Hash the plaintext password with the stored salt
    const hashedPlaintextPassword = await hashWithSalt(plaintextPassword, salt);

    // Compare the hashed passwords
    return hashedPlaintextPassword === hashedPassword;
  }
}

async function hashWithSalt(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');

    // Update the hash with the password and salt
    hash.update(password + salt);

    // Generate the hashed password
    const hashedPassword = hash.digest('hex');
    resolve(hashedPassword);
  });
}
