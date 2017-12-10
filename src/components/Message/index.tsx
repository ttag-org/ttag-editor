import * as React from "react";
import { Message } from "src/lib/parser";

type MessageProps = {
  message: Message;
  onUpdate: (msgid: string, msgctxt: string, idx: number, value: string) => void;
};

export const MessageItem = (props: MessageProps) => {
  const msg = props.message;
  if (msg.msgid === "") {
    return null;
  }
  return (
    <div key={msg.msgid}>
        {msg.msgctxt ? (
          <div>
            <span>msgctxt</span>
            &nbsp;
            <span>{msg.msgctxt}</span>
          </div>
        ) : null}
        <div>
          <span>msgid</span>
          &nbsp;
          <span>{msg.msgid}</span>
        </div>
        <div>
          {msg.msgstr.map((translation: string, index: number) => {
            return (
              <div key={`${msg.msgid}_${index}`}>
                <span style={{ verticalAlign: "top" }}>{`msgstr[${index}] `}</span>
                <textarea
                  defaultValue={translation}
                  onChange={ev => props.onUpdate(msg.msgid, msg.msgctxt || "", index, ev.target.value)}
                  style={{ display: "inline-block" }}
                />
              </div>
            );
          })}
        </div>
        <br />
      </div>
  );
};
