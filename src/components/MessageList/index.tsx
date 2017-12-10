import * as React from "react";
import { Link } from "react-router-dom";
import { PoData, Message } from "src/lib/parser";
import { Searcher, indexDocs } from "src/lib/searcher";
import { MessageItem } from "src/components/Message";

type MessageListState = {
  searchTerm: string;
  page: number;
};

type MessageListProps = {
  poData: PoData;
  onMsgUpdate: (msgid: string, idx: number, value: string) => void;
};

export class MessageList extends React.Component<
  MessageListProps,
  MessageListState
> {
  state = {
    page: 0,
    searchTerm: ""
  };

  msgIndex: Searcher;

  constructor(props: MessageListProps) {
    super(props);
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
    this.getFilteredMessages = this.getFilteredMessages.bind(this);
    const docs = [];
    for (let key of Object.keys(props.poData.translations[""])) {
      docs.push(props.poData.translations[""][key]);
    }
    this.msgIndex = indexDocs(docs);
  }

  updateSearchTerm(searchTerm: string) {
    this.setState({ searchTerm, page: 0 });
  }

  getFilteredMessages(): Message[] {
    const poData = this.props.poData;
    if (this.state.searchTerm.trim()) {
      const docs = this.msgIndex.search(this.state.searchTerm.trim());
      return docs.map(d => this.props.poData.translations[""][d.msgid]);
    } else {
      const keys = Object.keys(poData.translations[""]);
      return keys.map(k => poData.translations[""][k]);
    }
  }

  render() {
    const page = this.state.page;
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
        <div>
          {slice.map(m => (
            <MessageItem
              key={m.msgid}
              message={m}
              onUpdate={this.props.onMsgUpdate}
            />
          ))}
        </div>
      </div>
    );
  }
}
