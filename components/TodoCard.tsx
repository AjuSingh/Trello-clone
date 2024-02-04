"use client"

import getUrl from '@/lib/getUrl';
import { useAuthModalStore } from '@/store/AuthModal';
import { useAuthStore } from '@/store/AuthStore';
import { useBoardStore } from '@/store/BoardStore';
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from '@hello-pangea/dnd';
import { XCircleIcon } from '@heroicons/react/16/solid';
import { getURL } from 'next/dist/shared/lib/utils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

type Props = {
    todo: Todo;
    index: number;
    id: TypedColumn;
    innerRef: (element?: HTMLElement | null | undefined) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null
}

function TodoCard({ todo, dragHandleProps, draggableProps, id, index, innerRef }: Props) {

    const deleteTask = useBoardStore((state) => state.deleteTask);
    const [imageUrl, setImageUrl] = useState<string | null>("");
    const user = useAuthStore((state) => state.user);
    const openAuthModal = useAuthModalStore((state) => state.openModal)

    const handleDeletTask = () => {
        if (!user) {
            openAuthModal()
            return;
        }
        deleteTask(index, todo, id)
    }

    useEffect(() => {
        if (todo.image) {
            const fetchImage = async () => {
                const url = await getUrl(todo.image!);
                if (url) {
                    setImageUrl(url.toString());
                }
            }

            fetchImage()
        }
    }, [todo])

    return (
        <div className='bg-white rounded-md space-y-2 drop-shadow-md'
            {...dragHandleProps}
            {...draggableProps}
            ref={innerRef}>
            <div className='flex justify-between items-center p-5'>
                <p>{todo.title}</p>
                <button onClick={handleDeletTask} className='text-red-500 hover:text-red-600'>
                    <XCircleIcon className='ml-5 h-8 w-8' />
                </button>
            </div>

            {/* Add image here */}

            {imageUrl && (
                <div className='h-full w-full rounded-b-md'>
                    <Image
                        src={imageUrl}
                        alt="Task image"
                        width={400}
                        height={200}
                        className='w-full object-contain rounded-b-md'
                    />
                </div>
            )}
        </div>
    )
}

export default TodoCard