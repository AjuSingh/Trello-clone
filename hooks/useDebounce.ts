import { useEffect, useState } from 'react'
export function useDebounce(searchString: string, delay: number) {
    const [value, setValue] = useState(searchString);

    useEffect(() => {
        const handler = setTimeout(() => {
            setValue(searchString);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [searchString, delay]);

    return value;
}