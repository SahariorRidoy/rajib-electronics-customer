
import CategoryView from "@/components/category/CategoryView";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  return <CategoryView slug={slug} />;
}
