import { Metadata } from "next";

import Apps4SaleDetails from "@/screens/apps4sale/details";
import products from "@/data/apps4sale.json";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return { title: "Product Not Found | Apps 4 Sale" };
  }

  const url = `https://uipirate.com/apps4sale/${product.slug}`;

  return {
    title: `${product.title} | Apps 4 Sale`,
    description: product.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${product.title} | UI Pirate`,
      description: product.description,
      url,
      type: "website",
    },
  };
}

const ProductDetailsPage = ({ params }: PageProps) => {
  return <Apps4SaleDetails slug={params.slug} />;
};

export default ProductDetailsPage;
