interface Board {
    columns: Map<TypedColumn, Column>;

}

interface Column {
    id: TypedColumn;
    todos: Todo[];
}

interface Todo {
    $id: string;
    $createdAt: string;
    title: string;
    status: TypedColumn;
    image?: Image;
}

interface Image {
    bucketId: string;
    fileId: string;
}


interface User {
    $id: string;
    email: string;
    name: string;
}

type TypedColumn = "todo" | "inprogress" | "done"