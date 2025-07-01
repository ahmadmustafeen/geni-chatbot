"use client";
import { BASE_URL, ENDPOINTS } from "@/constants";
import { useParams, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const { id } = params;

  const [theme, setTheme] = useState(defaultTheme);
  const [hideChatbot, setHideChatbot] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [personality, setPersonality] = useState({
    name: "Geni",
    avatar: "/imgs/user-5.jpg",
  });

  useEffect(() => {
    const fetchChatbot = async () => {
      if (!id) return;

      const response = await fetch(`${BASE_URL}${ENDPOINTS.chatbot}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const { chatbot, personality, hideChatbot } = data;
      const { theme: chatbotTheme = {}, initialMessage } = chatbot;
      setTheme(chatbotTheme);
      setInitialMessage(initialMessage);
      setPersonality(personality);
      setHideChatbot(hideChatbot);

      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    };

    fetchChatbot();
  }, [id]);

  return (
    <div className="fixed bottom-0 h-screen w-screen right-0 z-50 !bg-transparent">
      {isVisible && theme && personality && !hideChatbot && (
        <ChatWidget
          isOpened={!!searchParams.get("opened")}
          dev={!!searchParams.get("dev")}
          id={id as string}
          theme={theme}
          title={personality.name}
          avatar={personality.avatar}
          initialMessage={initialMessage}
        />
      )}
    </div>
  );
};

export default ChatPage;
