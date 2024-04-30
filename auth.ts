import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
async function createUser(name:string,email: string, password: string): Promise<User | null> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Generate a salted and hashed password
    const user = await sql<User>`INSERT INTO users (name,email, password) VALUES (${name},${email}, ${hashedPassword}) RETURNING *`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error('Failed to create user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret:process.env.AUTH_SECRET,
  providers: [
    Credentials({
      async authorize(credentials) {
        if(credentials.action=='signin'){
        const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(6) })
        .safeParse(credentials);

      if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        
        if (!user) return null;
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) return user;
      }
      console.log('Invalid credentials');
      return null;
    }else{
      const parsedCredentials = z
      .object({ name: z.string(),email: z.string().email(), password: z.string().min(6) })
      .safeParse(credentials);

    if (parsedCredentials.success) {
      const { name,email, password } = parsedCredentials.data;
      const existingUser = await getUser(email);

      if (existingUser) {
        console.log('User already exists');
        return null;
      }

      // Create new user
      const newUser = await createUser(name,email, password);
      if (newUser) {
        return newUser;
      } else {
        console.log('Failed to create user');
        return null;
      }
    }else {
      console.log('Invalid credentials');
      return null;
    }
  }

      },
    }),
  ],
});