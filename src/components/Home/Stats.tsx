import * as React from "react";
import { PoData, Message } from "src/lib/parser";
import { BasePage } from "src/components/Base";

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
  const untranslatedPercent = Math.floor(translatedCount / keys.length * 100);
  return (
    <BasePage>
      <div
        style={{
          border: "1px solid black",
          height: "50px",
          width: "500px",
          margin: "0 auto"
        }}
      >
        <div
          style={{
            "background-color": "red",
            height: "100%",
            width: `${untranslatedPercent}%`,
            color: "cyan",
            "text-align": "center",
            "line-height": "50px",
            "vertical-align": "middle"
          }}
        >
          {`${untranslatedPercent}% is translated`}
        </div>
      </div>
    </BasePage>
  );
};
