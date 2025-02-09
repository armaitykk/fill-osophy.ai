import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!input.trim()) return;
    
        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]);
        setLoading(true);
    
        try {
            const response = await axios.post("http://localhost:8000/chatbot/", 
                { question: input }, 
                { headers: { "Content-Type": "application/json" } } // ✅ Fix: Ensure JSON format
            );
    
            if (response.data.error) {
                setMessages([...messages, userMessage, { text: response.data.error, sender: "bot" }]);
            } else {
                const botMessage = { text: response.data.answer, sender: "bot" };
                setMessages([...messages, userMessage, botMessage]);
            }
        } catch (error) {
            setMessages([...messages, userMessage, { text: "Error getting response.", sender: "bot" }]);
            console.error("Chatbot error:", error);
        }
    
        setInput("");
        setLoading(false);
    };

    return (
        <div>
            {/* Chatbot Button */}
            <button onClick={toggleChat} className="chatbot-button">💬</button>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chat-header">
                        <h3>AI Legal Assistant</h3>
                        <button onClick={toggleChat}>✖</button>
                    </div>
                    <div className="chat-body">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-footer">
                        <input
                            type="text"
                            placeholder="Ask about your document..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button onClick={sendMessage} disabled={loading}>
                            {loading ? "..." : "Send"}
                        </button>
                    </div>
                </div>
            )}

            <style>
                {`
                    .chatbot-button {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background-color: #007bff;
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        font-size: 20px;
                        cursor: pointer;
                    }

                    .chatbot-window {
                        position: fixed;
                        bottom: 80px;
                        right: 20px;
                        width: 300px;
                        background: white;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                        display: flex;
                        flex-direction: column;
                    }

                    .chat-header {
                        background: #007bff;
                        color: white;
                        padding: 10px;
                        display: flex;
                        justify-content: space-between;
                        border-radius: 10px 10px 0 0;
                    }

                    .chat-body {
                        padding: 10px;
                        max-height: 300px;
                        overflow-y: auto;
                    }

                    .chat-footer {
                        display: flex;
                        padding: 10px;
                        border-top: 1px solid #ccc;
                    }

                    .message {
                        padding: 8px;
                        border-radius: 5px;
                        margin-bottom: 5px;
                        max-width: 80%;
                    }

                    .message.user {
                        background-color: #007bff;
                        color: white;
                        align-self: flex-end;
                    }

                    .message.bot {
                        background-color: #f1f1f1;
                        align-self: flex-start;
                    }
                `}
            </style>
        </div>
    );
}

export default Chatbot;
