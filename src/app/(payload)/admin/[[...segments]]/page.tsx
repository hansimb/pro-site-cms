import configPromise from "@payload-config";
import { generatePageMetadata, RootPage } from "@payloadcms/next/views";
import { importMap } from "../importMap.js";

type PageArgs = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = ({ params, searchParams }: PageArgs) =>
  generatePageMetadata({ config: configPromise, params, searchParams });

export default function AdminPage({ params, searchParams }: PageArgs) {
  return RootPage({ config: configPromise, importMap, params, searchParams });
}
