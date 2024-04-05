import React, { useContext, useRef } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { ChatContext } from "./ChatContext";

type Props = {
  isDisabled?: boolean;
};

const ChatInput = ({ isDisabled = false }: Props) => {
  const { addMessage, isLoading, handleInputChange, message } =
    useContext(ChatContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="absolute bottom-10 left-0 w-full bg-white">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder="Enter your question"
                rows={1}
                maxRows={4}
                autoFocus
                value={message}
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-ligher scrollbar-w-2 scrolling-touch"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                    textareaRef.current?.focus();
                  }
                }}
                onChange={handleInputChange}
              />
              <Button
                disabled={isLoading || isDisabled}
                aria-label="send-message"
                type="submit"
                onClick={() => {
                  addMessage();
                  textareaRef.current?.focus();
                }}
                className="absolute bottom-1.5 right-[8px]"
              >
                <Send className="h-5 w-5 mr-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
