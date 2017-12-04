import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragEvent } from 'react';
import * as PropTypes from 'prop-types';
import './App.css';
import { parse, Message, Messages, PoData } from './parser';
import { serialize } from './serializer';

type EditorProps = {
  poData: PoData;
};

class Editor extends React.Component<{}, {}> {
  static propTypes = {
    poData: PropTypes.object
  };

  translations = {};

  constructor(props: EditorProps) {
    super(props);
    this.state = { poData: props.poData };
  }

  updateTranslation(key: string, index: number, value: string) {
    if (!this.translations[key]) {
      this.translations[key] = new Array();
    }
    this.translations[key][index] = value;
  }

  downloadTranslations() {
    for (const key of Object.keys(this.translations)) {
      this.state.poData.translations[''][key].msgstr = this.translations[key];
    }
    const content = serialize(this.state.poData);
    const blob = new Blob([content], { type: 'text/plain' });
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = 'translated.po';
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }

  renderMsg(key: string, msg: Message) {
    if (msg.msgid === '') {
      return null;
    }
    return (
      <div key={key}>
        <div>
          <span>msgid</span>
          &nbsp;
          <span>{msg.msgid}</span>
        </div>
        <div>
          {msg.msgstr.map((translation: string, index: number) => {
            return (
              <div key={`${key}_${index}`}>
                <span style={{ verticalAlign: 'top' }}>{`msgstr[${index}] `}</span>
                <textarea
                  defaultValue={translation}
                  onChange={ev => this.updateTranslation(key, index, ev.target.value)}
                  style={{ display: 'inline-block' }}
                />
              </div>
            );
          })}
        </div>
        <br />
      </div>
    );
  }

  iterMessages = function*(m: Messages): IterableIterator<Message> {
    for (const key of Object.keys(m)) {
      yield m[key];
    }
  };

  render() {
    return (
      <div>
        <div>
          {Object.keys(this.state.poData.translations['']).map((key: string) =>
            this.renderMsg(key, this.state.poData.translations[''][key])
          )}
        </div>
        <input type="button" value="Download" onClick={() => this.downloadTranslations()} />
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props: {}) {
    super(props);
  }

  onDrop(evt: DragEvent<HTMLDivElement>) {
    evt.stopPropagation();
    evt.preventDefault();

    const files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    for (let i = 0, f; (f = files[i]); i++) {
      const reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = function(e: {}) {
        const data = e.target.result;
        const poData = parse(data);
        ReactDOM.render(<Editor poData={poData} />, document.getElementById('root') as HTMLElement);
      };
      reader.readAsText(f);
    }
  }

  onDragOver(evt: DragEvent<HTMLDivElement>) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  render() {
    return (
      <div
        style={{ width: '500px', height: '500px', border: '1px solid black' }}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
      >
        <strong>Drag one or more files to this Drop Zone ...</strong>
        <input type="file" />
      </div>
    );
  }
}

export default App;
