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
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    sendMessage();
                                }
                            }}
                        />
                        <button onClick={sendMessage} disabled={loading}>
                            {loading ? "..." : "Send"}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Chatbot;
