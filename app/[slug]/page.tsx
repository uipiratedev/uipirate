// app/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  try {
    const response = await fetch(`https://api.example.com/page-seo/${slug}`, {
      // Cache the request (optional)
      cache: "no-store", // or 'force-cache' for caching
    });

    if (!response.ok) {
      // If the data isn't found, trigger 404
      notFound();
    }

    const data = await response.json();

    return {
      title: data.title || "Default Title",
      description: data.description || "Default Description",
      openGraph: {
        title: data.title,
        description: data.description,
        url: `https://example.com/${slug}`,
        siteName: "Example Site",
        images: [
          {
            url: data.image || "https://example.com/default-image.jpg",
            width: 800,
            height: 600,
            alt: data.title,
          },
        ],
        locale: "en_US",
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    notFound(); // Redirect to 404 if there's an error
  }
}

// Generate static params for dynamic routing
export async function generateStaticParams() {
  try {
    const response = await fetch("https://api.example.com/page-paths", {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch page paths:", response.status);
      return []; // Return an empty array if fetch fails
    }

    const paths = await response.json();
    return paths.map((slug: string) => ({ slug }));
  } catch (error) {
    console.error("Error fetching static params:", error);
    return []; // Return an empty array on error
  }
}

export default function DynamicPage({ params }: Props) {
  return (
    <main>
      <h1>Dynamic Page Content</h1>
      <p>Content for route: {params.slug}</p>
    </main>
  );
}
