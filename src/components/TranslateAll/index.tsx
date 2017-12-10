import * as React from "react";
import { BasePage } from "src/components/Base";
import { RootState } from "src/store";
import { connect } from "react-redux";
import { TranslateAllWrapper } from "./TranslateAllWrapper";
import { actionCreators } from "src/components/App/actions";
import { Redirect, withRouter, RouteComponentProps } from "react-router-dom";
import { PoData } from "src/lib/parser";

const mapStateToProps = (state: RootState) => ({
  poFile: state.app.poFile
});

const mapDispatchToProps = {
  onTranslationUpdate: actionCreators.updateTranslation
};

interface TranslateAllParams {
  page?: string;
}

interface TranslateAllWitRouteProps
  extends RouteComponentProps<TranslateAllParams> {
  poFile: PoData;
  onMsgUpdate: (msgid: string, idx: number, value: string) => void;
}

const TranslateAllWitRoute = withRouter<TranslateAllWitRouteProps>(props => {
  return (
    <TranslateAllWrapper
      page={parseInt(props.match.params.page || "0", 10)}
      poData={props.poFile}
      onMsgUpdate={props.onMsgUpdate}
    />
  );
});

export const TranslateAll = connect(mapStateToProps, mapDispatchToProps)(
  props => {
    if (!props.poFile) {
      return <Redirect to="/" />;
    }
    return (
      <BasePage>
        <TranslateAllWitRoute
          poFile={props.poFile}
          onMsgUpdate={props.onTranslationUpdate}
        />
      </BasePage>
    );
  }
);
