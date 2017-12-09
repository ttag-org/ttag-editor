import * as React from "react";
import { DragEvent } from "react";
import { PoData, parse } from "src/lib/parser";

type DragProps = {
    onFileAvailable: (file: PoData) => void
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
        <div
          style={{
            width: "300px",
            height: "200px",
            margin: "0 auto",
            border: "3px dotted gray",
            transform: "translateY(100%)"
          }}
          onDrop={this.onDrop}
          onDragOver={this.onDragOver}
        >
          <div style={{ width: "170px", margin: "0 auto", position: "relative", top: "50%" }}>
            <strong>Drag one or more files</strong>
          </div>
        </div>
      );
    }
}