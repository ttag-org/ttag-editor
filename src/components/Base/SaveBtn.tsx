import * as React from "react";
import { PoData } from "src/lib/parser";
import { serialize } from "src/lib/serializer";
import RaisedButton from "material-ui/RaisedButton";

type SaveBtnProps = {
  poFile: PoData;
  save: (text: string) => null
};

export const SaveBtn = (props: SaveBtnProps) => {
  return (
    <RaisedButton
      secondary={true}
      label="Save"
      onClick={() => props.save(serialize(props.poFile).toString())}
    />
  );
};
