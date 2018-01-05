import * as React from "react";
import { RootState } from "src/store";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import { EditorTitle } from "./EditorTitle";
import { Link } from "react-router-dom";
import { DownloadBtn } from "./DownloadBtn";
import RaisedButton from "material-ui/RaisedButton";
import { PoData } from "src/lib/parser";

const TopMenu = (props: {poFile: PoData}) => {
  return (
    <div>
      <Link to={`/upload`}>
        <RaisedButton primary={true} label="Upload"/>
      </Link>
      <Link to={`/all`}>
        <RaisedButton primary={true} label="All translations"/>
      </Link>
      <DownloadBtn poFile={props.poFile}/>
    </div>
  );
};

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
        iconElementRight={<TopMenu poFile={props.poFile} />}
      />
      {props.children}
    </div>
  );
});
