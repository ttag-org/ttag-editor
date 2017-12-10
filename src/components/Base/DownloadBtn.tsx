import * as React from "react";
import { PoData } from "src/lib/parser";
import { serialize } from "src/lib/serializer";
import RaisedButton from "material-ui/RaisedButton";

type DownloadBtnProps = {
  poFile: PoData;
};

function downloadTranslations(poData: PoData) {
  const content = serialize(poData);
  const blob = new Blob([content], { type: "text/plain" });
  const elem = window.document.createElement("a");
  elem.href = window.URL.createObjectURL(blob);
  elem.download = "translated.po";
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}

export const DownloadBtn = (props: DownloadBtnProps) => {
  return (
    <RaisedButton
      secondary={true}
      label="Download"
      onClick={() => downloadTranslations(props.poFile)}
    />
  );
};
