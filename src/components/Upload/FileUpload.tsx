import * as React from "react";
import { DragEvent } from "react";
import { PoData, parse } from "src/lib/parser";
import Paper from "material-ui/Paper";
import FlatButton from "material-ui/FlatButton";
import "./FileUpload.css";

type FileUploadProps = {
  onFileAvailable: (file: PoData) => void;
};

export class FileUpload extends React.Component<FileUploadProps, {}> {
  constructor(props: FileUploadProps) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.onSelectFiles = this.onSelectFiles.bind(this);
  }

  onDrop(evt: DragEvent<HTMLDivElement>) {
    evt.stopPropagation();
    evt.preventDefault();

    const files = evt.dataTransfer.files; // FileList object.
    this.readFiles(files);
  }

  onDragOver(evt: DragEvent<HTMLDivElement>) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
  }

  onSelectFiles(evt: React.FormEvent<HTMLInputElement>) {
    const target = (evt.target as HTMLInputElement);
    if (target.files !== null) {
      this.readFiles(target.files);
    }
  }

  render() {
    return (
        <div
          className="dndContainer"
          onDrop={this.onDrop}
          onDragOver={this.onDragOver}
        >
          <Paper className="dndArea" zDepth={3}>
            <FlatButton 
                className="fileInputButton"
                containerElement="label"
                label="Select files"
                primary={true}
            >
                <input 
                  accept=".po"
                  className="fileInput"
                  multiple
                  onChange={this.onSelectFiles}
                  type="file"
                />
            </FlatButton>
            <strong>or drag-n-drop them here</strong>
          </Paper>
      </div>
    );
  }

  private readFiles(files: FileList) {
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

}
