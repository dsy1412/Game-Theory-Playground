import { notFound } from "next/navigation";
import { ConceptModule } from "@/components/ConceptModule";
import { concepts } from "@/data/concepts";
import type { ConceptSlug } from "@/lib/types";

export function generateStaticParams() {
  return concepts.map((concept) => ({ slug: concept.slug }));
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: ConceptSlug }> }) {
  const { slug } = await params;
  const concept = concepts.find((item) => item.slug === slug);
  if (!concept) notFound();
  return <ConceptModule concept={concept} />;
}
