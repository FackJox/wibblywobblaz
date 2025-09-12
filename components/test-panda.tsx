"use client";

import { css } from "../styled-system/css";

export function PandaTestComponent() {
  return (
    <div
      className={css({
        backgroundColor: "primary",
        color: "primary.foreground",
        padding: "4",
        borderRadius: "md",
        margin: "2",
        fontSize: "sm",
        textAlign: "center",
      })}
    >
      PandaCSS Test Component - Hot Reloading
    </div>
  );
}