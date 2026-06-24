import React, { useState, useRef, useEffect } from "react";
import {
    MessageCircle,
    Send,
    X,
    Bot,
    User,
    Sparkles,
    ArrowLeft,
    Trash2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const ChatBot = ({
    userId,
    tags,
    guidance,
    onClose,
    class_level,
    stream,
    education,
    percentage,
}) => {
    const [messages, setMessages] = useState([
        {
            type: "bot",
            text: `Hello! I'm your career guidance assistant for Class ${class_level}. I can help clarify any doubts about your personalized career report. What would you like to know?`,
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Initialize the chatbot by storing guidance in backend
        const initializeChat = async () => {
            try {
                const payload = {
                    user_id: userId,
                    guidance_text: guidance,
                    tags: tags,
                    class_level: class_level,
                };

                // Add additional fields for 12th class
                if (class_level === "12th") {
                    payload.stream = stream || "Not specified";
                    payload.education = education || "Not specified";
                    payload.percentage = percentage || "Not specified";
                }

                const response = await fetch(
                    `${import.meta.env.VITE_CHATBOT_URL}/store-guidance`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    }
                );

                if (response.ok) {
                    setIsInitialized(true);
                } else {
                    console.error("Failed to initialize chat");
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: "bot",
                            text: "Sorry, I couldn't initialize the chat. Please try again.",
                            timestamp: new Date(),
                        },
                    ]);
                }
            } catch (error) {
                console.error("Error initializing chat:", error);
                setMessages((prev) => [
                    ...prev,
                    {
                        type: "bot",
                        text: "Sorry, there was an error connecting to the chat service.",
                        timestamp: new Date(),
                    },
                ]);
            }
        };

        if (userId && guidance && tags) {
            initializeChat();
        }
    }, [userId, guidance, tags, class_level, stream, education, percentage]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || loading || !isInitialized) return;

        const userMessage = {
            type: "user",
            text: inputMessage,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputMessage("");
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_CHATBOT_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    message: inputMessage,
                    session_id: sessionId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to get response");
            }

            const data = await response.json();

            if (!sessionId) {
                setSessionId(data.session_id);
            }

            const botMessage = {
                type: "bot",
                text: data.response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = {
                type: "bot",
                text: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            {
                type: "bot",
                text: `Chat cleared! How can I help you with your Class ${class_level} career guidance?`,
                timestamp: new Date(),
            },
        ]);
        setSessionId(null);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Dynamic suggested questions based on class level
    const suggestedQuestions =
        class_level === "12th"
            ? [
                  "What colleges should I target for my stream?",
                  "What entrance exams should I prepare for?",
                  "What are the career prospects in my field?",
                  "Should I pursue higher education abroad?",
              ]
            : [
                  "What courses should I take first?",
                  "What skills do I need to develop?",
                  "Can you explain the career paths in detail?",
                  "What stream should I choose in 11th?",
              ];

    // Dynamic gradient colors based on class level
    const gradientColors =
        class_level === "12th"
            ? "from-indigo-900 via-purple-800 to-indigo-600"
            : "from-[#283c86] via-[#2d5a99] to-[#45a247]";

    const buttonGradient =
        class_level === "12th"
            ? "from-indigo-400 to-purple-500"
            : "from-green-400 to-green-500";

    const buttonHoverGradient =
        class_level === "12th"
            ? "from-indigo-300 to-purple-400"
            : "from-green-300 to-green-400";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div
                className={`bg-gradient-to-br ${gradientColors} rounded-3xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col border border-white/20`}>
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-t-3xl border-b border-white/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-xl transition">
                            <ArrowLeft className="w-6 h-6 text-white" />
                        </button>
                        <div
                            className={`w-12 h-12 bg-gradient-to-r ${buttonGradient} rounded-full flex items-center justify-center`}>
                            <Bot className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Class {class_level} Career Guide Bot
                            </h2>
                            <p className="text-sm text-gray-300">
                                {class_level === "12th"
                                    ? `${stream || "Your"} stream guidance`
                                    : "Ask me anything about your career report"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={clearChat}
                        className="p-2 hover:bg-white/20 rounded-xl transition text-white"
                        title="Clear chat">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${
                                message.type === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}>
                            {message.type === "bot" && (
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <div
                                className={`max-w-[70%] rounded-2xl p-4 ${
                                    message.type === "user"
                                        ? `bg-gradient-to-r ${buttonGradient} text-white`
                                        : "bg-white/15 backdrop-blur-xl text-white border border-white/20"
                                }`}>
                                <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none">
                                    <ReactMarkdown>
                                        {message.text}
                                    </ReactMarkdown>
                                </div>
                                <span
                                    className={`text-xs mt-2 block ${
                                        message.type === "user"
                                            ? "text-white/70"
                                            : "text-gray-300"
                                    }`}>
                                    {formatTime(message.timestamp)}
                                </span>
                            </div>
                            {message.type === "user" && (
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                                        style={{
                                            animationDelay: "0.1s",
                                        }}></div>
                                    <div
                                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                                        style={{
                                            animationDelay: "0.2s",
                                        }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length <= 1 && (
                    <div className="px-6 pb-4">
                        <p className="text-sm text-gray-300 mb-3 font-semibold">
                            💡 Try asking:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => setInputMessage(question)}
                                    className="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition border border-white/20">
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-b-3xl border-t border-white/20">
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 bg-white/10 rounded-2xl border border-white/20 p-4">
                            <textarea
                                ref={inputRef}
                                value={inputMessage}
                                onChange={(e) =>
                                    setInputMessage(e.target.value)
                                }
                                onKeyPress={handleKeyPress}
                                placeholder={`Ask me anything about your Class ${class_level} career guidance...`}
                                rows={2}
                                disabled={loading || !isInitialized}
                                className="w-full bg-transparent text-white placeholder-gray-300 outline-none resize-none"
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={
                                loading ||
                                !inputMessage.trim() ||
                                !isInitialized
                            }
                            className={`bg-gradient-to-r ${buttonGradient} text-white p-4 rounded-2xl hover:${buttonHoverGradient} transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0`}>
                            <Send className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 text-center">
                        Press Enter to send • Shift + Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
