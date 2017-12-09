import * as React from "react";
import { TopMenu } from "./TopMenu";
import { RootState } from "src/store";
import { connect } from "react-redux";
import { DownloadBtn } from "./DownloadBtn";
import { Redirect } from "react-router-dom";

const mapStateToProps = (state: RootState) => ({
  poFile: state.app.poFile
});

export const BasePage = connect(mapStateToProps, {})(props => {
  if (!props.poFile) {
      return <Redirect to="/"/>;
  }
  return (
    <div style={{ width: "500px", margin: "0 auto" }}>
      <TopMenu />
      {props.children}
      <DownloadBtn poFile={props.poFile} />
    </div>
  );
});
