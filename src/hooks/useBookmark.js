'use client';
import { useState, useEffect } from 'react';

export default function useBookmark(manga) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!manga) return;
    const bookmarks = JSON.parse(localStorage.getItem('komik_bookmarks') || '[]');
    const exists = bookmarks.find(b => b.slug === manga.slug);
    setIsBookmarked(!!exists);
  }, [manga]);

  const toggleBookmark = () => {
    let bookmarks = JSON.parse(localStorage.getItem('komik_bookmarks') || '[]');
    
    if (isBookmarked) {
      bookmarks = bookmarks.filter(b => b.slug !== manga.slug);
    } else {
      bookmarks.push({
        _id: manga._id,
        title: manga.title,
        slug: manga.slug,
        thumb: manga.thumb,
        type: manga.metadata?.type || 'Manga',
        rating: manga.metadata?.rating || '?'
      });
    }

    localStorage.setItem('komik_bookmarks', JSON.stringify(bookmarks));
    setIsBookmarked(!isBookmarked);
  };

  return { isBookmarked, toggleBookmark };
}