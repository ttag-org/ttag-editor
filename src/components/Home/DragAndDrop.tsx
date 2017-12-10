import * as React from "react";
import { DragEvent } from "react";
import { PoData, parse } from "src/lib/parser";
import AppBar from "material-ui/AppBar";
import Paper from "material-ui/Paper";
import "./DragAndDrop.css";
import { EditorTitle } from "src/components/Base/EditorTitle";

type DragProps = {
  onFileAvailable: (file: PoData) => void;
};

export class DragAndDrop extends React.Component<DragProps, {}> {
  constructor(props: DragProps) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(evt: DragEvent<HTMLDivElement>) {
    evt.stopPropagation();
    evt.preventDefault();

    const files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    for (let i = 0, f; (f = files[i]); i++) {
      const reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (e: Event) => {
        const data = reader.result;
        const poData = parse(data);
        this.props.onFileAvailable(poData);
      };
      reader.readAsText(f);
    }
  }

  onDragOver(evt: DragEvent<HTMLDivElement>) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
  }

  render() {
    return (
      <div>
        <AppBar title={<EditorTitle/>} iconElementLeft={<span />} />
        <div
          className="dndContainer"
          onDrop={this.onDrop}
          onDragOver={this.onDragOver}
        >
          <Paper className="dndArea" zDepth={3}>
            <strong>Drag one or more files</strong>
          </Paper>
        </div>
      </div>
    );
  }
}
