// import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import axios from 'axios'; // Ensure axios is installed

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Make sure your API key is set in environment variables

const instructionMessage = {
    role: "system",
    content: "Act as an expert travel agent. I will give you a location and number of days, give me a complete trip for those days in the form of a table. Give me day-wise breakdown and include bars, clubs, hikes, and other attractions that I can visit. Give this in a markdown format."
};

export async function POST(req) {
    try {
        // const { userId } = auth();

        const body = await req.json();
        const { messages } = body;

        console.log(messages, "from messages in api");
        console.log(instructionMessage, "from instruction Message in api");

        // Create the content structure for Gemini API
        const content = {
            contents: [
                {
                    parts: [
                        {
                            text: instructionMessage.content
                        },
                        ...messages.map(msg => ({ text: msg.content })) // assuming messages are in the same structure
                    ]
                }
            ]
        };

        // New: Replace OpenAI API call with Gemini API call
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, content, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log(response.data, "from router.js");
        return NextResponse.json(response.data);

    } catch (error) {
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
