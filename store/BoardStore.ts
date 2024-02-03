import { Database, storage } from '@/appwrite';
import { getTodosGroupedByColumns } from '@/lib/getTodosGroupedByColumn';
import { create } from 'zustand'

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, typeId: TypedColumn) => void;
    searchString: string;
    setSearchString: (searchString: string) => void;
    deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
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
    }
}))