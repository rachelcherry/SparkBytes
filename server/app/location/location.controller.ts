import { Request, Response } from 'express';
import prisma from '../prisma_client.ts';

export const get_locations = async (_: Request, res: Response) => {
  try {
    const locations = await prisma.location.findMany();
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
