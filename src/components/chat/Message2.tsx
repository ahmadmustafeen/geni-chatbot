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
    <div className="flex gap-3 mb-8 sm:max-w-2xl ">
      <div className="flex justify-end w-full">
        <div>
          <div className="text-xs opacity-60 font-medium mb-1 block text-end">
            {time}
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

export default Message2;
