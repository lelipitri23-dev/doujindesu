export default async function sitemap() {
  const baseUrl = 'http://localhost:3000'; // Ganti dengan domain asli saat deploy (misal: https://komikcast.com)

  // 1. Ambil data manga dari Backend (Minta 1000 data sekaligus)
  let mangas = [];
  try {
    const env = process.env;
    const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/manga?limit=1000`, {
        cache: 'no-store'
    });
    const json = await res.json();
    mangas = json.data || [];
  } catch (e) {
    console.error("Gagal generate sitemap manga:", e);
  }

  // 2. Buat URL Dinamis untuk setiap Manga
  const mangaUrls = mangas.map((manga) => ({
    url: `${baseUrl}/manga/${manga.slug}`,
    lastModified: new Date(manga.updatedAt || new Date()),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // 3. URL Statis (Halaman tetap)
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/list`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/type/manhwa`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/type/manhua`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Gabungkan semua URL
  return [...staticUrls, ...mangaUrls];
}