import { notFound } from "next/navigation";
import { ConceptModule } from "@/components/ConceptModule";
import { zhConcepts } from "@/data/zh";
import type { ConceptSlug } from "@/lib/types";

export function generateStaticParams() {
  return zhConcepts.map((concept) => ({ slug: concept.slug }));
}

export default async function ZhConceptPage({ params }: { params: Promise<{ slug: ConceptSlug }> }) {
  const { slug } = await params;
  const concept = zhConcepts.find((item) => item.slug === slug);
  if (!concept) notFound();
  return <ConceptModule concept={concept} locale="zh" />;
}
