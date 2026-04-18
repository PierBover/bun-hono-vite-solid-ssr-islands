/// <reference lib='dom' />

import { parse } from 'devalue';
import { hydrate, render } from 'solid-js/web';

const modules = import.meta.glob('/src/islands/**/*.tsx');

async function hydrateIsland(element: HTMLElement) {
	// check if the element was already hydrated
	const hydrated = element.getAttribute('data-hydrated');
	if (hydrated === 'true') return;

	const islandPath = element.getAttribute('data-island-path');
	const renderId = element.getAttribute('data-render-id')!;
	const propsString = element.getAttribute('data-props');
	const props = propsString ? parse(propsString) : {};

	console.log('hydrating...', islandPath, renderId);

	const importFunction = modules[islandPath!];

	if (importFunction) {
		const clientOnly = element.getAttribute('data-client-only') === 'true';
		const module = (await importFunction()) as { default: any };
		const Component = module.default;
		element.setAttribute('data-hydrated', 'true');

		if (clientOnly) {
			render(() => <Component {...props} />, element);
		} else {
			hydrate(() => <Component {...props} />, element, { renderId });
		}
	}
}

// hydrate immediately
const elements = document.querySelectorAll(
	'[data-island-path]:not([data-hydrate-on-visible]):not([data-hydrate-on-media])',
) as NodeListOf<HTMLElement>;
for (const element of elements) hydrateIsland(element);

// hydrate on visible
const elementsToHydrateOnVisible = document.querySelectorAll(
	'[data-island-path][data-hydrate-on-visible]',
) as NodeListOf<HTMLElement>;

if (elementsToHydrateOnVisible.length > 0) {
	function onObserve(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// stop observing the element once hydrated
				observer.unobserve(entry.target);
				hydrateIsland(entry.target as HTMLElement);
			}
		});
	}

	const observer = new IntersectionObserver(onObserve);

	for (const element of elementsToHydrateOnVisible) observer.observe(element);
}

// hydrate on media query
const elementsToHydrateOnMedia = document.querySelectorAll(
	'[data-island-path][data-hydrate-on-media]',
) as NodeListOf<HTMLElement>;

for (const element of elementsToHydrateOnMedia) {
	const query = element.getAttribute('data-hydrate-on-media')!;
	const mediaQueryList = window.matchMedia(query);

	function handler(event: MediaQueryListEvent | MediaQueryList) {
		if (event.matches) {
			// remove the listener after the match
			mediaQueryList.removeEventListener('change', handler);
			hydrateIsland(element);
		}
	}

	// hydrate immeditaly if the media query matches already
	if (mediaQueryList.matches) {
		hydrateIsland(element);
	} else {
		mediaQueryList.addEventListener('change', handler);
	}
}
