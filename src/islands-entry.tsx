/// <reference lib='dom' />

import { parse } from 'devalue';
import { hydrate, render } from 'solid-js/web';

const modules = import.meta.glob('./islands/*.tsx');

async function hydrateIsland(element: HTMLElement) {
	const componentName = element.getAttribute('data-island-name');
	const renderId = element.getAttribute('data-render-id')!;
	const propsString = element.getAttribute('data-props');
	const props = propsString ? parse(propsString) : {};

	console.log('hydrating...', componentName, renderId);

	const importFunction = modules[`./islands/${componentName}.tsx`];

	if (importFunction) {
		const clientOnly = element.getAttribute('data-client-only') === 'true';
		const module = (await importFunction()) as { default: any };
		const Component = module.default;

		if (clientOnly) {
			render(() => <Component {...props} />, element);
		} else {
			hydrate(() => <Component {...props} />, element, { renderId });
		}
	}
}

const elements = document.querySelectorAll(
	'[data-island-name]:not([data-hydrate-on-visible])',
) as NodeListOf<HTMLElement>;
for (const element of elements) hydrateIsland(element);

const elementsToObserve = document.querySelectorAll(
	'[data-island-name][data-hydrate-on-visible]',
) as NodeListOf<HTMLElement>;

if (elementsToObserve.length > 0) {
	function onObserve(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				observer.unobserve(entry.target);
				hydrateIsland(entry.target as HTMLElement);
			}
		});
	}

	const observer = new IntersectionObserver(onObserve);

	for (const element of elementsToObserve) observer.observe(element);
}
