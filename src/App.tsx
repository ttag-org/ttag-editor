import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragEvent } from 'react';
import * as PropTypes from 'prop-types';
import './App.css';
import { parse, Message, Messages, PoData } from './parser';
import { serialize } from './serializer';
import index from "./searcher"
import {Searcher} from "./searcher";

type EditorProps = {
  poData: PoData;
};

type EditorState = {
  poData: PoData;
  searchTerm: string;
};

class Editor extends React.Component<EditorProps, EditorState> {
  static propTypes = {
    poData: PropTypes.object
  };

  index: Searcher;
  translations: Object;

  constructor(props: EditorProps) {
    super(props);
    this.state = { 
      poData: props.poData,
      searchTerm: '',
    };
    const docs = [];
    for (let key of Object.keys(props.poData.translations[''])){
      docs.push(props.poData.translations[''][key])
    }
    this.index = index(docs)
    this.translations = {};
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

  renderMsg(msg: Message) {
    if (msg.msgid === '') {
      return null;
    }
    return (
      <div key={msg.msgid}>
        <div>
          <span>msgid</span>
          &nbsp;
          <span>{msg.msgid}</span>
        </div>
        <div>
          {msg.msgstr.map((translation: string, index: number) => {
            return (
              <div key={`${msg.msgid}_${index}`}>
                <span style={{ verticalAlign: 'top' }}>{`msgstr[${index}] `}</span>
                <textarea
                  defaultValue={translation}
                  onChange={ev => this.updateTranslation(msg.msgid, index, ev.target.value)}
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

  updateSearchTerm(searchTerm: string) {
    this.setState({searchTerm})
  }

  getFilteredMessages(): Message[]{
    if (this.state.searchTerm.trim()) {
      const docs = this.index.search(this.state.searchTerm.trim());
      return docs.map((d) => this.state.poData.translations[''][d.msgid])
    } else {
      const keys = Object.keys(this.state.poData.translations[''])
      return keys.map((k) => this.state.poData.translations[''][k])
    }
  }

  render() {
    return (
      <div style={{width: "500px", margin: "0 auto"}}>
        <div>
          <input type="text" placeholder="Search" onChange={(ev) => this.updateSearchTerm(ev.target.value)} />
        </div>
        <div>
        {this.getFilteredMessages().map((m) => this.renderMsg(m))}
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
      reader.onload = function(e: Event) {
        const data = reader.result;
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
        style={{ width: '300px', height: '200px', margin: '0 auto', border: '3px dotted gray', transform: "translateY(100%)" }}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
      >
        <div style={{width: "170px", margin: "0 auto", position: "relative", top: "50%"}}><strong>Drag one or more files</strong></div>
      </div>
    );
  }
}

export default App;
