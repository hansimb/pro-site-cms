import { WritingEditor } from "@/features/admin/writing/article-editor";
import { getAllArticles, getWritingTopics } from "@/lib/content/loaders";

export default async function AdminWritingPage() {
  const [topics, articles] = await Promise.all([getWritingTopics(), getAllArticles()]);

  return (
    <div className="admin-page">
      <header className="page-header">
        <div className="eyebrow">Admin</div>
        <h1 className="page-title">Writing</h1>
        <p>
          Manage your topics, edit Markdown articles, and keep references structured
          without opening a separate editor.
        </p>
      </header>
      <WritingEditor initialArticles={articles} initialTopics={topics} />
    </div>
  );
}
