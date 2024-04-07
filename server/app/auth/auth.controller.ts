import { Request, Response } from 'express';
import prisma from '../prisma_client.ts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../common/setupEnv.ts';
//Delete this line once you use the function
// @ts-ignore
async function doesUserExist(email: string): Promise<boolean> {
  /**
   * Check if user exists in the database
   * Potentially throws an error from Prisma
   * @param email string - email of the user
   */
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (user) {
    return true;
  }
  return false;
}
// Delete this line once you use the function
// @ts-ignore
async function getUser(email: string) {
  /**
   * Get user from the database
   * Potentially throws an error from Prisma
   * @param email string - email of the user
   */
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  return user;
}

//@ts-ignore
async function createUser(name: string, email: string, password: string) {
  /**
   * Create user in the database
   * Potentially throws an error from Prisma
   * @param name string - name of the user
   * @param email string - email of the user
   * @param password string - password of the user
   */
  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
    },
  });
  return newUser;
}

export const validateEmail = (email: string): boolean => {
  // Email validation regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the email matches the regex pattern
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Password validation logic
  // Example: Password must be at least 8 characters long
  // and contain at least 1 digit, 1 uppercase, and 1 lowercase character
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
};

export const validateUsername = (username: string): boolean => {
  // Username validation logic
  // Example: Username must be alphanumeric and between 3 to 20 characters long
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
  return usernameRegex.test(username);
};

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ errorMessage: 'Missing input field' });
  } else if (!validateUsername(name)) {
    res.status(400).json({ errorMessage: 'Username is invalid' });
  } else if (!validateEmail(email)) {
    res.status(400).json({ errorMessage: 'Email is invalid' });
  } else if (!validatePassword(password)) {
    res.status(400).json({ errorMessage: 'Password is invalid' });
  }
};

export const login = async (req: Request, res: Response) => {};
