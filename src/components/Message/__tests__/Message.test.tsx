import * as React from "react";
import { MessageItem } from "../index";
import { mount } from "enzyme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import TextField from "material-ui/TextField";
import { CardTitle } from "material-ui/Card";
import * as PropTypes from "prop-types";

const muiTheme = getMuiTheme();

const message = {
  msgid: "test",
  msgstr: ["trans"]
};
const onUpdate = () => void 0;

describe("<MessageItem />", () => {
  const msgEl = mount(
    <MessageItem message={message} onUpdate={onUpdate} />,
    { context: { muiTheme },
    childContextTypes: { muiTheme: PropTypes.object } }
  );

  it("renders source string", () => {
    const translation = msgEl.find(CardTitle);
    expect(translation.prop("title")).toBe("test");
  });

  it("render message item with 1 translation", () => {
    const translation = msgEl.find(TextField);
    expect(translation.exists()).toBe(true);
    expect(translation.length).toBe(1);
  });

  it("renders translation if present", () => {
    const translation = msgEl.find(TextField);
    expect(translation.prop("defaultValue")).toBe("trans");
  });

  it("should render floating label text", () => {
    const translation = msgEl.find(TextField);
    expect(translation.prop("floatingLabelText")).toBe("Enter translation");
  });
});
