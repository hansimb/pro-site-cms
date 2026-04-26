import Image from "next/image";
import type { HomeBlock } from "@/lib/content/schema";

type ImageBlock = Extract<HomeBlock, { type: "image" }>;

export function ImageSection({ block }: { block: ImageBlock }) {
  return (
    <section className="content-card section-stack">
      <div className="image-frame">
        <Image alt={block.alt} height={900} src={block.src} width={1600} />
      </div>
      {block.caption ? <p>{block.caption}</p> : null}
    </section>
  );
}
