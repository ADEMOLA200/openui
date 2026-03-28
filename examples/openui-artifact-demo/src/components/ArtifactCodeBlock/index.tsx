"use client";

import { defineComponent } from "@openuidev/react-lang";
import { ArtifactPanel } from "@openuidev/react-ui";
import { ArtifactCodeBlockSchema } from "./schema";
import { InlinePreview } from "./InlinePreview";
import { ArtifactView } from "./ArtifactView";

export { ArtifactCodeBlockSchema } from "./schema";
export type { ArtifactCodeBlockProps } from "./schema";

export const ArtifactCodeBlock = defineComponent({
  name: "ArtifactCodeBlock",
  props: ArtifactCodeBlockSchema,
  description:
    "Code block that opens in the artifact side panel for full viewing",
  component: ({ props }) => (
    <>
      <InlinePreview
        artifactId={props.artifactId as string}
        language={props.language as string}
        title={props.title as string}
        codeString={props.codeString as string}
      />
      <ArtifactPanel
        artifactId={props.artifactId as string}
        title={props.title as string}
      >
        <ArtifactView
          language={props.language as string}
          codeString={props.codeString as string}
          title={props.title as string}
        />
      </ArtifactPanel>
    </>
  ),
});
