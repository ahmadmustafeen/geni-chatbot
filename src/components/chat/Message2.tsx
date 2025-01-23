import React from "react";


interface Message2Props {
    message: string;
    time: string;
  }
  
const Message2: React.FC<Message2Props> = ({message,time}) => {
  return (
    <div className="flex gap-3 mb-8">
      <div className="flex  justify-end w-full">
        <div>
          <div className="text-xs opacity-60 font-medium mb-1 block text-end">
          {time}
          </div>
          <div className="p-2 bg-[#46caeb25] text-gray-500 rounded-md">
          {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message2;
