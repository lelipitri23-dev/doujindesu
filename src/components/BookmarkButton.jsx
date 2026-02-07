'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';

export default function BookmarkButton({ manga }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Gunakan slug sebagai ID unik
  const mangaSlug = manga?.slug;

  useEffect(() => {
    if (typeof window !== 'undefined' && mangaSlug) {
        const bookmarks = JSON.parse(localStorage.getItem('komik_bookmarks') || '[]');
        const exists = bookmarks.some(b => b.slug === mangaSlug);
        setIsBookmarked(exists);
    }
  }, [mangaSlug]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('komik_bookmarks') || '[]');
    
    if (isBookmarked) {
        // Hapus dari bookmark
        const newBookmarks = bookmarks.filter(b => b.slug !== mangaSlug);
        localStorage.setItem('komik_bookmarks', JSON.stringify(newBookmarks));
        setIsBookmarked(false);
    } else {
        // Tambah ke bookmark
        // FIX: Kita strukturkan agar mirip dengan API response
        // supaya MangaCard.js bisa membacanya dengan benar (metadata.*)
        const dataToSave = {
            _id: manga._id || Date.now().toString(), // Fallback ID
            title: manga.title,
            slug: manga.slug,
            thumb: manga.thumb,
            chapter_count: manga.chapter_count || 0,
            metadata: {
                type: manga.metadata?.type || manga.type || 'Manga',
                rating: manga.metadata?.rating || manga.rating || '?',
                status: manga.metadata?.status || manga.status || 'Unknown',
            }
        };

        const newBookmarks = [dataToSave, ...bookmarks]; // Tambah ke paling atas
        localStorage.setItem('komik_bookmarks', JSON.stringify(newBookmarks));
        setIsBookmarked(true);
    }
  };

  return (
    <button 
        onClick={toggleBookmark}
        className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition shadow-md border ${
            isBookmarked 
            ? 'bg-red-600 hover:bg-red-700 text-white border-red-500' 
            : 'bg-primary hover:bg-blue-600 text-white border-blue-400'
        }`}
    >
        <Bookmark size={16} className={isBookmarked ? "fill-white" : ""} />
        {isBookmarked ? 'TERSIMPAN' : 'BOOKMARK'}
    </button>
  );
}