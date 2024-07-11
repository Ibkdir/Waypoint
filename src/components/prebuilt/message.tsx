import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export interface MessageTextProps {
  content: string;
}

const CustomMarkdown = ({ content }: { content: string }) => (
  <ReactMarkdown
    rehypePlugins={[rehypeRaw]}
    components={{
      p: (props) => <div {...props} />,
    }}
  >
    {content}
  </ReactMarkdown>
);

export function AIMessageText(props: MessageTextProps) {
  return (
    <div className="flex mr-auto w-fit max-w-[700px] bg-gray-200 rounded-md px-2 py-1 mt-3">
      <div className="text-normal text-gray-800 text-left break-words">
        <CustomMarkdown content={props.content} />
      </div>
    </div>
  );
}

export function HumanMessageText(props: MessageTextProps) {
  return (
    <div className="flex ml-auto w-fit max-w-[700px] bg-blue-400 rounded-md px-2 py-1">
      <p className="text-normal text-gray-50 text-left break-words">
        {props.content}
      </p>
    </div>
  );
}