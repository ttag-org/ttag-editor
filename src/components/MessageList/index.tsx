import * as React from "react";
import { BasePage } from "src/components/Base";
import { RootState } from "src/store";
import { connect } from "react-redux";

const mapStateToProps = (state: RootState) => ({
  poFile: state.app.poFile
});

export const MessageList = connect(mapStateToProps, {})(props => {
  return (
    <BasePage>
      <div>All Translations</div>
    </BasePage>
  );
});
