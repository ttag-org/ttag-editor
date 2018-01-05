import * as React from "react";
import { RootState } from "src/store";
import { connect } from "react-redux";
import { DragAndDrop } from "./DragAndDrop";
import { actionCreators, AddPoFileAction } from "src/components/App/actions";
import { PoData } from "src/lib/parser";
import { Dispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import AppBar from "material-ui/AppBar";
import { EditorTitle } from "src/components/Base/EditorTitle";
import { Link } from "react-router-dom";
import RaisedButton from "material-ui/RaisedButton";

const mapStateToProps = (state: RootState) => ({
  poFile: state.app.poFile
});

const mapDispatchToProps = (
  dispatch: Dispatch<AddPoFileAction>,
  props: RouteComponentProps<{}>
) => {
  return {
    onFileLoad: (file: PoData) => {
      dispatch(actionCreators.addPoFile(file));
      props.history.push("/");
    }
  };
};

const EmptyAppBar = () => <AppBar title={<EditorTitle />} />;

const AppBarWithFile = () => (
  <AppBar
    title={<EditorTitle />}
    iconElementRight={
      <Link to="/">
        <RaisedButton primary={true} label="Back to file" />
      </Link>
    }
  />
);

export const Upload = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(props => {
    return (
      <div>
        {props.poFile ? <AppBarWithFile /> : <EmptyAppBar />}
        <DragAndDrop onFileAvailable={props.onFileLoad} />
      </div>
    );
  })
);
