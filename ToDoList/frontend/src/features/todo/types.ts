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

// ✅ 폼에서 사용하는 상태를 공용 타입으로 분리
export type TodoFormState = {
  id: string;
  title: string;
  description: string;
  date: string;
  subtasks: Subtask[];
};
