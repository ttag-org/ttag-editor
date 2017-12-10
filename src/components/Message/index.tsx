import * as React from "react";
import { Message } from "src/lib/parser";
import { Card, CardTitle, CardText } from "material-ui/Card";
import Chip from "material-ui/Chip";
import TextField from "material-ui/TextField";

type MessageProps = {
  message: Message;
  onUpdate: (msgid: string, msgctxt: string, idx: number, value: string) => void;
};

function MessageTitle({ message }: { message: Message}) {
  const { msgctxt, msgid } = message;
  let chipTitle: {} = msgid;
  if (msgctxt) {
    chipTitle = (
      <span style={{display: "flex", flexDirection: "row"}}>
        <span style={{marginRight: "10px"}}>{msgid}</span>
        <Chip>{msgctxt}</Chip>
      </span>
    );
  }
  return <CardTitle title={chipTitle} />;
}

export const MessageItem = (props: MessageProps) => {
  const msg = props.message;
  if (msg.msgid === "") {
    return null;
  }
  return (
    <Card>
        <MessageTitle message={msg}/>
        <CardText>
            {msg.msgstr.map((translation: string, index: number) => {
              return (
                  <TextField
                    key={`${msg.msgid}_${index}`}
                    hintText={`Translation for "${msg.msgid}"`}
                    floatingLabelText="Enter translation"
                    multiLine={true}
                    defaultValue={translation}
                    onChange={(ev, value) => props.onUpdate(msg.msgid, msg.msgctxt || "", index, value)}
                    style={{ display: "inline-block" }}
                  />
              );
            })}
        </CardText>
      </Card>
  );
};
