import * as React from "react";
import { Message } from "src/lib/parser";
import { MessageItem } from "src/components/Message";

type MessageListProps = {
  messages: Message[];
  onMsgUpdate: (msgid: string, idx: number, value: string) => void;
};

export const MessageList = (props: MessageListProps) => {
    return (
        <div>
          {props.messages.map(m => (
            <MessageItem
              key={m.msgid}
              message={m}
              onUpdate={props.onMsgUpdate}
            />
          ))}
        </div>
    );
};
