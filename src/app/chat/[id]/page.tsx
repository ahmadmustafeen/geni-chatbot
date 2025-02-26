"use client";
import { BASE_URL, ENDPOINTS } from "@/constants";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ChatWidget from "@/components/chat/ChatWidget";

const defaultTheme = {
  botMessage: {
    background: "#eff4fa",
    text: "#4B5563",
  },
  root: {
    background: "#ffffff",
  },
  userMessage: {
    background: "#46caeb",
    text: "#4B5563",
  },
  submitButton: {
    background: "#ffffff",
    text: "#808080",
    hover: "#f3f4f6",
  },
  label: {
    background: "#ffffff",
    text: "#111827",
    statusColor: "#00ceb6",
  },
  message: {
    background: "#ffffff",
    text: "#111827",
    placeholder: "#6B7280",
  },
};

const ChatPage = () => {
  const params = useParams();
  const { id } = params;
  const [theme, setTheme] = useState(defaultTheme);
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    const fetchChatbot = async () => {
      if (!id) return;

      const response = await fetch(`${BASE_URL}${ENDPOINTS.chatbot}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const { theme: chatbotTheme = {} } = data?.chatbot;
      setTheme(chatbotTheme);
    };

    fetchChatbot();
  }, [id]);

  const toggleChat = () => setIsChatVisible((prev) => !prev);

  return (
    <div className="fixed bottom-0 h-screen w-screen right-0 z-50">
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors duration-200"
        aria-label="Open chat"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          />
        </svg>
      </button>

      {isChatVisible && <ChatWidget id={id as string} theme={theme} />}
    </div>
  );
};

export default ChatPage;
