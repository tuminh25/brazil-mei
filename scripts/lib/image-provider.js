// scripts/lib/image-provider.js
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

async function verifyImageUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok ? url : null;
  } catch { return null; }
}

async function searchUnsplash(query) {
  if (!UNSPLASH_ACCESS_KEY) return null;
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } });
  if (!res.ok) return null;
  const data = await res.json();
  const img = data.results?.[0]?.urls?.regular;
  return img ? verifyImageUrl(img) : null;
}

async function searchPexels(query) {
  if (!PEXELS_API_KEY) return null;
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });
  if (!res.ok) return null;
  const data = await res.json();
  const img = data.photos?.[0]?.src?.large;
  return img ? verifyImageUrl(img) : null;
}

async function searchPixabay(query) {
  if (!PIXABAY_API_KEY) return null;
  const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&per_page=3&orientation=horizontal`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const img = data.hits?.[0]?.largeImageURL;
  return img ? verifyImageUrl(img) : null;
}

async function findImage(query) {
  let url = await searchUnsplash(query);
  if (url) return url;
  url = await searchPexels(query);
  if (url) return url;
  url = await searchPixabay(query);
  return url; // null nếu không tìm thấy
}

module.exports = { findImage };