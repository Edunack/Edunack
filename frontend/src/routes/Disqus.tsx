import { DiscussionEmbed } from "disqus-react";

interface Props {
  id: string;
  title: string;
  width?: string;
}

function DisqusElement({ id, title, width }: Props) {
  const disqusShortname = "edunack";
  const disqusConfig = {
    url: `${window.location.origin}/courses/${id}`,
    identifier: id,
    title: title,
  };

  return (
    <div style={{ width: width ? width : "100%" }}>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
}

export default DisqusElement;
