import TaskStatus from '../config/task';
import { User } from '../entity/User';
import { Todo } from '../entity/Todo';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { createQueryBuilder } from 'typeorm';
import redisClient from '../config/redis';
import config from '../config/config';
import { ITodoResponse } from '../interfaces/todo';
import { Type } from 'typescript';
const addTodo = async (
  user: User,
  { dateOfCompletion, nameTask, description }: { dateOfCompletion: string; nameTask: string; description: string }
) => {
  try {
    checkDateValid(dateOfCompletion);
    const todo = Todo.create({
      date_of_completion: dateOfCompletion,
      name_task: nameTask,
      description,
      status: TaskStatus.New,
      user: user,
    });
    await todo.save();
    return todo.toJson();
  } catch (error) {
    let message = error.message;
    if (error.code === 'ER_DUP_ENTRY') {
      message = 'Todo name already exists';
    }
    throw new ApiError(httpStatus.BAD_REQUEST, message);
  }
};

const checkDateValid = (date: string) => {
  if (Date.parse(date) < Date.now()) {
    throw new Error('Date of completion must be greater than today');
  }
};

const updateTodo = async (todoId: string, data: any) => {
  try {
    const update = {
      ...data,
    };
    checkDateValid(update.date_of_completion);
    const todo = await findOneTodoById(todoId);

    if (todo.status === TaskStatus.Complete) {
      throw new Error(`Task ${todo.name_task} is completed`);
    }

    todo.name_task = update.name_task;
    todo.date_of_completion = update.date_of_completion;
    todo.description = update.description;
    todo.status = update.status;
    todo.user = update.user;
    await todo.save();
    return todo.toJson();
  } catch (error) {
    let message = error.message;
    if (error.code === 'ER_DUP_ENTRY') {
      message = 'Todo name already exists';
    }
    throw new ApiError(httpStatus.BAD_REQUEST, message);
  }
};

const removeTodo = async (todoId: string) => {
  try {
    const todo = await findOneTodoById(todoId);
    if (todo.status === TaskStatus.Complete) {
      throw new Error('This task has already been completed');
    }
    await todo.remove();
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

const findOneTodoById = async (todoId: string) => {
  const todo = await Todo.findOne({ where: { id: todoId } });
  if (!todo) {
    throw new ApiError(httpStatus.NOT_FOUND, `Could not find todo`);
  }
  return todo;
};

const setOrGetCache = <T>(key: string, cb: () => Promise<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (error: Error | null, data: string | null) => {
      if (error) {
        reject(error);
      }
      if (data) {
        resolve(JSON.parse(data));
      } else {
        cb()
          .then((result: T) => {
            redisClient.setex(key, config.redis.expires, JSON.stringify(result));
            resolve(result);
          })
          .catch((error: T) => {
            reject(error);
          });
      }
    });
  });
};

const getAll = async (): Promise<ITodoResponse[]> => {
  try {
    return setOrGetCache('listTodo', async (): Promise<ITodoResponse[]> => {
      let queryTodo = await createQueryBuilder('todos')
        .select(['todos', 'user.user_name'])
        .from(Todo, 'todos')
        .leftJoin('todos.user', 'user')
        .getMany();

      if (queryTodo.length <= 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'List Todo is empty');
      }
      const resList: ITodoResponse[] = queryTodo.map((todo) => todo.toJson());

      return resList;
    });
  } catch (error) {
    console.log(error);

    let code = httpStatus.BAD_REQUEST;
    let message = 'An error occurred';
    if (error.statusCode) {
      code = error.statusCode;
      message = error.message;
    }
    throw new ApiError(code, message);
  }
};

const getTodo = async (todoId: string) => {
  try {
    const todo = await createQueryBuilder('todos')
      .select(['todos', 'user.user_name', 'user.id'])
      .from(Todo, 'todos')
      .where('todos.id = :id', { id: todoId })
      .leftJoin('todos.user', 'user')
      .getOne();
    if (!todo) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Todo not found');
    }
    return todo;
  } catch (error) {
    console.log(error);

    let code = httpStatus.BAD_REQUEST;
    let message = 'An error occurred';
    if (error.code === 'EntityNotFoundError') {
      code = httpStatus.NOT_FOUND;
      message = '';
    }
    if (error.statusCode) {
      code = error.statusCode;
      message = error.message;
    }
    throw new ApiError(code, message);
  }
};

const assignTodo = async (todoId: string, user: User, signupUserId: string) => {
  try {
    const todo = await getTodo(todoId);

    if (todo.user.id === user.id || todo.user.id === parseInt(signupUserId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User assign invalid');
    }
    todo.user = user;
    await todo.save();
    const assignedTodo = todo.toJson();

    return assignedTodo;
  } catch (error) {
    console.log(error);

    let code = httpStatus.BAD_REQUEST;
    let message = 'An error occurred';
    if (error.statusCode) {
      code = error.statusCode;
      message = error.message;
    }

    throw new ApiError(code, message);
  }
};

export default { addTodo, updateTodo, removeTodo, getAll, getTodo, assignTodo };
