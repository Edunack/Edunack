import { DiscussionEmbed } from "disqus-react";

interface Props {
  id: string;
  title: string;
}

function DisqusElement({ id, title }: Props) {
  const disqusShortname = "edunack";
  const disqusConfig = {
    url: `${window.location.origin}/courses/${id}`,
    identifier: id,
    title: title,
  };

  return (
    <div style={{ width: "100%" }}>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
}

export default DisqusElement;
