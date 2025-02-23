"use client";
import { BASE_URL, ENDPOINTS } from "@/constants";
import { useParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
const ChatWidget = React.lazy(() => import("@/components/chat/ChatWidget"));

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

function App() {
  const params = useParams();
  const { id } = params;
  const [theme, setTheme] = useState(defaultTheme);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const fetchChatbot = async (id: string) => {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.chatbot}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log({ response });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { theme = {} } = data;
    console.log({ theme, data });
    setTheme(theme);
  };

  useEffect(() => {
    if (id) {
      fetchChatbot(id as string);
    }
  }, [id]);

  return isHydrated ? (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <ChatWidget id={(id as string) || ""} theme={theme} />
    </Suspense>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default App;
