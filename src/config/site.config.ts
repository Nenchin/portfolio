// Please note Some data Below are Just Placeholder for now due to active development
import type { Metadata } from 'next';

export type SocialLink = {
  label: string;
  url: string;
  icon?: string; // name for icon library if needed later
};


export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export interface SiteConfig {
  siteName: string;
  domain: string;
  description: string;

  about: string;
  keywords: string[];
  ogImage: string;
  // twitterHandle: string;
  author: string;
  author_img:string;

  theme: {
    default: 'light' | 'dark';
    allowSystem: boolean;
  };
  links: {
    // website: string;
    // github: string;
    linkedin: string;
    // tips: string;
    email: string;
  };
  social: SocialLink[];
  navigation: NavItem[];
  seo: {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  image?: string; // default og image
  imageAlt?: string;
  locale?: string;
  type?: string;
  twitterCard?: string;
  robots?: string;
  themeColor?: string;
  };

}

export const siteConfig: SiteConfig = {
  siteName: 'Glory Augustine',
  domain: 'muhammadfiaz.com',
  author: 'Glory Augustine',
  description: 'Graphic Designer and UI/UX Designer dedicated to creating clean, modern, and meaningful visuals that make brands stand out.',
  about:
    'I am Gloria Oyale Augustine, a passionate Graphic Designer and UI/UX Designer dedicated to creating clean, modern, and meaningful visuals that make brands stand out and help people connect with digital products effortlessly.',
    author_img: '/img/file.png',
    keywords: [
      'Glory Augustine',
      'Product Designer',
      'UI',
      'UX',
      'Graphics Designer',
  ],
  ogImage: '/og.png',
  // twitterHandle: '@muhammadfiaz_',

  theme: {
    default: 'dark',
    allowSystem: true,
  },
  links: {
    // website: 'https://muhammadfiaz.com',
    // github: 'https://github.com/muhammad-fiaz',
    linkedin: 'https://www.linkedin.com/feed/',
    // tips: 'https://pay.muhammadfiaz.com',
    email: 'mailto:oyalegloria@gmail.com',
  },
  social: [
    // { label: 'GitHub', url: 'https://github.com/muhammad-fiaz', icon: 'github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/feed/', icon: 'linkedin' },
    // { label: 'Website', url: 'https://muhammadfiaz.com', icon: 'globe' },
    // { label: 'Tip', url: 'https://pay.muhammadfiaz.com', icon: 'coffee' },
  ],
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    // { label: 'Posts', href: '/posts' },
    { label: 'Chat', href: '/chat' },
    // { label: 'Contact', href: '/contact' }
  ],

  
  seo: {
    title: 'Glory Augustine',
    description: 'Graphic Designer and UI/UX Designer dedicated to creating clean, modern, and meaningful visuals that make brands stand out.',
    keywords: [
      'Glory Augustine',
      'Product Designer',
      'UI',
      'UX',
      'Graphics Designer',
    ],
    canonical: 'https://muhammadfiaz.com',
    image: '/og.png',
    imageAlt: "Glory Augustine - Product Designer",
    locale: 'en-US',
    type: 'website',
    twitterCard: 'summary_large_image',
    robots: 'index,follow',
    themeColor: '#3c075fff',
  },

};

export function buildMetadata(overrides: Partial<Metadata> = {}): Metadata {
  const { seo, siteName, domain } = siteConfig;

  const base: Metadata = {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: siteConfig.author, url: siteConfig.links.website }],
    metadataBase: new URL(`https://${domain}`),
    alternates: { canonical: seo.canonical ?? `https://${domain}` },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical ?? `https://${domain}`,
      siteName,
      images: seo.image ? [seo.image] : [],
      type: seo.type ?? 'website',
      locale: seo.locale,
    },
    twitter: {
      card: seo.twitterCard ?? 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: seo.image ? [seo.image] : [],
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
    },
    other: {
      robots: seo.robots,
      'theme-color': seo.themeColor,
      'og:image:alt': seo.imageAlt,
    },
  } as Metadata;

  return { ...base, ...overrides };
}

export type { Metadata };
