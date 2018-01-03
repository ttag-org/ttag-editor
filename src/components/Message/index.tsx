import * as React from "react";
import { Message } from "src/lib/parser";
import { Card, CardTitle, CardText } from "material-ui/Card";
import Chip from "material-ui/Chip";
import Subheader from "material-ui/Subheader";
import TextField from "material-ui/TextField";
import { getExamples } from "plural-forms";

type messageUpd = (
  msgid: string,
  msgctxt: string,
  idx: number,
  value: string
) => void;

type MessageProps = {
  message: Message;
  language?: string;
  onUpdate: messageUpd;
};

function MessageTitle({ message }: { message: Message }) {
  const { msgctxt, msgid } = message;
  let chipTitle: {} = msgid;
  if (msgctxt) {
    chipTitle = (
      <span style={{ display: "flex", flexDirection: "row" }}>
        <span style={{ marginRight: "10px" }}>{msgid}</span>
        <Chip>{msgctxt}</Chip>
      </span>
    );
  }
  return <CardTitle title={chipTitle} />;
}

function PluralMessageTitle({ message }: { message: Message }) {
  return (
    <div>
      <Subheader>One</Subheader>
      <MessageTitle message={message} />
      <Subheader>Few</Subheader>
      <CardTitle title={message.msgid_plural} />
    </div>
  );
}

const SingleTranslation = (props: {
  message: Message;
  onUpdate: messageUpd;
}) => {
  const message = props.message;
  const [translation] = message.msgstr;
  const index = 0;
  return (
    <TextField
      id={`trans_${message.msgid}_${index}`}
      key={`${message.msgid}_${index}`}
      hintText={`Translation for "${message.msgid}"`}
      floatingLabelText="Enter translation"
      multiLine={true}
      defaultValue={translation}
      onChange={(ev, value) =>
        props.onUpdate(message.msgid, message.msgctxt || "", index, value)
      }
    />
  );
};

class PluralsTranslation extends React.Component<{
  message: Message;
  onUpdate: messageUpd;
  language?: string;
}> {
  render() {
    const message = this.props.message;
    return message.msgstr.map((translation: string, index: number) => {
      let label = `Form ${index + 1}`;
      if (this.props.language) {
        const examples = getExamples(this.props.language)[index];
        label = `Form ${index + 1} (example: ${examples.sample})`;
      }
      return (
        <TextField
          id={`trans_${message.msgid}_${index}`}
          key={`${message.msgid}_${index}`}
          hintText={`Translation for "${message.msgid}"`}
          floatingLabelText={label}
          multiLine={true}
          defaultValue={translation}
          onChange={(ev, value) =>
            this.props.onUpdate(
              message.msgid,
              message.msgctxt || "",
              index,
              value
            )
          }
          style={{ display: "inline-block", marginRight: "20px" }}
        />
      );
    });
  }
}

const PluralMessage = (props: MessageProps) => {
  const msg = props.message;
  return (
    <Card>
      <PluralMessageTitle message={msg} />
      <CardText>
        <PluralsTranslation
          message={msg}
          onUpdate={props.onUpdate}
          language={props.language}
        />
      </CardText>
    </Card>
  );
};

const SimpleMessage = (props: MessageProps) => {
  const msg = props.message;
  return (
    <Card>
      <MessageTitle message={msg} />
      <CardText>
        <SingleTranslation message={msg} onUpdate={props.onUpdate} />
      </CardText>
    </Card>
  );
};

export const MessageItem = (props: MessageProps) => {
  const msg = props.message;
  if (msg.msgid === "") {
    return null;
  }
  return msg.msgid_plural ? (
    <PluralMessage {...props} />
  ) : (
    <SimpleMessage {...props} />
  );
};
