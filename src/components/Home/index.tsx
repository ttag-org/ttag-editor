import * as React from "react";
import { RootState } from "src/store";
import { connect } from "react-redux";
import { Stats } from "./Stats";
import { Redirect } from "react-router-dom";
import { actionCreators } from "src/components/App/actions";

const mapStateToProps = (state: RootState) => ({
  poFile: state.app.poFile
});

const mapDispatchToProps = { onFileLoad: actionCreators.addPoFile };

export const Home = connect(mapStateToProps, mapDispatchToProps)(props => {
  if (props.poFile) {
    return <Stats poFile={props.poFile} />;
  }
  return <Redirect to="/upload" />;
});
