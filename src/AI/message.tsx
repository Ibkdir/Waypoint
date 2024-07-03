"use client";

import { AIMessageText } from "~/components/prebuilt/Message";
import { type StreamableValue, useStreamableValue } from "ai/rsc";

export function AIMessage(props: { value: StreamableValue<string> }) {
  const [data] = useStreamableValue(props.value);

  if (!data) {
    return null;
  }
  return <AIMessageText content={data} />;
}
