// src/components/common/GlobalSchema.jsx
// Site-wide JSON-LD: Organization + WebSite + LocalBusiness.
// Rendered once in the public shell so the brand entity, search box,
// and local-pack signals appear on every public page.
import { Helmet } from "react-helmet-async";
import {
  organizationSchema,
  websiteSchema,
  localBusinessSchema,
} from "../../lib/structuredData";

export default function GlobalSchema() {
  const graph = [
    organizationSchema(),
    websiteSchema(),
    localBusinessSchema(),
  ];

  return (
    <Helmet>
      {graph.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
