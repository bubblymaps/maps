import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/settings', '/onboarding', '/moderator'],
      },
    ],
    sitemap: 'https://bubblymaps.org/sitemap.xml',
  }
}
