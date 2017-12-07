import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragEvent } from 'react';
import * as PropTypes from 'prop-types';
import './App.css';
import { parse, Message, Messages, PoData } from './parser';
import { serialize } from './serializer';
import indexDocs from './searcher';
import { Searcher } from './searcher';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

type EditorProps = {
  poData: PoData;
};

type EditorState = {
  poData: PoData;
  searchTerm: string;
  page: number;
};

class Editor extends React.Component<EditorProps, EditorState> {
  static propTypes = {
    poData: PropTypes.object
  };

  msgIndex: Searcher;

  constructor(props: EditorProps) {
    super(props);
    this.state = {
      poData: props.poData,
      searchTerm: '',
      page: 0
    };
    const docs = [];
    for (let key of Object.keys(props.poData.translations[''])) {
      docs.push(props.poData.translations[''][key]);
    }
    this.msgIndex = indexDocs(docs);
  }

  updateTranslation(key: string, index: number, value: string) {
    // Mutable state, hoozah!
    this.state.poData.translations[''][key].msgstr[index] = value;
  }

  downloadTranslations() {
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
    this.setState({ searchTerm, page: 0 });
  }

  getFilteredMessages(): Message[] {
    if (this.state.searchTerm.trim()) {
      const docs = this.msgIndex.search(this.state.searchTerm.trim());
      return docs.map(d => this.state.poData.translations[''][d.msgid]);
    } else {
      const keys = Object.keys(this.state.poData.translations['']);
      return keys.map(k => this.state.poData.translations[''][k]);
    }
  }

  renderMsgs(page: number) {
    const msgs = this.getFilteredMessages();
    const slice = msgs.slice(page * 24, page * 24 + 24);
    return (
      <div>
        <div>
          <input 
            type="text" 
            value={this.state.searchTerm} 
            placeholder="Search" 
            onChange={ev => this.updateSearchTerm(ev.target.value)} 
          />
        </div>
        <Link to={`/page/${page - 1}`}>Prev</Link>
        <span>Current {page}</span>
        <Link to={`/page/${page + 1}`}>Next</Link>
        <div>{slice.map(m => this.renderMsg(m))}</div>
      </div>
    );
  }

  renderTranslate() {
    const translations = this.state.poData.translations[''];
    const keys = Object.keys(translations);
    const untranslatedKey = keys
      .slice(1)
      .find(k => translations[k].msgstr.filter(s => !!s).length !== translations[k].msgstr.length);
    if (untranslatedKey === undefined) {
      return <div>All Done!</div>;
    } else {
      return (
        <div>
          {this.renderMsg(translations[untranslatedKey])}
          <Link to={`/translate`}>Next</Link>
        </div>
      );
    }
  }

  render() {
    return (
      <Router>
        <div style={{ width: '500px', margin: '0 auto' }}>
          <Link to={`/translate`}>Translate</Link>
          <Link to={`/`}>All</Link>
          <Route exact={true} path="/" component={() => this.renderMsgs(0)} />
          <Route exact={true} path="/translate" component={() => this.renderTranslate()} />
          <Route
            path="/page/:page"
            component={({ match: { params: { page } } }: { match: { params: { page: string } } }) =>
              this.renderMsgs(parseInt(page, 10))}
          />
          <input type="button" value="Download" onClick={() => this.downloadTranslations()} />
        </div>
      </Router>
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
        style={{
          width: '300px',
          height: '200px',
          margin: '0 auto',
          border: '3px dotted gray',
          transform: 'translateY(100%)'
        }}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
      >
        <div style={{ width: '170px', margin: '0 auto', position: 'relative', top: '50%' }}>
          <strong>Drag one or more files</strong>
        </div>
      </div>
    );
  }
}

export default App;
