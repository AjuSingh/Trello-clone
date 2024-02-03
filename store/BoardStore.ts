import { Database, ID, storage } from '@/appwrite';
import { getTodosGroupedByColumns } from '@/lib/getTodosGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand'

interface BoardState {
    board: Board;
    searchString: string;
    newTaskInput: string;
    newTaskType: TypedColumn;
    image: File | null;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, typeId: TypedColumn) => void;
    setSearchString: (searchString: string) => void;
    deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
    setNewTaskInput: (input: string) => void;
    setNewTaskType: (type: TypedColumn) => void;
    setImage: (image: File | null) => void;
    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>()
    },
    getBoard: async () => {
        const board = await getTodosGroupedByColumns();
        set({ board })
    },
    setBoardState: (board) => set({ board }),
    updateTodoInDB: async (todo: Todo, typeId: TypedColumn) => {
        await Database.updateDocument(process.env.NEXT_PUBLIC_DATABASE_ID!, process.env.NEXT_PUBLIC_COLLECTION_ID!, todo.$id,
            {
                title: todo.title,
                status: typeId
            }
        )
    },
    searchString: "",
    setSearchString: (searchString: string) => {
        set({ searchString })
    },
    deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
        const { board } = get();
        const newColumns = new Map(board.columns);

        //delete todoID from new columns
        newColumns.get(id)?.todos.splice(taskIndex, 1);

        set({ board: { columns: newColumns } });

        if (todo.image) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
        }

        await Database.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_COLLECTION_ID!,
            todo.$id
        );
    },
    newTaskInput: "",
    setNewTaskInput: (input: string) => set({ newTaskInput: input }),
    newTaskType: "todo",
    setNewTaskType: (type: TypedColumn) => set({ newTaskType: type }),
    image: null,
    setImage: (image: File | null) => set({ image }),
    addTask: async (task: string, columnId: TypedColumn, image?: File | null) => {
        let file: Image | undefined;
        if (image) {
            const fileUploaded = await uploadImage(image);
            if (fileUploaded) {
                file = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id
                }
            }
        }

        const { $id } = await Database.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_COLLECTION_ID!,
            ID.unique(),
            {
                title: task,
                status: columnId,
                ...(file && { image: JSON.stringify(file) })
            }
        );

        set({ newTaskInput: "" });
        set((state) => {
            const newColumns = new Map(state.board.columns);
            const newTodo: Todo = {
                $id,
                title: task,
                $createdAt: new Date().toISOString(),
                status: columnId,
                ...(file && { image: file })
            }

            const column = newColumns.get(columnId);
            if (!column) {
                newColumns.set(columnId, {
                    id: columnId,
                    todos: [newTodo]
                });
            } else {
                newColumns.get(columnId)?.todos.push(newTodo);
            }

            return {
                board: {
                    columns: newColumns
                }
            }
        })
    }

}))