"use client";

import React, { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { ChatInput, ChatMessages } from './ui/chat';
import { marked } from 'marked';

// Define the default message structure
interface Message {
  id: string;
  content: string | JSX.Element; // Content as a string or JSX.Element
  role: string;
}

export default function ChatSection() {
  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    reload,
    stop,
  } = useChat({ api: process.env.NEXT_PUBLIC_CHAT_API });

  const defaultMessage: Message = {
    id: 'default-msg-0',
    content: `<div style="display: flex; align-items: flex-start; justify-content: space-between;">
      <div style="flex: 3; min-width: 0;">
        <p>Welcome to MomoBot, a service of MomoTech! I was designed to help you know better Marcos Acosta as a professional. Here are some quick links:</p>
        <ul>
          <li><strong>LinkedIn</strong>: <a href="https://www.linkedin.com/in/marcosgacosta/">Marcos Acosta</a></li>
          <li><strong>GitHub</strong>: <a href="https://github.com/marcosgacosta/">marcosgacosta</a></li>
        </ul>
        <p>Discover more about Marcos with these commands:</p>
        <ul>
          <li><code>/resume</code> (date/topic/range)</li>
          <li><code>/facts</code></li>
        </ul>
        <p>Feel free to ask me a question about Marcos!</p>
      </div>
      <div style="flex: 2; text-align: right; padding-left: 20px;">
        <img src="https://github.com/marcosgacosta/resumebot/blob/main/llama2_app/public/momo.jpg?raw=true" alt="Image" style="max-width: 100%; height: auto; border-radius: 10px;">
      </div>
    </div>`,
    role: 'system',
  };





  // State to manage the array of messages and client-side rendering
  const [chatMessages, setChatMessages] = useState<Message[]>([defaultMessage]);
  const [isClient, setIsClient] = useState(false);

  // Effect to update the chatMessages state with new messages from useChat
  useEffect(() => {
    if (messages && messages.length > 0) {
      const processedMessages = messages.map(msg => ({
        ...msg,
        content: typeof msg.content === 'string' ? marked(msg.content) : msg.content,
      }));
      setChatMessages(processedMessages);
    }
  }, [messages]);

  // Effect to set client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to render Markdown content as HTML
  const renderMarkdownContent = (content: string) => {
    return isClient ? <div className="markdown-container" dangerouslySetInnerHTML={{ __html: marked(content) }} /> : null;
  };

  return (
    <div className="space-y-4 max-w-5xl w-full">
      <ChatMessages
        messages={chatMessages.map(msg => ({
          ...msg,
          content: typeof msg.content === 'string' ? renderMarkdownContent(msg.content) : msg.content,
        }))}
        isLoading={isLoading}
        reload={reload}
        stop={stop}
      />
      <ChatInput
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        isLoading={isLoading}
      />
    </div>
  );
}
