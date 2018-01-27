import * as React from "react";
import { PoData } from "src/lib/parser";
import { serialize } from "src/lib/serializer";
import RaisedButton from "material-ui/RaisedButton";

type SaveBtnProps = {
  poFile: PoData;
};

function saveTranslations(poData: PoData) {
  const content = serialize(poData);
  fetch("/save", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        "Content-Length": content.length.toString(),
      },
      body: content
  });
}

export const SaveBtn = (props: SaveBtnProps) => {
  return (
    <RaisedButton
      secondary={true}
      label="Save"
      onClick={() => saveTranslations(props.poFile)}
    />
  );
};
