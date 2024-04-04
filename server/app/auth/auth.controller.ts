import { Request, Response } from 'express';
import prisma from '../prisma_client.ts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../common/setupEnv.ts';
import { request } from 'http';

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

export const signup = async (req: Request, res: Response) => {};

export const login = async (req: Request, res: Response) => {
  // check if user exists in the first place
  if(await !doesUserExist(req.body.email)){throw new Error("No user exists")}

  // get information from request
  const email = req.body.email
  const inputPassword = req.body.password
  const user = await getUser(email)


  const match = bcrypt.compare(inputPassword, user?.password || 'none')

  if(!match){
    throw new Error("Wrong password. Try again.")
  }
  //unix time + duration
  var now = Date.now();

  //added an hour
  const payload = {email: email, exp: now+3600000, canPostEvents: user?.canPostEvents, isAdmin: user?.isAdmin}
  const jwt_token = jwt.sign(payload, env.JWT_TOKEN_SECRET, { algorithm: 'HS256' });

  res.send({'status':200, 'jwt':jwt_token});
  return;


};
