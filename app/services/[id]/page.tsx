import services from "@/data/sericesDetailsList.json";
import ServiceDetails from "@/screens/serviceDetails";
// import DebugParams from "./debugParams";

export async function generateStaticParams() {
  return services.map((item: any) => ({ id: item.slug }));
}

interface PageProps {
  params: {
    id: string;
  };
}

// normalize for matching (convert to lowercase, replace special chars with "-")
const normalize = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ServicesByIdPage = ({ params }: PageProps) => {
  // URL params are automatically decoded by Next.js
  const urlSlug = decodeURIComponent(params.id);
  console.log("📦 Server-side params (decoded):", urlSlug);

  const service = services.find(
    (s: any) => normalize(s.slug) === normalize(urlSlug)
  );

  if (!service) {
    return (
      <div className="text-center py-24 text-gray-500">
        <h1 className="text-3xl font-semibold">Service not found</h1>
        <p className="mt-2">Please check the URL or select a valid service.</p>
      </div>
    );
  }

  return (
    <div>
      {/* <DebugParams params={{ id: urlSlug }} />. */}
      <ServiceDetails data={service.data} />
    </div>
  );
};

export default ServicesByIdPage;
