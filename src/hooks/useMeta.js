import { useEffect } from 'react';

function setMeta(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function setMetaProperty(property, content) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

export default function useMeta({ title, description, ogTitle, ogDescription, ogImage, url } = {}) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) setMeta('description', description);
    if (ogTitle || title) setMetaProperty('og:title', ogTitle || title);
    if (ogDescription || description) setMetaProperty('og:description', ogDescription || description);
    if (ogImage) setMetaProperty('og:image', ogImage);
    if (url) setMetaProperty('og:url', url);
  }, [title, description, ogTitle, ogDescription, ogImage, url]);
}