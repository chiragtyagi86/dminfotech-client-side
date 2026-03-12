export interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;

  shortDesc?: string;
  email?: string;
  phone?: string;

  photoUrl?: string;
  photo_url?: string;

  linkedinUrl?: string;
  linkedin_url?: string;

  twitterUrl?: string;
  twitter_url?: string;

  websiteUrl?: string;
  website_url?: string;

  resumeUrl?: string;
  resume_url?: string;

  short_desc?: string;
  signature?: string;

  createdAt?: string;
  created_at?: string;
}