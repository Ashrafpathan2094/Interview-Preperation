import TopicPage from "@/components/TopicPage";
import { getTopic } from "@/lib/topics";
import { notFound } from "next/navigation";

export default function Page() {
  const topic = getTopic("angular");
  if (!topic) notFound();
  return <TopicPage topic={topic} />;
}
