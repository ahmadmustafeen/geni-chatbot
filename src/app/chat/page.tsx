"use client";

import Message from "@/components/chat/Message";
import Message2 from "@/components/chat/Message2";
import Image from "next/image";
interface Message {
  id: string;
  sender: "User" | "AI";
  text: string;
  timestamp: string;
}

const dummyMessages: Message[] = [
  {
    id: "1",
    sender: "AI",
    text: "Hello! How can I help you today?",
    timestamp: "09:00 AM",
  },
  {
    id: "2",
    sender: "User",
    text: "I need help with my account settings",
    timestamp: "09:01 AM",
  },
  {
    id: "3",
    sender: "AI",
    text: "I'll be happy to help you with your account settings. What specific aspect would you like to know about?",
    timestamp: "09:02 AM",
  },
];
const ChatWidget: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="container max-auto">
        <div className="flex rounded-lg relative w-full break-words flex-col  p-0 overflow-hidden shadow-md">
          <div className="flex h-full flex-col justify-center gap-2 p-0">
            <div className="flex">
              <div className="grow w-[70%] shrink-0">
                <div className="p-5">
                  {/* <div className="bg-black"> */}
                  <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-3 ">
                      <div className="relative sm:min-w-12 min-w-9">
                        <Image
                          alt="user"
                          loading="lazy"
                          width="48"
                          height="48"
                          decoding="async"
                          className="rounded-full sm:h-12 sm:w-12 h-9 w-9"
                          src="/imgs/user-5.jpg"
                          style={{ color: "transparent" }}
                        />
                        <span className="flex items-center font-medium bg-[#00ceb6] text-white text-xs rounded-full p-0 h-2 w-2 absolute bottom-1 end-0" />
                      </div>
                      <div>
                        <h5 className="text-base sm:mb-1">James Johnson</h5>
                        <div className="text-sm text-ld opacity-90 line-clamp-1">
                          online
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="h-px border-0 bg-gray-200 my-0" />
                <div className="flex max-h-[800px]">
                  <div className="transition-all w-full ">
                    <div className="lg:border-e h-full py-5 px-5">
                      <div className="max-h-[700px]">
                        <div>
                          {dummyMessages.map((message) =>
                            message.sender === "AI" ? (
                              <Message
                                message={message.text}
                                time={message.timestamp}
                              />
                            ) : (
                              <Message2
                                message={message.text}
                                time={message.timestamp}
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="h-px border-0 bg-gray-200 my-0"></hr>
                <form>
                  <div className="flex gap-3 items-center py-5 px-5">
                    <div className="flex border-0 w-full">
                      <input
                        className="w-full text-gray-900 border-0 text-lg  focus:outline-none"
                        type="text"
                      />
                    </div>
                    <div className="hover:bg-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer rounded-full p-2">
                      <Image
                        alt="user"
                        loading="lazy"
                        width="20"
                        height="20"
                        decoding="async"
                        src="/svgs/send.svg"
                        style={{ color: "#808080" }}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatWidget;
