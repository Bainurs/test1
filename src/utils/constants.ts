import { NavLink, ServiceItem } from '@/types';

/** Company info */
export const COMPANY = {
  name: 'ARMEL',
  fullName: 'ARMEL Group',
  tagline: 'One partner. Multiple capabilities. Total accountability.',
  description:
    'Armel Group delivers integrated logistics, procurement, IT, construction, real estate, and essential services—built for regulated, high-stakes environments.',
  email: 'info@armelgroup.com',
  phone: '+1 (800) 555-0199',
  address: '350 Fifth Avenue, Suite 4200, New York, NY 10118',
} as const;

/** Main navigation links */
export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'News', href: '#news' },
  { label: 'Contact', href: '#contact' },
];

/** Services offered */
export const SERVICES: ServiceItem[] = [
  {
    id: 'logistics',
    title: 'Logistics',
    description:
      'End-to-end supply chain management with global reach. We optimize freight, warehousing, and distribution for maximum efficiency.',
    icon: 'truck',
  },
  {
    id: 'it-services',
    title: 'IT Services',
    description:
      'Secure, scalable technology solutions tailored for regulated and high-demand environments.',
    icon: 'code',
  },
  {
    id: 'government',
    title: 'Government Services',
    description:
      'Mission-focused service delivery for federal, state, and local entities with strict regulatory compliance.',
    icon: 'building',
  },
  {
    id: 'life-support',
    title: 'Operational & Lifestyle Support',
    description:
      'Comprehensive relocation, workforce, and lifestyle support services for domestic and international operations.',
    icon: 'heart',
  },
  {
    id: 'construction',
    title: 'Construction & Development',
    description:
      'Commercial and residential development with disciplined planning, quality control, and financial oversight.',
    icon: 'hardhat',
  },
];

/** Full service page content */
export const SERVICE_PAGES: Record<string, {
  pageTitle: string;
  intro: string;
  items: string[];
  closing: string;
}> = {
  logistics: {
    pageTitle: 'Logistics & Supply Chain Solutions',
    intro: 'Armel Group delivers end-to-end logistics support designed for operational reliability and scale. From freight coordination to warehousing and distribution, we manage complex supply chains with precision and accountability.',
    items: [
      'Domestic and international freight coordination',
      'Air, ocean, and ground transportation',
      'Cross-docking and warehousing solutions',
      'Procurement logistics & material sourcing',
      'Inventory management and distribution',
      'Last-mile delivery support',
      'Supply chain optimization & cost control',
    ],
    closing: 'We move critical resources where they are needed—securely, efficiently, and on schedule.',
  },
  'it-services': {
    pageTitle: 'IT Infrastructure & Technology Solutions',
    intro: 'We provide secure, scalable technology solutions tailored for regulated and high-demand environments. Our IT services are designed to support operational continuity, data security, and system performance.',
    items: [
      'Enterprise infrastructure setup & management',
      'Cloud solutions & migration support',
      'Cybersecurity frameworks & monitoring',
      'Systems integration & deployment',
      'Network architecture & maintenance',
      'Technical support & lifecycle management',
    ],
    closing: 'Technology that supports the mission—without disruption.',
  },
  government: {
    pageTitle: 'Public Sector & Regulated Services',
    intro: 'Armel Group supports federal, state, and local entities through compliant, mission-focused service delivery. Our team operates with strict adherence to regulatory standards and performance accountability.',
    items: [
      'Contracted logistics & procurement support',
      'Facilities and infrastructure services',
      'Workforce and operational support',
      'Emergency and contingency response',
      'Compliance-driven project execution',
    ],
    closing: 'Dependable execution for high-accountability environments.',
  },
  'life-support': {
    pageTitle: 'Operational & Lifestyle Support Services',
    intro: 'We provide comprehensive relocation, workforce, and lifestyle support services that enable organizations and personnel to operate efficiently in domestic and international environments.',
    items: [
      'Corporate relocation coordination',
      'Workforce housing support',
      'Wellness and support programs',
      'On-site operational assistance',
      'Travel and logistics coordination',
    ],
    closing: 'Support systems that allow teams to focus on performance.',
  },
  construction: {
    pageTitle: 'Construction & Real Estate Development',
    intro: 'Armel Group delivers commercial and residential development projects with disciplined planning, quality control, and financial oversight. We manage projects from concept to completion.',
    items: [
      'Commercial construction management',
      'Residential development projects',
      'Site planning & feasibility analysis',
      'Renovation and infrastructure upgrades',
      'Vendor & subcontractor coordination',
    ],
    closing: 'Built to last. Delivered on schedule.',
  },
};

/** Social media links */
export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/armel-group/', icon: 'linkedin' },
  { label: 'YouTube', href: 'https://www.youtube.com/@armelgroup', icon: 'youtube' },
  { label: 'Instagram', href: 'https://www.instagram.com/armel_group_inc', icon: 'instagram' },
] as const;

/** Request type labels */
export const REQUEST_TYPE_LABELS: Record<string, string> = {
  quote: 'Request Quote / Service Inquiry',
  inquiry: 'Request Quote / Service Inquiry',
  career: 'Join Our Team',
};
