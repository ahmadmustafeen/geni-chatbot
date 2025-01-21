"use client"
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";



interface ChatWidgetProps {
  apiKey?: string;
  apiUrl?: string;
  iconColor?: string;
}

interface Message {
  text: string;
  type: 'bot' | 'user';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
//   apiKey = "default-api-key", 
//   apiUrl = "http://localhost:4000", 
  iconColor = "#222722" 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hey there, I am Geni, your AI assistant. How can I help you today?", type: "bot" },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (): Promise<void> => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = inputValue;
    setMessages((prev) => [...prev, { text: userMessage, type: "user" }]);
    setInputValue("");
    setIsProcessing(true);

    try {
      const payload = { website_id: '67700998406ecfde2d6cb66d', message: userMessage, sessionId };
      const response = await fetch('http://localhost:4000/chat/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.sessionId) setSessionId(data.sessionId);

      setMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "Geni is typing..."),
        { text: data.response || "Sorry, no response available.", type: "bot" },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, there was an error processing your message.", type: "bot" },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSendMessage();
  };

  const quickReplies: string[] = [
    "What services do you offer?",
    "I need technical support",
    "Schedule a demo",
    "Contact sales",
  ];

  return (
    <div>
     

      <div className={`chat-overlay ${isOpen ? "show" : ""}`} onClick={() => setIsOpen(false)}>
        <div className="chat-window" onClick={(e) => e.stopPropagation()}>
          <div className="chat-header" style={{ backgroundColor: iconColor }}>
            <img
              src="https://raw.githubusercontent.com/genimatics/geni-script/7ec5af75c9c5bed1f60d85ba8241d7f2b1ba5095/bg-logo.png"
              alt="AI"
              style={{ width: "50px", height: "50px", marginRight: "20px" }}
            />
         
          </div>

          <div className="chat-messages" ref={chatMessagesRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}-message`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="bubble-container">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                className="chat-bubble"
                style={{ color: iconColor, borderColor: `${iconColor}30` }}
                onClick={() => {
                  setInputValue(reply);
                  handleSendMessage();
                }}
              >
                {reply}
              </button>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;