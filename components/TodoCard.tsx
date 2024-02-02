"use client"

import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from '@hello-pangea/dnd';
import { XCircleIcon } from '@heroicons/react/16/solid';
import React from 'react'

type Props = {
    todo: Todo;
    index: number;
    id: TypedColumn;
    innerRef: (element?: HTMLElement | null | undefined) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null
}

function TodoCard({ todo, dragHandleProps, draggableProps, id, index, innerRef }: Props) {
    return (
        <div className='bg-white rounded-md space-y-2 drop-shadow-md'
            {...dragHandleProps}
            {...draggableProps}
            ref={innerRef}>
            <div className='flex justify-between items-center p-5'>
                <p>{todo.title}</p>
                <button className='text-red-500 hover:text-red-600'>
                    <XCircleIcon className='ml-5 h-8 w-8' />
                </button>
            </div>

            {/* Add image here */}
        </div>
    )
}

export default TodoCard