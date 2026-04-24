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

function setLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
  el.setAttribute('href', href);
}

export default function useMeta({ title, description, ogTitle, ogDescription, ogImage, url } = {}) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) setMeta('description', description);

    // Open Graph
    if (ogTitle || title) setMetaProperty('og:title', ogTitle || title);
    if (ogDescription || description) setMetaProperty('og:description', ogDescription || description);
    if (ogImage) setMetaProperty('og:image', ogImage);
    if (url) setMetaProperty('og:url', url);
    setMetaProperty('og:type', 'website');
    setMetaProperty('og:site_name', 'Norwest Dynamic Systems');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    if (ogTitle || title) setMeta('twitter:title', ogTitle || title);
    if (ogDescription || description) setMeta('twitter:description', ogDescription || description);
    if (ogImage) setMeta('twitter:image', ogImage);

    // Canonical
    if (url) setLink('canonical', url);
  }, [title, description, ogTitle, ogDescription, ogImage, url]);
}
