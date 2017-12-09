import * as React from "react";
import { PoData } from "src/lib/parser";

type StatsProps = {
    poFile: PoData
};

export const Stats = (props: StatsProps) => {
    return (
        <div>
            <h1>Translations loaded</h1>
        </div>
    );
};
