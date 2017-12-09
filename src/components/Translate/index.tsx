import * as React from "react";
import { BasePage } from "src/components/Base";
import { RootState } from "src/store";
import { connect } from "react-redux";
import { MessageItem } from "src/components/Message";
import { Link, Redirect } from "react-router-dom";
import { Message } from "src/lib/parser";
import { actionCreators } from "src/components/App/actions";

const mapStateToProps = (state: RootState) => ({
  poFile: state.app.poFile
});

const mapDispatchToProps = { onTranslationUpdate: actionCreators.updateTranslation };

function isTranslated(msg: Message): boolean {
  return msg.msgstr.filter(s => !!s).length === msg.msgstr.length;
}

export const Translate = connect(mapStateToProps, mapDispatchToProps)(props => {
  if (!props.poFile) {
    return <Redirect to="/" />;
  }
  const translations = props.poFile.translations[""];
  const keys = Object.keys(translations);
  const untranslatedKey = keys.slice(1).find(k => !isTranslated(translations[k]));

  if (untranslatedKey === undefined) {
    return (
      <BasePage>
        <div>All Done!</div>
      </BasePage>
    );
  }

  return (
    <BasePage>
      <MessageItem message={translations[untranslatedKey]} onUpdate={props.onTranslationUpdate} />
      <Link to={`/translate`}>Next</Link>
    </BasePage>
  );
});
