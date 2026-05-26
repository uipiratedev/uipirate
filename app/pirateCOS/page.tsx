import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function PirateCOSEntryPage() {
  const host = (await headers()).get("host") || "";
  const isSubdomain = host.startsWith("cos.") || host === "cos.uipirate.com";

  redirect(isSubdomain ? "/dashboard" : "/pirateCOS/dashboard");
}
