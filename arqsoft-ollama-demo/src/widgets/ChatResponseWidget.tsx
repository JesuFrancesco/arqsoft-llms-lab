import Markdown from "react-markdown";

export const ChatResponseWidget = ({
  title,
  response,
}: {
  title: string;
  response: string;
}) => {
  return (
    <div className="rounded-2xl max-w-1/3 w-full overflow-x-scroll border flex flex-col p-2">
      <h2 className="font-bold text-center">{title}</h2>
      <Markdown>{response}</Markdown>
    </div>
  );
};
