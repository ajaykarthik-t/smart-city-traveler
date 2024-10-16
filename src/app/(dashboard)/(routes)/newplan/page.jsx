"use client";

import { Input } from "@/components/ui/input";
import '@/styles/custom.css';
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PacmanLoader from "react-spinners/PacmanLoader";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { ComboboxDemo } from "@/components/combobox";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

const font = Montserrat({
    weight: "800",
    subsets: ["latin"]
});

export default function Home() {
    let [loading, setLoading] = useState(false);
    const router = useRouter();
    const [value, setValue] = useState("");
    const [people, setPeople] = useState("");
    const [days, setDays] = useState("");
    const [messages, setMessages] = useState([]);
    const [date, setDate] = useState("");

    // Function to handle the "Plan my trip" button click
    const handlePlanTrip = async () => {
        try {
            setMessages([]);
            setLoading(true);

            // Create the content for instructionMessage including the extracted values
            const content = `${value} city from ${date} for ${days} days with ${people} people`;

            const userMessage = {
                role: "user",
                content: content,
            };

            const newMessages = [userMessage];

            const response = await axios.post("/api/plan", {
                messages: newMessages,
            });

            // Adjusting to match the expected structure
            const aiResponse = response.data.candidates[0].content.parts[0].text;

            // Set messages including AI response in a simple structure
            setMessages((current) => [...current, userMessage, { role: 'assistant', content: aiResponse }]);

            // Clear the input fields if needed
            setValue("");
            setDate("");
            setDays("");
            setPeople("");

        } catch (error) {
            console.error(error);
        } finally {
            router.refresh();
            setLoading(false);
        }
    };

    return (
        <>
            <div>
                <Navbar />
            </div>

            <main className="flex flex-col md:flex-row justify-between">
                {/* Left Section: Input Elements and Button */}
                <div className="md:w-2/5 py-10 px-5 text-center">
                    <div className={cn("text-center mt-3 text-lg", font.className)}>
                        <h1>Plan your next adventure</h1>
                    </div>

                    <div className="my-5">
                        <p>Where do you want to go</p>
                        <ComboboxDemo setValue={setValue} value={value} />
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <p>When does your trip start</p>
                        <Input
                            className="w-fit content-center my-5 border-sky-100"
                            type="text"
                            placeholder="26/11/23"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p>How many days will your trip be?</p>
                        <Input
                            className="w-fit content-center my-5 border-sky-100"
                            type="text"
                            placeholder="0"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p>How many people are going?</p>
                        <Input
                            className="w-fit content-center my-5 border-sky-100"
                            type="text"
                            placeholder="1"
                            value={people}
                            onChange={(e) => setPeople(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <Button onClick={handlePlanTrip}>
                            Generate my trip
                        </Button>
                    </div>
                </div>

                {/* Right Section: API Response Box, To display the output in the screen */}
                <div className="w-auto md:w-3/5 bg-gray-200 p-5 border rounded-xl border-solid border-cyan-950 m-5 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <PacmanLoader color="#87CEEB" margin={0} size={30} />
                        </div>
                    ) : (
                        messages.map((message, i) => {
                            if (message.role === 'assistant') {
                                return (
                                    <div className="m-7" key={i}>
                                        {/* Displaying the AI response in a preformatted block */}
                                        <pre className="whitespace-pre-wrap break-words overflow-hidden">
                                            {message.content}
                                        </pre>
                                    </div>
                                );
                            }
                            return null; // Return null if the role is not 'assistant'
                        })
                    )}
                </div>
            </main>
        </>
    );
}

