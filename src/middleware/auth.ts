import { Request } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import ApiError from '../utils/ApiError';
export type res = { status: number; message: string };
export async function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<any> {
  const token = request.body.token || request.query.token || request.headers['x-access-token'];

  if (securityName === 'jwt') {
    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
      }
      jwt.verify(token!, config.jwt.secret, function (err: any, decoded: any) {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
