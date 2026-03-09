export interface Testimonial {
  id: number;
  clientName: string;
  clientCompany: string;
  clientRole: string;
  quote: string;
  rating: number;
  shortHighlight: string;
  featured: boolean;

  clientPhoto?: string;
  client_photo?: string;

  client_name?: string;
  client_company?: string;
  client_role?: string;
  short_highlight?: string;

  createdAt?: string;
  created_at?: string;
}