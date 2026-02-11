import { NavLink, ServiceItem, NewsItem } from '@/types';

/** Company info */
export const COMPANY = {
  name: 'ARMEL',
  fullName: 'ARMEL Group',
  tagline: 'Building the future with reliability and innovation',
  description:
    'ARMEL Group is a diversified international company delivering world-class solutions in logistics, IT services, government contracting, lifestyle support, and construction development.',
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
      'Enterprise software development, cloud infrastructure, and cybersecurity solutions tailored to modern business needs.',
    icon: 'code',
  },
  {
    id: 'government',
    title: 'Government Services',
    description:
      'Trusted partner for federal and local agencies. Compliance-first approach to mission-critical government contracts.',
    icon: 'building',
  },
  {
    id: 'lifestyle',
    title: 'Life Way Support',
    description:
      'Comprehensive corporate relocation, employee wellness programs, and lifestyle management services worldwide.',
    icon: 'heart',
  },
  {
    id: 'construction',
    title: 'Construction & Development',
    description:
      'Large-scale commercial and residential construction projects delivered on time, on budget, and to the highest standards.',
    icon: 'hardhat',
  },
];

/** Mock news / updates */
export const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    title: 'ARMEL Expands Logistics Network Across Europe',
    description:
      'New partnerships and distribution centres in Germany, France, and Poland strengthen our supply chain capabilities.',
    image: '/images/news-1.jpg',
    date: '2026-01-28',
    slug: 'armel-expands-logistics-europe',
  },
  {
    id: '2',
    title: 'IT Division Launches Cloud Security Suite',
    description:
      'Our new enterprise-grade cybersecurity platform helps organizations protect critical infrastructure from emerging threats.',
    image: '/images/news-2.jpg',
    date: '2026-01-15',
    slug: 'it-cloud-security-launch',
  },
  {
    id: '3',
    title: 'Government Contract Awarded for Smart City Initiative',
    description:
      'ARMEL selected to lead digital transformation for a major metropolitan smart city program worth $120M.',
    image: '/images/news-3.jpg',
    date: '2025-12-20',
    slug: 'smart-city-contract-awarded',
  },
];

/** Social media links */
export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/company/armelgroup', icon: 'linkedin' },
  { label: 'Twitter', href: 'https://twitter.com/armelgroup', icon: 'twitter' },
  { label: 'Facebook', href: 'https://facebook.com/armelgroup', icon: 'facebook' },
] as const;

/** Request type labels */
export const REQUEST_TYPE_LABELS: Record<string, string> = {
  quote: 'Request Quote / Service Inquiry',
  inquiry: 'Request Quote / Service Inquiry',
  career: 'Join Our Team',
};
