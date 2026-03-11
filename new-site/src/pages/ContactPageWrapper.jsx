// src/pages/ContactPageWrapper.jsx
import Seo from "../components/common/Seo";
import ContactPage from "../components/contact/ContactPage";
export default function ContactPageWrapper() { return(

<>
<Seo
    title="Contact Us | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth"
    description="Get in touch with Dhanamitra Infotech LLP for website development, software solutions, IT placements, journal publishing and stock market training. Contact us today!"
    keywords={[
      "Dhanamitra Infotech LLP",
      "contact us",
      "digital solutions company contact",
      "website development contact",
      "software solutions contact",
      "business growth contact",
      "ISO certified digital services contact",
      "modern digital solutions India contact",
    ]}
/>
<ContactPage />
</>
)
    
    ; }