import { redirect } from "next/navigation";

// /resources duplicates /blogs content — redirect permanently so Google
// consolidates the canonical signal on /blogs and we don't compete with ourselves.
export default function ResourcesPage() {
  redirect("/blogs");
}
