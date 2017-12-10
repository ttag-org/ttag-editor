import * as React from "react";
import { BasePage } from "src/components/Base";
import { RootState } from "src/store";
import { connect } from "react-redux";
import { MessageList } from "src/components/MessageList";
import { actionCreators } from "src/components/App/actions";
import { Redirect } from "react-router-dom";

const mapStateToProps = (state: RootState) => ({
  poFile: state.app.poFile
});

const mapDispatchToProps = {
  onTranslationUpdate: actionCreators.updateTranslation
};

export const TranslateAll = connect(mapStateToProps, mapDispatchToProps)(
  props => {
    if (!props.poFile) {
      return <Redirect to="/"/>;
    }
    return (
      <BasePage>
        <MessageList poData={props.poFile} onMsgUpdate={props.onTranslationUpdate} />
      </BasePage>
    );
  }
);
