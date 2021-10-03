import { Controller, Example, Get, Response, Route, Security, SuccessResponse, Tags } from '@tsoa/runtime';
import { ErrorJSON } from 'src/interfaces/error';
import userService from '../services/user.service';
@Tags('Todo')
@Route('/v1')
export class UserController extends Controller {
  @Example([
    {
      id: '96a9a681-d737-493e-8f7e-d638fd13ecf4',
      name_task: 'fake name',
      description: 'fake task',
      date_of_completion: '2025-10-04T05:47:21.000Z',
      user: {
        username: 'fakename',
      },
      created_at: '2021-10-04T17:20:02.244Z',
      updated_at: '2021-10-04T17:20:02.244Z',
    },
  ])
  @Response<ErrorJSON>(400, 'List user not found')
  @SuccessResponse('200', 'Success')
  @Security('jwt')
  @Get('/get-all-user/')
  public async getAll() {
    const users = await userService.getAll();
    return users;
  }
}
