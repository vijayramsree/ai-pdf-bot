// UI component for displaying messages with distinct styling based on the role (Assistant or User)
// `cn` utility function helped to conditional apply, merge multiple classes, clean code and handle combinations

import { Message as AIMessage } from "ai";
import cn from "classnames";

interface Props {
  message: AIMessage;
}

export const Message = ({ message }: Props) => {
  const { role, content } = message;

  return (
    <div
      className={cn(
        "first:mt-4 flex flex-col mb-4 mx-4",
        role === "assistant" ? "" : "items-end",
      )}
    >
      <div className="inline-block max-w-[70%]">
        <div
          className={cn(
            "mb-1 ml-1 uppercase text-sm text-stone-800 font-semibold flex flex-col",
            role === "assistant" ? "" : "items-end",
          )}
        >
          {role === "user" ? "You" : "Assistant"}
        </div>
        <div
          className={cn(
            "rounded-xl p-4 text-stone-900 shadow-sm inline-block",
            role === "user" ? "bg-blue-400" : "bg-stone-200",
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
};
