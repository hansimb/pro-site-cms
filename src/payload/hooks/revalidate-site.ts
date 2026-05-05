import { revalidatePath } from "next/cache";

export async function revalidatePublicSite() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/robots.txt");
    revalidatePath("/sitemap.xml");
  } catch (error) {
    console.error("Failed to revalidate public site", error);
  }
}
