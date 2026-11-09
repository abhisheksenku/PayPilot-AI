import morgan from 'morgan';
import { Request, Response } from 'express';

export const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms');
