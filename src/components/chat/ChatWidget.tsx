"use client";

import Message from "@/components/chat/Message";
import Message2 from "@/components/chat/Message2";
import { BASE_URL, ENDPOINTS } from "@/constants";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";


const theme = {
  theme: {
    backgroundColor: "#ffffff",
    title: "Geni AI Assistant",
    avatar: "/imgs/user-5.jpg",
    bot: {
      backgroundColor: "#eff4fa",
      textColor: "#4B5563",
    },
    user: {
      backgroundColor: "#46caeb25",
      textColor: "#4B5563",
    },
    button: {
      backgroundColor: "#ffffff",
      textColor: "#808080",
      hoverBackgroundColor: "#f3f4f6",
    },
    header: {
      backgroundColor: "#ffffff",
      textColor: "#111827",
      statusColor: "#00ceb6",
    },
    input: {
      backgroundColor: "#ffffff",
      textColor: "#111827",
      placeholderColor: "#6B7280",
    },
  },
};

interface Message {
  id: string;
  sender: "User" | "AI";
  text: string;
  timestamp: string;
}

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "AI",
      text: "Hey there, I am Geni, your AI assistant.How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isProcessing) return;

    setIsProcessing(true);

    const userMessage: Message = {
      id: String(messages.length + 1),
      sender: "User",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");

    const typingIndicator: Message = {
      id: String(messages.length + 2),
      sender: "AI",
      text: "Geni is typing...",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prevMessages) => [...prevMessages, typingIndicator]);

    try {
      const payload: Record<string, any> = {
        website_id: "67700998406ecfde2d6cb66d",
        message: userMessage.text,
      };

      if (sessionId) {
        payload.sessionId = sessionId;
      }

      const response = await fetch(`${BASE_URL}${ENDPOINTS.chat}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== typingIndicator.id)
      );

      if (data.response) {
        const aiMessage: Message = {
          id: String(messages.length + 3),
          sender: "AI",
          text: data.response,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        throw new Error("API response is empty or invalid");
      }
    } catch (error) {
      console.error("Error:", error);

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== typingIndicator.id)
      );

      const errorMessage: Message = {
        id: String(messages.length + 3),
        sender: "AI",
        text: "Sorry, there was an error processing your message.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-screen "  style={{ backgroundColor: theme.theme.header.backgroundColor }}>
      {/* Fixed Top Section */}
      <div
        className="p-3  shadow-md sticky top-0 z-10"
        style={{ backgroundColor: theme.theme.header.backgroundColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative sm:min-w-12 min-w-9">
              <Image
                alt="user"
                loading="lazy"
                width="48"
                height="48"
                decoding="async"
                className="rounded-full sm:h-12 sm:w-12 h-9 w-9"
                src={theme.theme.avatar}
                style={{ color: "transparent" }}
              />
              <span className="flex items-center font-medium bg-[#00ceb6] text-white text-xs rounded-full p-0 h-2 w-2 absolute bottom-1 end-0" />
            </div>
            <div>
              <h5 className="text-base sm:mb-1">{theme.theme.title}</h5>
              <div className="text-sm text-ld opacity-90 line-clamp-1">
                online
              </div>
            </div>
          </div>
          <hr className="h-px border-0 bg-gray-200 my-2" />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="w-full p-3">
          {messages.map((message) =>
            message.sender === "AI" ? (
              <Message
                key={message.id}
                message={message.text}
                time={message.timestamp}
                backgroundColor={theme.theme.bot.backgroundColor}
                textColor={theme.theme.bot.textColor}
                avatar={theme.theme.avatar}
              />
            ) : (
              <Message2
                key={message.id}
                message={message.text}
                time={message.timestamp}
                backgroundColor={theme.theme.user.backgroundColor}
                textColor={theme.theme.user.textColor}
              />
            )
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div
        className="w-full"
        style={{ backgroundColor: theme.theme.input.backgroundColor }}
      >
        <hr className="h-px border-0 bg-gray-200 my-0" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="w-full"
        >
          <div className="flex gap-3 items-center py-4 px-4 shadow-md">
            <div className="flex border-0 w-full">
              <input
                className="w-full text-gray-900 border-0 p-3 text-lg focus:outline-none"
                style={{ backgroundColor: theme.theme.input.backgroundColor }}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
              />
            </div>
            <button
              type="submit"
              className="hover:shadow-md transition-all duration-200 cursor-pointer rounded-full p-2"
              style={{
                backgroundColor: theme.theme.button.backgroundColor,
                color: theme.theme.button.textColor,
              }}
              disabled={isProcessing}
            >
              <Image
                alt="send"
                loading="lazy"
                width="20"
                height="20"
                decoding="async"
                src="/svgs/send.svg"
                style={{ color: "#808080" }}
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
