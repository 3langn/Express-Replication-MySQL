import todoService from '../services/todo.service';
import userService from '../services/user.service';
import {
  Route,
  Tags,
  SuccessResponse,
  Controller,
  Post,
  Body,
  Put,
  Delete,
  Get,
  Response,
  Example,
  Security,
  Request,
  Path,
} from 'tsoa';
import { ErrorJSON } from '../interfaces/error';
import ITodo from '../interfaces/todo';

@Tags('Todo')
@Route('/v1')
export class TodoController extends Controller {
  /**
   * @example body {
   * "userId": "16f42f4b-2133-48b8-a31a-264909e8b034",
   * "description":"fake description",
   * "nameTask": "fakename",
   * "dateOfCompletion": "2025-10-04 12:47:21.461366"
   * }
   */
  @Example({
    message: 'Add todo successfulllly',
    data: {
      id: 'a4026125-ecc4-467f-8112-af1741d3f7a9',
      name_task: 'fakename',
      description: 'fake description',
      date_of_completion: '2025-10-04 12:47:21.461366',
      status: 'NEW',
      user: {
        id: '4c86fa54-bc50-40d7-b7e4-8d760e8b6901',
        username: 'mnguyen',
      },
      created_at: '2021-10-04T11:14:33.988Z',
      updated_at: '2021-10-04T11:14:33.988Z',
    },
  })
  @Response<ErrorJSON>(400, 'Bad Request', {
    code: 400,
    message: 'Todo name already exists',
  })
  @Response<ErrorJSON>(404, 'Not found', {
    code: 404,
    message: 'User not found',
  })
  @SuccessResponse('201', 'Created')
  @Security('jwt')
  @Post('/add-to-do/')
  public async addTodo(@Body() body: ITodo) {
    this.setStatus(201);

    const userId = body.userId;
    const user = await userService.findOneUserById(userId);
    const todo = await todoService.addTodo(user, { ...body });
    return { message: 'Add todo successfulllly', data: todo };
  }

  /**
   * @example id "e77ef155-bd12-46f0-8559-bf55f6dd4c63"
   * @example body {
   * "date_of_completion":"2025-10-03T08:37:16.197Z",
   * "name_task":"Do homework",
   * "description":"fake description",
   * "status":"COMPLETE",
   * "userId":"cacc359c-5c32-46c8-9ea9-94d985119c6a"
   * }
   */
  @Example({
    message: 'Todo has been updated successfully',
    data: {
      id: '4170d00f-6e07-40ca-9cd9-a21515a284cc',
      name_task: 'Do homework',
      description: 'fake description',
      date_of_completion: '2021-10-03T08:37:16.197Z',
      status: 'COMPLETE',
      user: {
        id: '1fff4601-453b-4b8a-ada1-04d7cb4064c8',
        username: 'fakeusername',
      },
      created_at: '2021-10-04T09:26:18.218Z',
      updated_at: '2021-10-04T11:24:56.000Z',
    },
  })
  @Response<ErrorJSON>(404, 'Not found', {
    code: 404,
    message: 'Todo not found',
  })
  @Security('jwt')
  @Put('/update-to-do/{id}/')
  public async updateTodo(@Path('id') id: string, @Body() body: ITodo) {
    try {
      const todoId = id;
      const userId = body.userId;

      const user = await userService.findOneUserById(userId);
      const data = { ...body, user };

      const todo = await todoService.updateTodo(todoId, data);
      return { message: 'Todo has been updated successfully', data: todo };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  /**
   * @example id "e77ef155-bd12-46f0-8559-bf55f6dd4c63"
   */
  @Example({ message: 'Todo has been removed' })
  @Response<ErrorJSON>(404, 'Not found', {
    code: 404,
    message: 'Todo not found',
  })
  @Security('jwt')
  @Delete('/remove-to-do/{id}/')
  public async removeTodo(@Path('id') id: string) {
    const todoId = id;
    await todoService.removeTodo(todoId);
    return { message: 'Todo has been removed' };
  }

  @Response<ErrorJSON>(404, 'Not found', {
    code: 404,
    message: 'List todo is empty',
  })
  @Security('jwt')
  @Get('/get-all-to-do/')
  public async getAll() {
    const listTodo = await todoService.getAll();
    return listTodo;
  }

  @Response<ErrorJSON>(404, 'Not found', {
    code: 404,
    message: 'Todo not found',
  })
  @Security('jwt')
  @Get('/get-to-do-by-id/{id}/')
  public async getTodo(@Path('id') id: string) {
    const todoId = id;
    const todo = await todoService.getTodo(todoId);
    return todo.toJson();
  }

  @Response<ErrorJSON>(404, 'Not found', {
    code: 404,
    message: 'Todo not found',
  })
  @Response<ErrorJSON>(400, 'Bad Request', {
    code: 400,
    message: 'User assign invalid',
  })
  @Security('jwt')
  @Post('/assign-to-do/{id}/')
  public async assignTodo(@Request() request: any, @Path('id') id: string, @Body() body: { userId: string }) {
    const todoId = id;
    const signupUserId = request.sub;

    const user = await userService.findOneUserById(body.userId);
    const todo = await todoService.assignTodo(todoId, user, signupUserId);
    return todo;
  }
}
