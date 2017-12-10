import * as React from "react";
import { PoData, Message } from "src/lib/parser";
import { BasePage } from "src/components/Base";
import LinearProgress from "material-ui/LinearProgress";
// import Paper from "material-ui/Paper";
import { Card, CardHeader, CardActions } from "material-ui/Card";
import RaisedButton from "material-ui/RaisedButton";
import { Link } from "react-router-dom";

type StatsProps = {
  poFile: PoData;
};

function isTranslated(msg: Message): boolean {
  return msg.msgstr.filter(s => !!s).length === msg.msgstr.length;
}

export const Stats = (props: StatsProps) => {
  const translations = props.poFile.translations[""];
  const keys = Object.keys(translations);
  const translatedCount = keys.reduce((acc: number, key: string): number => {
    return isTranslated(translations[key]) ? acc + 1 : acc;
  }, 0);
  const translatedPercent = Math.floor(translatedCount / keys.length * 100);
  return (
    <BasePage>
      <Card>
        <CardHeader title={`Translated ${translatedPercent}%`}/>
        <LinearProgress mode="determinate" value={translatedPercent} color="green"/>
        <CardActions>
          <Link to="/translate">
            <RaisedButton label="Translate" primary={true}/>
          </Link>
        </CardActions>
      </Card>
    </BasePage>
  );
};
