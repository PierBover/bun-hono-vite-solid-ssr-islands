/// <reference lib='dom' />
import './css/styles-entry';

function prefetchOnHover(anchorElement: HTMLAnchorElement): void {
	anchorElement.addEventListener('mouseenter', () => {
		const url = anchorElement.getAttribute('href');

		// check if the url is not an anchor
		if (!url || !url.startsWith('/')) return;

		// check if it's not the current page
		const currentPathWithQuery: string = window.location.pathname + window.location.search;
		if (url === currentPathWithQuery) return;

		// check if we haven't already added this link tag
		const existingPrefetch = document.querySelector(`link[rel="prefetch"][href="${url}"]`);
		if (existingPrefetch) return;

		// add the link tag
		const prefetchLink = document.createElement('link');
		prefetchLink.rel = 'prefetch';
		prefetchLink.href = url;
		prefetchLink.as = 'document';
		document.head.appendChild(prefetchLink);
		console.log('prefetched...', url);
	});
}

function initPrefetch(): void {
	// dont prefetch for slow connections
	const connection = (navigator as any).connection;
	if (connection?.saveData) return;
	if (connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g') return;

	const anchorElements = document.querySelectorAll<HTMLAnchorElement>('a[data-prefetch]');

	anchorElements.forEach((anchorElement) => {
		prefetchOnHover(anchorElement);
	});
}

document.addEventListener('DOMContentLoaded', initPrefetch);
