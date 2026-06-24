import React, { useState } from "react";
import {
    BookOpen,
    Target,
    TrendingUp,
    Award,
    Lightbulb,
    CheckCircle2,
    FileText,
    Sparkles,
    MessageCircle,
    Bot,
    ArrowLeft,
} from "lucide-react";

import ChatBot from "../Chatbot/Chatbot";

const Class10Page = ({ loged }) => {
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [guidance, setGuidance] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [summarizing, setSummarizing] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const userId = loged ? loged.id : `user_${Date.now()}`;

    const options = [
        "Mathematics",
        "Science",
        "Biology",
        "Physics",
        "Chemistry",
        "Computer Science",
        "Economics",
        "Political Science",
        "Psychology",
        "History",
        "Geography",
        "Artificial Intelligence",
        "Robotics",
        "Coding",
        "App Development",
        "Game Development",
        "Engineering",
        "Business Studies",
        "Entrepreneurship",
        "Accounting",
        "Law",
        "Marketing",
        "Graphic Designing",
        "Animation",
        "Film Making",
        "Photography",
        "Music",
        "Writing",
        "Journalism",
        "Public Speaking",
        "Medical Science",
        "Environmental Science",
        "Astronomy",
        "Fashion Designing",
    ];

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            e.preventDefault();
            addTag(inputValue.trim());
            setInputValue("");
        }
    };

    const addTag = (tag) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handlePredict = async () => {
        if (tags.length === 0) {
            alert("Please add at least one interest!");
            return;
        }

        setLoading(true);
        setSummary("");
        setShowSummary(false);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tags }),
            });
            const data = await res.json();
            setGuidance(data.guidance);
        } catch (err) {
            console.error("Prediction error:", err);
            alert("Failed to generate guidance. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSummarize = async () => {
        setSummarizing(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/summarize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ guidance }),
            });
            const data = await res.json();
            setSummary(data.summary);
            setShowSummary(true);
        } catch (err) {
            console.error("Summarize error:", err);
            alert("Failed to generate summary. Please try again.");
        } finally {
            setSummarizing(false);
        }
    };

    const parseMarkdown = (text) => {
        const elements = [];
        const lines = text.split("\n");
        let currentList = [];

        const flushList = () => {
            if (currentList.length > 0) {
                elements.push(
                    <ul
                        key={`list-${elements.length}`}
                        className="list-none space-y-3 mb-6 ml-4">
                        {currentList.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                                <span
                                    className="text-gray-200"
                                    dangerouslySetInnerHTML={{ __html: item }}
                                />
                            </li>
                        ))}
                    </ul>
                );
                currentList = [];
            }
        };

        const processBold = (text) => {
            return text.replace(
                /\*\*(.+?)\*\*/g,
                '<span class="font-semibold text-green-200">$1</span>'
            );
        };

        lines.forEach((line, idx) => {
            const trimmed = line.trim();

            if (!trimmed) {
                flushList();
                return;
            }

            if (
                trimmed.match(/^##\s+/) ||
                trimmed.match(/^\d+\.\s+\*\*/) ||
                trimmed.match(/^\d+\.\s+[A-Z]/)
            ) {
                flushList();
                const text = trimmed
                    .replace(/^##\s+/, "")
                    .replace(/^\d+\.\s+/, "")
                    .replace(/\*\*/g, "")
                    .replace(/:$/, "");
                elements.push(
                    <h2
                        key={`h2-${idx}`}
                        className="text-3xl font-bold text-green-300 mt-10 mb-4 pb-3 border-b-2 border-green-400/30">
                        {text}
                    </h2>
                );
            } else if (
                trimmed.match(/^###\s+/) ||
                (trimmed.match(/^\*\*[^*]+\*\*:?\s*$/) &&
                    !trimmed.match(/^\*\s/))
            ) {
                flushList();
                const text = trimmed
                    .replace(/^###\s+/, "")
                    .replace(/\*\*/g, "")
                    .replace(/:$/, "");
                elements.push(
                    <h3
                        key={`h3-${idx}`}
                        className="text-xl font-semibold text-white mt-6 mb-3">
                        {text}
                    </h3>
                );
            } else if (trimmed.match(/^[\*\-]\s+/)) {
                const content = processBold(trimmed.replace(/^[\*\-]\s+/, ""));
                currentList.push(content);
            } else {
                flushList();
                const content = processBold(trimmed);
                elements.push(
                    <p
                        key={`p-${idx}`}
                        className="mb-3 text-gray-100 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                );
            }
        });

        flushList();
        return elements;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#283c86] via-[#2d5a99] to-[#45a247] text-white px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-300">
                        Discover Your Future
                    </h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                        AI-powered career guidance tailored for your unique
                        interests and aspirations
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="w-8 h-8 text-green-300" />
                        <label className="text-2xl font-bold text-white">
                            What are you passionate about?
                        </label>
                    </div>

                    <div className="flex flex-wrap gap-3 p-4 bg-white/10 rounded-2xl min-h-[80px] mb-6 border border-white/10">
                        {tags.map((tag, index) => (
                            <div
                                key={index}
                                className="flex items-center bg-gradient-to-r from-green-400 to-green-500 text-black font-semibold px-4 py-2 rounded-full shadow-lg">
                                <span>{tag}</span>
                                <button
                                    type="button"
                                    onClick={() => removeTag(index)}
                                    className="ml-3 text-red-700 hover:text-red-900 font-bold text-lg transition">
                                    ×
                                </button>
                            </div>
                        ))}
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type and press Enter..."
                            className="flex-grow bg-transparent text-white placeholder-gray-300 outline-none text-lg"
                        />
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <Lightbulb className="w-6 h-6 text-yellow-300" />
                        <h2 className="text-white font-semibold text-lg">
                            Quick Suggestions:
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-8">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => addTag(option)}
                                disabled={tags.includes(option)}
                                className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                                    tags.includes(option)
                                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                        : "bg-white/15 text-white hover:bg-green-400 hover:text-black hover:scale-105"
                                }`}>
                                {option}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handlePredict}
                        disabled={loading || tags.length === 0}
                        className="w-full bg-gradient-to-r from-green-400 to-green-500 text-black font-bold py-4 rounded-2xl hover:from-green-300 hover:to-green-400 transition duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg">
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                                Analyzing Your Interests...
                            </>
                        ) : (
                            <>
                                <Award className="w-6 h-6" />
                                Get My Personalized Career Guide
                            </>
                        )}
                    </button>
                </div>

                {guidance && (
                    <div className="mt-12 bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-white/20 gap-4">
                            <div className="flex items-center gap-4">
                                <BookOpen className="w-10 h-10 text-green-300" />
                                <div>
                                    <h2 className="text-3xl font-bold text-white">
                                        Your Personalized Career Roadmap
                                    </h2>
                                    <p className="text-gray-300 mt-2">
                                        Based on: {tags.join(", ")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowChat(true)}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition shadow-lg hover:shadow-xl hover:scale-105">
                                    <MessageCircle className="w-5 h-5" />
                                    Ask Questions
                                </button>
                                <button
                                    onClick={handleSummarize}
                                    disabled={summarizing}
                                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-105">
                                    {summarizing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Summarizing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Quick Summary
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {showSummary && summary && (
                            <div className="mb-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-2xl border-2 border-purple-400/40">
                                <div className="flex items-center gap-3 mb-4">
                                    <FileText className="w-7 h-7 text-purple-300" />
                                    <h3 className="text-2xl font-bold text-white">
                                        📋 Quick Summary
                                    </h3>
                                </div>
                                <div className="space-y-2 text-gray-100 leading-relaxed">
                                    {parseMarkdown(summary)}
                                </div>
                                <button
                                    onClick={() => setShowSummary(false)}
                                    className="mt-4 text-purple-300 hover:text-purple-200 font-semibold underline">
                                    Hide Summary
                                </button>
                            </div>
                        )}

                        <div className="space-y-2">
                            {parseMarkdown(guidance)}
                        </div>

                        <div className="mt-10 p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl border border-green-400/30">
                            <div className="flex items-start gap-4">
                                <TrendingUp className="w-8 h-8 text-green-300 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        Next Steps
                                    </h3>
                                    <p className="text-gray-200">
                                        Save this guidance, discuss it with your
                                        parents and teachers, and start
                                        exploring the recommended resources.
                                        Remember, this is just the beginning of
                                        your exciting journey!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setGuidance("");
                                setTags([]);
                                setSummary("");
                                setShowSummary(false);
                            }}
                            className="mt-6 w-full bg-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition">
                            Start New Search
                        </button>
                    </div>
                )}
            </div>

            {/* Chatbot component */}
            {showChat && (
                <ChatBot
                    userId={userId}
                    tags={tags}
                    guidance={guidance}
                    onClose={() => setShowChat(false)}
                    class_level="10th"
                />
            )}
        </div>
    );
};

export default Class10Page;
