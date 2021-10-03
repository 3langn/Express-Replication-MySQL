import TaskStatus from '../config/task';

interface ITodo {
  id?: string;
  userId: string;
  description: string;
  nameTask: string;
  dateOfCompletion: string;
  status?: TaskStatus;
}
export default ITodo;
