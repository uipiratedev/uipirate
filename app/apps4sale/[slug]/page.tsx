import Apps4SaleDetails from "@/screens/apps4sale/details";

export const metadata = {
  title: "Product Details | Apps 4 Sale",
  description:
    "Detailed information about the production-ready micro apps at UI Pirate.",
};

const ProductDetailsPage = ({ params }: { params: { slug: string } }) => {
  return <Apps4SaleDetails slug={params.slug} />;
};

export default ProductDetailsPage;
