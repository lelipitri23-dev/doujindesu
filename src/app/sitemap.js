import { SITE_CONFIG } from '@/lib/config';

export default async function sitemap() {
  const baseUrl = SITE_CONFIG.baseUrl;

  // 1. Ambil data manga dari Backend
  let mangas = [];
  try {
    const res = await fetch(`${SITE_CONFIG.apiBaseUrl}/manga?limit=1000`, {
        cache: 'no-store'
    });
    const json = await res.json();
    mangas = json.data || [];
  } catch (e) {
    console.error("Gagal generate sitemap manga:", e);
  }

  // 2. Buat URL Dinamis
  const mangaUrls = mangas.map((manga) => ({
    url: `${baseUrl}/manga/${manga.slug}`,
    lastModified: new Date(manga.updatedAt || new Date()),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // 3. URL Statis
  const staticRoutes = ['', '/list', '/type/manhwa', '/type/manhua'];
  
  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'always' : 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  return [...staticUrls, ...mangaUrls];
}