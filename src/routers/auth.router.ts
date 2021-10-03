import userService from '../services/user.service';
import tokenService from '../services/token.service';
import { Controller, Post, Route, Tags, Body, Example, Response } from 'tsoa';
import { ErrorJSON } from '../interfaces/error';
import authService from '../services/auth.service';
import IUser from '../interfaces/user';

@Tags('Auth')
@Route('/v1')
export class AuthController extends Controller {
  /**
   * @example body {
   *   "username": "fakename",
   *   "password": "password"
   *   }
   */
  @Example({
    access: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YzE3NTQ2OC00YTc4LTRmNzMtYWEwNC1lY2M1MTUxMzE4ZGMiLCJpYXQiOjE2MzMzNTEyODYsImV4cCI6MTYzMzM1MzA4NiwidHlwZSI6ImFjY2VzcyJ9.m5TPLskC2dRk1Thk20QwhIM2zMKO1NsRdK1VdyLNryg',
      expires: '2021-10-04T13:11:26.143Z',
    },
    refresh: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YzE3NTQ2OC00YTc4LTRmNzMtYWEwNC1lY2M1MTUxMzE4ZGMiLCJpYXQiOjE2MzMzNTEyODYsImV4cCI6MTYzNTk0MzI4NiwidHlwZSI6InJlZnJlc2gifQ.JM3kUORqmEWSwZvkJzqHCk7Vo0pa57h5hfOQ2Wx3FGw',
      expires: '2021-11-03T12:41:26.157Z',
    },
  })
  @Response<ErrorJSON>(400, 'Bad Request', {
    code: 400,
    message: 'Username already exists',
  })
  @Post('/sign-up/')
  public async register(@Body() body: IUser) {
    try {
      const { username, password } = body;

      const user = await userService.createUser(username, password);
      const token = await tokenService.generateAuthToken(user);
      return token;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * @example body {
   *   "username": "fakename",
   *   "password": "password"
   *   }
   */
  @Example({
    access: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YzE3NTQ2OC00YTc4LTRmNzMtYWEwNC1lY2M1MTUxMzE4ZGMiLCJpYXQiOjE2MzMzNTEyODYsImV4cCI6MTYzMzM1MzA4NiwidHlwZSI6ImFjY2VzcyJ9.m5TPLskC2dRk1Thk20QwhIM2zMKO1NsRdK1VdyLNryg',
      expires: '2021-10-04T13:11:26.143Z',
    },
    refresh: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YzE3NTQ2OC00YTc4LTRmNzMtYWEwNC1lY2M1MTUxMzE4ZGMiLCJpYXQiOjE2MzMzNTEyODYsImV4cCI6MTYzNTk0MzI4NiwidHlwZSI6InJlZnJlc2gifQ.JM3kUORqmEWSwZvkJzqHCk7Vo0pa57h5hfOQ2Wx3FGw',
      expires: '2021-11-03T12:41:26.157Z',
    },
  })
  @Response<ErrorJSON>(401, 'Bad Request', {
    code: 401,
    message: 'Password is incorrect',
  })
  @Response<ErrorJSON>(400, 'Bad Request', {
    code: 400,
    message: 'User not found',
  })
  @Post('/sign-in/')
  public async login(@Body() body: IUser) {
    const { username, password } = body;
    const user = await authService.loginUserWithUsernameAndPassword(username, password);
    const token = await tokenService.generateAuthToken(user);
    return token;
  }
}
