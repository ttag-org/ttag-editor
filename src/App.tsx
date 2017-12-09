import * as React from "react";
import * as ReactDOM from "react-dom";
import { DragEvent } from "react";
import * as PropTypes from "prop-types";
import "./App.css";
import { parse, Message, PoData, Translations } from "./parser";
import { serialize } from "./serializer";
import indexDocs from "./searcher";
import { Searcher } from "./searcher";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function isTranslated(msg: Message): boolean {
  return msg.msgstr.filter(s => !!s).length === msg.msgstr.length;
}

function* iterateTranslations(translations: Translations): IterableIterator<Message> {
  for (const ctxtId of Object.keys(translations)) {
    const ctxt = translations[ctxtId];
    for (const msgid of Object.keys(ctxt)) {
      yield ctxt[msgid];
    }
  }
}

type EditorProps = {
  poData: PoData;
};

type EditorState = {
  poData: PoData;
  msgs: Message[];
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
      searchTerm: "",
      page: 0,
      // msgs are an array of references, so changing translations will change them also
      msgs: Array.from(iterateTranslations(props.poData.translations))
    };
    this.msgIndex = indexDocs(this.state.msgs);
  }

  updateTranslation(key: string, ctxt: string, index: number, value: string) {
    // Mutable state, hoozah!
    this.state.poData.translations[ctxt][key].msgstr[index] = value;
  }

  downloadTranslations() {
    const content = serialize(this.state.poData);
    const blob = new Blob([content], { type: "text/plain" });
    const elem = window.document.createElement("a");
    elem.href = window.URL.createObjectURL(blob);
    elem.download = "translated.po";
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }

  renderMsg(msg: Message) {
    if (msg.msgid === "") {
      return null;
    }
    return (
      <div key={msg.msgid}>
        {msg.msgctxt ? (
          <div>
            <span>msgctxt</span>
            &nbsp;
            <span>{msg.msgctxt}</span>
          </div>
        ) : null}
        <div>
          <span>msgid</span>
          &nbsp;
          <span>{msg.msgid}</span>
        </div>
        <div>
          {msg.msgstr.map((translation: string, index: number) => {
            return (
              <div key={`${msg.msgid}_${index}`}>
                <span style={{ verticalAlign: "top" }}>{`msgstr[${index}] `}</span>
                <textarea
                  defaultValue={translation}
                  onChange={ev => this.updateTranslation(msg.msgid, msg.msgctxt || "", index, ev.target.value)}
                  style={{ display: "inline-block" }}
                />
              </div>
            );
          })}
        </div>
        <br />
      </div>
    );
  }

  updateSearchTerm(searchTerm: string) {
    this.setState({ searchTerm, page: 0 });
  }

  getFilteredMessages(): Message[] {
    const translations = this.state.poData.translations;
    if (this.state.searchTerm.trim()) {
      const docs = this.msgIndex.search(this.state.searchTerm.trim());
      return docs.map(d => translations[d.msgctxt || ""][d.msgid]);
    } else {
      return this.state.msgs;
    }
  }

  renderStats() {
    const translatedCount = this.state.msgs.reduce((acc: number, msg: Message): number => {
      return isTranslated(msg) ? acc + 1 : acc;
    }, 0);
    const untranslatedPercent = Math.floor(translatedCount / this.state.msgs.length * 100);
    return (
      <div style={{ width: "720px", margin: "0 auto" }}>
        <div style={{ border: "1px solid black", height: "50px", width: "500px", margin: "0 auto" }}>
          <div
            style={{
              "background-color": "red",
              height: "100%",
              width: `${untranslatedPercent}%`,
              color: "cyan",
              "text-align": "center",
              "line-height": "50px",
              "vertical-align": "middle"
            }}
          >
            {`${untranslatedPercent}% is translated`}
          </div>
        </div>
      </div>
    );
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
            autoFocus={true}
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
    const untranslatedMsg = this.state.msgs.slice(1).find(msg => !isTranslated(msg));
    if (untranslatedMsg === undefined) {
      return <div>All Done!</div>;
    } else {
      return (
        <div>
          {this.renderMsg(untranslatedMsg)}
          <Link to={`/translate`}>Next</Link>
        </div>
      );
    }
  }

  render() {
    return (
      <Router>
        <div style={{ width: "500px", margin: "0 auto" }}>
          <Link to={`/translate`}>Translate</Link>
          <Link to={`/all`}>All</Link>
          <Route exact={true} path="/" component={() => this.renderStats()} />
          <Route exact={true} path="/all" component={() => this.renderMsgs(0)} />
          <Route exact={true} path="/translate" component={() => this.renderTranslate()} />
          <Route
            path="/page/:page"
            component={({ match: { params: { page } } }: { match: { params: { page: string } } }) =>
              this.renderMsgs(parseInt(page, 10))
            }
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
        ReactDOM.render(<Editor poData={poData} />, document.getElementById("root") as HTMLElement);
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

export default App;
