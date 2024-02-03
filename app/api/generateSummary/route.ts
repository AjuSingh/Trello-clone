import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { todos } = await request.json();
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0.8,
        n: 1,
        stream: false,
        messages: [{
            role: 'system',
            content: 'When responding to user welcome the user with good morning ,evening according to user timezone and limit the message upto 200 characters'
        },
        {
            role: 'user',
            content: `Hi there please provide the summary of the following todos. Count how many todos are in each category like todo,done,inprogress, then tell the user to have productive day! Here is the data: ${JSON.stringify(todos)} `
        }
        ]
    });

    const { choices } = response;
    console.log(choices[0].message);
    return NextResponse.json(choices[0].message)

}