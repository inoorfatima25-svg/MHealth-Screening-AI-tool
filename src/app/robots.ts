import type { MetadataRoute } from 'next';

/**
 * The admin panel is unauthenticated and displays participant data, including
 * optional contact details and PHQ-9 item 9 responses. Disallowing crawlers is
 * a courtesy layer only — it stops search indexing, NOT access. Anyone with the
 * URL can still read everything. Real protection requires auth in front of
 * /admin and /api/admin/export.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/', '/api/'],
    },
  };
}
