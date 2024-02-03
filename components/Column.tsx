import React, { useMemo } from 'react'
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { PlusCircleIcon } from '@heroicons/react/16/solid';
import TodoCard from './TodoCard';
import { useBoardStore } from '@/store/BoardStore';
import { useDebounce } from '@/hooks/useDebounce';

interface Props {
  id: TypedColumn;
  todos: Todo[];
  index: number;
}

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  done: 'Done',
  inprogress: 'In Progress',
  todo: 'Todo'
}

function Column({ id, index, todos }: Props) {
  const [searchString] = useBoardStore((state) => [state.searchString]);

  const query = useDebounce(searchString, 500);

  const filteredTodos = useMemo(() => {
    if (!searchString) return todos;
    return todos.filter((todo) => todo.title.toLowerCase().includes(searchString.toLowerCase()))
  }, [query, todos])

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          {/* Move Droppable component to wrap the droppable area */}
          <Droppable droppableId={index.toString()} type='card'>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`
                p-2
                rounded-2xl
                shadow-sm
                ${snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"}
              `}
              >
                <h2
                  className='flex justify-between font-bold text-xl p-2'
                >{idToColumnText[id]}
                  <span className='text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-normal'>
                    {filteredTodos.length}
                  </span>
                </h2>

                <div className='space-y-2'>
                  {filteredTodos.map((todo, index) => (
                    <Draggable
                      key={todo.$id}
                      draggableId={todo.$id}
                      index={index}
                    >
                      {(provided) => (
                        <TodoCard
                          todo={todo}
                          index={index}
                          id={id}
                          innerRef={provided.innerRef}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  <div className='flex flex-end justify-end p-2'>
                    <button className='text-green-500 hover:text-green-600'>
                      <PlusCircleIcon className='h-10 w-10' />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;