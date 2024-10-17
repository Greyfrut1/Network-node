import { Request, Response } from 'express';

export const getHome = (req: Request, res: Response) => {
    res.send('Hello from TypeScript Node.js!');
};
