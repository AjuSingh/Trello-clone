export const fetchSuggesstion = async (board: Board) => {
    const todos = formatTodosForAI(board);
    const defaultMessage = `Hi you have ${todos.inprogress} tasks in In Progress, ${todos.todo} tasks in Todo. Have a productive day.`
    try {
        const res = await fetch("api/generateSummary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ todos })
        });
        const GPTdata = await res.json();
        const { content } = GPTdata;
        return content;
    } catch (err: any) {
        console.log(err.message);
        return defaultMessage;
    }
}

const formatTodosForAI = (board: Board) => {
    const todos = Array.from(board.columns.entries());

    const flatArray = todos.reduce((map, [key, value]) => {
        map[key] = value.todos;
        return map;
    }, {} as { [key in TypedColumn]: Todo[] });

    //reduce to key: value(length)
    const flatArrayCounted = Object.entries(flatArray).reduce((map, [key, value]) => {
        map[key as TypedColumn] = value.length;
        return map;
    }, {} as { [key in TypedColumn]: number });

    return flatArrayCounted;
}