import * as React from "react";
import { Link } from "react-router-dom";
import { PoData, Message, Translations } from "src/lib/parser";
import { Searcher, indexDocs } from "src/lib/searcher";
import { MessageList } from "src/components/MessageList";
import { Card, CardText, CardActions } from "material-ui/Card";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";

type TranslateAllWrapperState = {
  searchTerm: string;
};

interface TranslateAllWrapperProps {
  poData: PoData;
  page: number;
  onMsgUpdate: (
    msgid: string,
    msgctxt: string,
    idx: number,
    value: string
  ) => void;
}

function* iterateTranslations(
  translations: Translations
): IterableIterator<Message> {
  for (const ctxtId of Object.keys(translations)) {
    const ctxt = translations[ctxtId];
    for (const msgid of Object.keys(ctxt)) {
      yield ctxt[msgid];
    }
  }
}

export class TranslateAllWrapper extends React.Component<
  TranslateAllWrapperProps,
  TranslateAllWrapperState
> {
  state = {
    searchTerm: ""
  };

  msgIndex: Searcher;

  constructor(props: TranslateAllWrapperProps) {
    super(props);
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
    this.getFilteredMessages = this.getFilteredMessages.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.msgIndex = indexDocs(this.getMessages());
  }

  getMessages(): Message[] {
    return Array.from(iterateTranslations(this.props.poData.translations));
  }

  updateSearchTerm(searchTerm: string) {
    this.setState({ searchTerm });
  }

  getFilteredMessages(): Message[] {
    const poData = this.props.poData;
    if (this.state.searchTerm.trim()) {
      const docs = this.msgIndex.search(this.state.searchTerm.trim());
      return docs.map(d => poData.translations[d.msgctxt || ""][d.msgid]);
    } else {
      return this.getMessages();
    }
  }

  render() {
    const page = this.props.page;
    const msgs = this.getFilteredMessages();
    const messagesPage = msgs.slice(page * 24, page * 24 + 24);
    return (
      <div>
        <Card>
          <CardText>
            <TextField
              type="text"
              value={this.state.searchTerm}
              hintText="Search by msgid"
              autoFocus={true}
              onChange={(ev, newValue) => this.updateSearchTerm(newValue)}
            />
          </CardText>
        </Card>
        <MessageList
          messages={messagesPage}
          onMsgUpdate={this.props.onMsgUpdate}
        />
        <Card>
          <CardActions>
            <Link to={`/all/${page - 1}`}>
              <RaisedButton secondary={true} label="Prev"/>
            </Link>
            <Link to={`/all/${page + 1}`}>
              <RaisedButton secondary={true} label="Next"/>
            </Link>
          </CardActions>
        </Card>
      </div>
    );
  }
}
