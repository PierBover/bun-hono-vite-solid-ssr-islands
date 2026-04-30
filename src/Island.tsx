import { stringify } from 'devalue';
import { type Component } from 'solid-js';
import { renderToString } from 'solid-js/web';

// islands registry lookup table
// we need this because we can't be certain of the component name after build
// and we need that name to be able to provide a module path for hydration
const registry = new Map<Component<any>, string>();
// import and map all the modules of the islands components
const modules = import.meta.glob('/src/islands/**/*.tsx', { eager: true });
for (const [path, module] of Object.entries(modules)) {
	if ((module as any).default) {
		registry.set((module as any).default, path);
	}
}

// this return the path of the component
function getComponentPath(component: Component<any>): string | undefined {
	return registry.get(component);
}

type CommonProps<T> = {
	component: T;
	clientOnly?: boolean;
};

type HydrationOptions =
	| { hydrateOnVisible?: boolean; hydrateOnMedia?: never; }
	| { hydrateOnMedia?: string; hydrateOnVisible?: never; };

type BaseProps<T> = CommonProps<T> & HydrationOptions;

// we need all this TS stuff to infer the types of the props for islandProps
type ComponentProps<T> = T extends (props: infer P) => any ? P : never;

type IslandProps<T extends Component<any>> =
	& BaseProps<T>
	& (keyof ComponentProps<T> extends never ? { islandProps?: never; } : { islandProps: ComponentProps<T>; });

export function Island<T extends Component<any>>(props: IslandProps<T>) {
	const ComponentToRender = props.component;
	const jsonProps = props.islandProps ? stringify(props.islandProps) : undefined;

	let solidHtml = '';
	const renderId = Math.random().toString(36).slice(2);

	if (!props.clientOnly) {
		if (props.islandProps) {
			solidHtml = renderToString(() => <ComponentToRender {...props.islandProps} />, { renderId });
		} else {
			solidHtml = renderToString(() => <ComponentToRender />, {
				renderId
			});
		}
	}

	return (
		<div
			data-island-path={getComponentPath(ComponentToRender)}
			data-props={jsonProps}
			data-render-id={renderId}
			data-client-only={props.clientOnly}
			data-hydrate-on-visible={props.hydrateOnVisible}
			data-hydrate-on-media={props.hydrateOnMedia}
			innerHTML={solidHtml}
		>
		</div>
	);
}
