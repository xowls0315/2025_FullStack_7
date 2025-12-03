import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Todo } from "@/src/features/todo/types";
import { SortableTodo } from "@/src/features/todo/SortableTodo";

type Props = {
  todos: Todo[];
  filteredTodos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onSubtaskToggle: (todoId: string, subId: string) => void;
  onReorder: (activeId: string | number, overId: string | number) => void;
};

export const TodoList = ({ todos, filteredTodos, onToggle, onDelete, onEdit, onSubtaskToggle, onReorder }: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onReorder(active.id, over.id);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={todos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
        <ul className="mt-6 space-y-3">
          {filteredTodos.length === 0 && (
            <li className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-zinc-700 dark:text-zinc-400">선택한 날짜의 Todo가 없습니다.</li>
          )}
          {filteredTodos.map((todo) => (
            <SortableTodo key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} onSubtaskToggle={onSubtaskToggle} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};
