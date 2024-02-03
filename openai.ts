import OpenAI from "openai";

const openai = new OpenAI({
    organization: process.env.NEXT_PUBLIC_OPEN_API_ORG,
    apiKey: process.env.NEXT_PUBLIC_OPEN_API_KEY
});


export default openai;