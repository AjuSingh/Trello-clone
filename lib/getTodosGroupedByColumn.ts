import { Database } from "@/appwrite"




export const getTodosGroupedByColumns = async () => {
    const data = await Database.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID!, process.env.NEXT_PUBLIC_COLLECTION_ID!);

    const todos = data.documents;
    const columns = todos.reduce((acc, todo) => {
        if (!acc.get(todo.status)) {
            acc.set(todo.status, {
                id: todo.status,
                todos: []
            })
        }

        acc.get(todo.status)!.todos.push({
            $id: todo.$id,
            $createdAt: todo.$createdAt,
            title: todo.title,
            status: todo.status,
            ...(todo.image && { image: JSON.parse(todo.image) })
        })

        return acc;
    }, new Map<TypedColumn, Column>())

    const colTypes: TypedColumn[] = ['todo', "inprogress", "done"];
    for (const col of colTypes) {
        if (!columns.get(col)) {
            columns.set(col,
                {
                    id: col,
                    todos: []
                }
            )
        }
    }

    const sortColumns = new Map(
        Array.from(columns.entries()).sort((a,b)=>{
            return colTypes.indexOf(a[0]) - colTypes.indexOf(b[0]);
        })
    )

    const board:Board = {
        columns : sortColumns,
    }

    return board;
}