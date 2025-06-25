"use client";

import { BASE_URL, ENDPOINTS, formatDateToYYMMDD } from "@/constants";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { MessageCircle, Send, X } from "lucide-react";
import Calendar from "react-calendar";

interface Message {
  id: string;
  sender: "User" | "AI";
  text: string;
  timestamp: string;
}

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

interface ChatWidgetProps {
  id: string;
  theme?: typeof defaultTheme;
  title?: string;
  avatar?: string;
  initialMessage?: string;
}

const ChatWidget = ({
  id,
  avatar,
  theme: customTheme,
  title = "Geni AI Assistant",
  initialMessage = "",
}: ChatWidgetProps) => {
  // Merge default theme with custom theme
  const theme = {
    ...defaultTheme,
    ...customTheme,
    botMessage: { ...defaultTheme.botMessage, ...customTheme?.botMessage },
    root: { ...defaultTheme.root, ...customTheme?.root },
    userMessage: { ...defaultTheme.userMessage, ...customTheme?.userMessage },
    submitButton: {
      ...defaultTheme.submitButton,
      ...customTheme?.submitButton,
      icon: "",
    },
    avatar: "",
    label: { ...defaultTheme.label, ...customTheme?.label },
    message: { ...defaultTheme.message, ...customTheme?.message },
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      // @ts-ignore
      sender: title,
      text: initialMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDate, setShowDate] = useState<Date[]>([]);
  const [showTime, setShowTime] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (message?: string) => {
    const _tempMessage = message || inputValue;
    if (!_tempMessage.trim() || isProcessing) return;

    setIsProcessing(true);

    const userMessage: Message = {
      id: String(messages.length + 1),
      sender: "User",
      text: _tempMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");

    const typingIndicator: Message = {
      id: String(messages.length + 2),
      // @ts-ignore
      sender: title,
      text: `${title} is typing...`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prevMessages) => [...prevMessages, typingIndicator]);

    try {
      const payload: Record<string, any> = {
        chatbotId: id,
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

      if (!response.ok || !response.body) {
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
        const res = JSON.parse(data.response);
        console.log({ res });

        if (res.message) {
          const aiMessage: Message = {
            id: String(messages.length + 3),
            // @ts-ignore
            sender: title,
            text: res.message,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
        }
        if (res.date) {
          setShowDate(res.date.map((date: string) => new Date(date)));
        }
        if (res.time) {
          setShowTime(res.time);
        }
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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-screen h-screen fixed !bg-transparent">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg focus:outline-none fixed bottom-5 md:bottom-5 right-1 md:right-5 z-50"
        style={{ backgroundColor: theme.userMessage.background }}
      >
        {isOpen ? (
          <X size={24} color="white" />
        ) : (
          <MessageCircle size={24} color="white" />
        )}
      </button>
      {isOpen && (
        <div
          className="absolute bottom-24 md:bottom-20 right-5 md:right-20 w-80 sm:w-96 rounded-lg shadow-xl overflow-hidden flex flex-col"
          style={{
            backgroundColor: theme.root.background,
            maxHeight: "500px",
            height: "calc(100vh - 100px)",
          }}
        >
          {/* Fixed Top Section */}
          <div
            className="p-3 shadow-md sticky top-0 z-10"
            style={{ backgroundColor: theme.label.background }}
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
                    src={avatar || "/imgs/user-5.jpg"}
                    style={{ color: "transparent" }}
                  />
                  <span
                    className="flex items-center font-medium text-white text-xs rounded-full p-0 h-2 w-2 absolute bottom-1 end-0"
                    style={{ backgroundColor: theme.label.statusColor }}
                  />
                </div>
                <div style={{ color: theme.label.text }}>
                  <h5 className="text-base sm:mb-1">{title}</h5>
                  <div className="text-sm text-ld opacity-90 line-clamp-1">
                    online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100 focus:outline-none"
              >
                <X size={18} color={theme.label.text} />
              </button>
            </div>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto">
            <div className="w-full p-3 flex-1">
              {messages.map((message, index) => (
                <Message
                  key={index}
                  message={message.text}
                  time={message.timestamp}
                  backgroundColor={
                    message.sender !== "User"
                      ? theme.botMessage.background
                      : theme.userMessage.background
                  }
                  textColor={
                    message.sender !== "User"
                      ? theme.botMessage.text
                      : theme.userMessage.text
                  }
                  avatar={avatar || "/imgs/user-5.jpg"}
                  sender={message.sender}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input form */}

          {showDate?.length ? (
            <div className="text-xs opacity-60 px-4 font-medium mb-1 text-center w-full">
              <div className="my-2">
                <p className="font-bold text-base">Date:</p>
                <p className="text-xs opacity-60">
                  Click on any date to Continue
                </p>
              </div>
              <div className="flex gap-x-2 w-11/12 mx-auto py-4 justify-center items-center">
                <Calendar
                  tileDisabled={({ date }) =>
                    !showDate.some(
                      (d) => d.toDateString() === date.toDateString()
                    )
                  }
                  className="rounded-xl border p-3 border-gray-200 bg-white"
                  tileClassName={({ date }) => {
                    const isAllowed = showDate.some(
                      (d) => d.toDateString() === date.toDateString()
                    );
                    return isAllowed
                      ? "bg-green-100 rounded-lg text-black font-semibold hover:bg-green-200"
                      : "";
                  }}
                  onClickDay={(date) => {
                    setShowDate([]);
                    handleSend(formatDateToYYMMDD(date));
                  }}
                />
              </div>
            </div>
          ) : null}
          {showTime?.length ? (
            <div className="text-xs opacity-60 text-center pb-4 font-medium mb-1">
              <div className="my-2">
                <p className="font-bold text-base">Time:</p>
                <p className="text-xs opacity-60">
                  Click on any time to Continue
                </p>
              </div>

              <div className="flex gap-x-2 px-2 overflow-x-scroll w-full">
                {showTime.map((time, index) => (
                  <div
                    className={`min-w-fit bg-red-600 text-center text-white px-3 py-2 rounded-full text-xs`}
                    style={{
                      backgroundColor: theme.botMessage.background,
                      color: theme.botMessage.text,
                    }}
                    key={index}
                    onClick={() => {
                      setShowTime([]);
                      handleSend(time);
                    }}
                  >
                    <div className="w-full">{time}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {showDate?.length || showTime?.length ? null : (
            <div style={{ backgroundColor: theme.message.background }}>
              <hr className="h-px border-0 bg-gray-200 my-0" />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="w-full"
              >
                <div className="flex gap-3 items-center py-4 px-4 border">
                  <div className="flex border-0 w-full">
                    <input
                      className="w-full text-sm text-gray-900 border-0 p-3 focus:outline-none"
                      style={{
                        backgroundColor: theme.message.background,
                        color: theme.message.text,
                      }}
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
                      backgroundColor: theme.submitButton.background,
                      color: theme.submitButton.text,
                    }}
                    disabled={isProcessing}
                  >
                    {theme.submitButton?.icon ? (
                      <Image
                        alt="send"
                        loading="lazy"
                        width="20"
                        height="20"
                        decoding="async"
                        src={theme.submitButton.icon || "/svgs/send.svg"}
                        style={{ color: theme.submitButton.text }}
                      />
                    ) : (
                      <Send size={20} color={theme.submitButton.text} />
                    )}
                  </button>
                </div>
                <div className="text-xs text-gray-500 text-center py-2">
                  Powered by{" "}
                  <span className="font-bold underline">
                    <a href="https://leadwise.genimatics.com" target="_blank">
                      Leadwise
                    </a>
                  </span>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
