'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';

export default function BookmarkButton({ manga }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Cek apakah sudah di-bookmark saat load
    if (typeof window !== 'undefined') {
        const bookmarks = JSON.parse(localStorage.getItem('komik_bookmarks') || '[]');
        const exists = bookmarks.some(b => b.slug === manga.slug);
        setIsBookmarked(exists);
    }
  }, [manga.slug]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('komik_bookmarks') || '[]');
    
    if (isBookmarked) {
        // Hapus dari bookmark
        const newBookmarks = bookmarks.filter(b => b.slug !== manga.slug);
        localStorage.setItem('komik_bookmarks', JSON.stringify(newBookmarks));
        setIsBookmarked(false);
    } else {
        // Tambah ke bookmark
        const dataToSave = {
            title: manga.title,
            slug: manga.slug,
            thumb: manga.thumb,
            type: manga.type || manga.metadata?.type || 'Manga',     
            rating: manga.rating || manga.metadata?.rating || '?',   
            status: manga.status || manga.metadata?.status || 'Unknown',
            last_chapter: manga.latestChapter || manga.last_chapter || null, 
        };

        const newBookmarks = [...bookmarks, dataToSave];
        localStorage.setItem('komik_bookmarks', JSON.stringify(newBookmarks));
        setIsBookmarked(true);
    }
  };

  return (
    <button 
        onClick={toggleBookmark}
        className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md border ${
            isBookmarked 
            ? 'bg-red-600 hover:bg-red-700 text-white border-red-500' 
            : 'bg-primary hover:bg-blue-600 text-white border-blue-400'
        }`}
    >
        {/* Ukuran icon diperkecil ke 16 */}
        <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
        {isBookmarked ? 'DI BOOKMARK' : 'BOOKMARK'}
    </button>
  );
}