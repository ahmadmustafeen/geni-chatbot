import Image from "next/image";
import React from "react";

interface MessageProps {
  message: string;
  time: string;
  sender: "User" | "AI";
  backgroundColor?: string;
  textColor?: string;
  avatar?: string;
}

const Message: React.FC<MessageProps> = ({
  message,
  time,
  sender,
  backgroundColor = "#eff4fa",
  textColor = "#6b7280",
  avatar = "/imgs/user-5.jpg"
}) => {
  const isUser = sender === "User";
  
  return (
    <div 
      className={`flex gap-3 mb-8 w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <div className="shrink-0 sm:min-w-12 min-w-9">
            <Image
              alt="AI"
              loading="lazy"
              width="48"
              height="48"
              decoding="async"
              className="rounded-full sm:h-12 sm:w-12 h-9 w-9"
              src={avatar}
              style={{ color: "transparent" }}
            />
          </div>
        )}
        <div>
          <div 
            className={`text-xs opacity-60 font-medium mb-1 block ${isUser ? 'text-right' : 'text-left'}`}
          >
            {isUser ? `${time}, You` : `${sender}, ${time}`}
          </div>
          <div
            className={`p-3 rounded-md ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'}`}
            style={{
              wordBreak: "break-word",
              hyphens: "auto",
              backgroundColor: backgroundColor,
              color: textColor,
            }}
          >
            {message}
          </div>
        </div>
        {isUser && (
          <div className="shrink-0 sm:min-w-12 min-w-9 flex items-start">
            {/* Optional: You can add user avatar here or leave it empty for a cleaner look */}
            {/* <Image
              alt="You"
              loading="lazy"
              width="48"
              height="48"
              decoding="async"
              className="rounded-full sm:h-12 sm:w-12 h-9 w-9"
              src="/imgs/user-avatar.jpg"
              style={{ color: "transparent" }}
            /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;