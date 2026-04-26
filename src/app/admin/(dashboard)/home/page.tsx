import { BlockEditor } from "@/features/admin/home/block-editor";
import { MediaLibrary } from "@/features/admin/media/media-library";
import { getHomeDocument, getUploadedMediaPaths } from "@/lib/content/loaders";

export default async function AdminHomePage() {
  const [homeDocument, mediaPaths] = await Promise.all([getHomeDocument(), getUploadedMediaPaths()]);

  return (
    <div className="admin-page">
      <header className="page-header">
        <div className="eyebrow">Admin</div>
        <h1 className="page-title">Home editor</h1>
        <p>Add, reorder, and edit the blocks that shape your home page.</p>
      </header>
      <BlockEditor initialDocument={homeDocument} />
      <MediaLibrary initialPaths={mediaPaths} />
    </div>
  );
}
