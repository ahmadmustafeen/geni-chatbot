import React from "react";

interface Message2Props {
  message: string;
  time: string;
  backgroundColor?: string;
  textColor?: string;
}

const Message2: React.FC<Message2Props> = ({
  message,
  time,
  backgroundColor = "#46caeb25",
  textColor = "#6b7280",
}) => {
  return (
    <div className="flex justify-end mb-6 sm:max-w-2xl ml-auto">
      <div className="max-w-[80%]">
        <div className="text-xs opacity-60 font-medium mb-1 text-end">
          {time}
        </div>
        <div
          className="p-3 rounded-lg"
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
  );
};

export default Message2;