import { Request, Response, NextFunction } from 'express';
import { ApiError, ValidationError, NotFoundError, ExternalApiError } from '../types';
import logger from '../utils/logger';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  logger.error(`Error in ${req.method} ${req.path}:`, error);

  let statusCode = 500;
  let message = 'Error interno del servidor';

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof ValidationError) {
    statusCode = 400;
    message = error.message;
  } else if (error instanceof NotFoundError) {
    statusCode = 404;
    message = error.message;
  } else if (error instanceof ExternalApiError) {
    statusCode = 502;
    message = error.message;
  } else if (error.name === 'SyntaxError') {
    statusCode = 400;
    message = 'JSON inválido en el body de la petición';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  logger.warn(`Route not found: ${req.method} ${req.path}`);
  
  res.status(404).json({
    success: false,
    error: {
      message: `Ruta no encontrada: ${req.method} ${req.path}`,
      statusCode: 404,
    },
  });
}
