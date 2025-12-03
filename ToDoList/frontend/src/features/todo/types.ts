export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Todo = {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  subtasks: Subtask[];
  syncing: boolean;
};


