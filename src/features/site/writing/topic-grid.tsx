import Link from "next/link";
import type { WritingTopic } from "@/lib/content/schema";

export function TopicGrid({ topics }: { topics: WritingTopic[] }) {
  return (
    <div className="topic-grid">
      {topics.map((topic) => (
        <Link className="topic-card" href={`/writing/${topic.slug}`} key={topic.slug}>
          <div className="eyebrow">Topic</div>
          <h3>{topic.title}</h3>
          <p>{topic.description}</p>
        </Link>
      ))}
    </div>
  );
}
