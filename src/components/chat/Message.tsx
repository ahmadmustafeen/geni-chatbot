import Image from "next/image";
import React from "react";

interface MessageProps {
  message: string;
  time: string;
  sender?: string;
  backgroundColor?: string;
  textColor?: string;
  avatar?:string
}

const Message: React.FC<MessageProps> = ({
  message,
  time,
  sender = "James Johnson",
  backgroundColor = "#eff4fa",
  textColor = "#6b7280",
  avatar="/imgs/user-5.jpg"
}) => {
  return (
    <div className="flex gap-3 mb-8">
      <div className="flex gap-3">
        <div className="shrink-0 sm:min-w-12 min-w-9">
          <Image
            alt="user"
            loading="lazy"
            width="48"
            height="48"
            decoding="async"
            className="rounded-full sm:h-12 sm:w-12 h-9 w-9"
            src={avatar}
            style={{ color: "transparent" }}
          />
        </div>
        <div>
          <div className="text-xs opacity-60 font-medium mb-1 block">
            {sender}, {time}
          </div>
          <div
            className="p-2 rounded-md "
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
      </div>
    </div>
  );
};

export default Message;
