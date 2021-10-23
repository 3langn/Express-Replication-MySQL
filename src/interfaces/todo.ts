import TaskStatus from '../config/task';

interface ITodo {
  id?: string;
  userId: string;
  description: string;
  nameTask: string;
  dateOfCompletion: string;
  status?: TaskStatus;
}
interface ITodoResponse {
  id: number;
  name_task: string;
  description: string;
  date_of_completion: Date;
  status: string;
  user: {
    id: number;
    username: string;
  };
  created_at: Date;
  updated_at: Date;
}
export { ITodo, ITodoResponse };
