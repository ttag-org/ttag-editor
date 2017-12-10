import * as React from "react";
import { TopMenu } from "./TopMenu";
import { RootState } from "src/store";
import { connect } from "react-redux";
import { DownloadBtn } from "./DownloadBtn";
import { Redirect } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import { EditorTitle } from "./EditorTitle";
// import {
//   Toolbar,
//   ToolbarGroup,
//   ToolbarSeparator,
// } from "material-ui/Toolbar";

const mapStateToProps = (state: RootState) => ({
  poFile: state.app.poFile
});

export const BasePage = connect(mapStateToProps, {})(props => {
  if (!props.poFile) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <AppBar
        title={<EditorTitle/>}
        iconElementLeft={<span />}
        iconElementRight={<TopMenu />}
      />
      {props.children}
      <DownloadBtn poFile={props.poFile} />
    </div>
  );
});
