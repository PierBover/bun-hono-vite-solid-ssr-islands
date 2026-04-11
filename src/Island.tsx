import { stringify } from 'devalue';
import { Show, type Component } from 'solid-js';
import { renderToString } from 'solid-js/web';

// we need all this TS stuff to infer the types of the props for islandProps
type ComponentProps<T> = T extends (props: infer P) => any ? P : never;

type IslandProps<T extends Component<any>> = keyof ComponentProps<T> extends never
	? {
			component: T;
			name: string;
			islandProps?: never;
			clientOnly?: boolean;
			hydrateOnVisible?: boolean;
		}
	: {
			component: T;
			name: string;
			islandProps: ComponentProps<T>;
			clientOnly?: boolean;
			hydrateOnVisible?: boolean;
		};

export function Island<T extends Component<any>>(props: IslandProps<T>) {
	const ComponentToRender = props.component;
	const jsonProps = props.islandProps ? stringify(props.islandProps) : undefined;

	let solidHtml = '';
	const renderId = `${props.name}-${Math.random().toString(36).slice(2)}`;

	if (!props.clientOnly) {
		if (props.islandProps) {
			solidHtml = renderToString(() => <ComponentToRender {...props.islandProps} />, { renderId });
		} else {
			solidHtml = renderToString(() => <ComponentToRender />, { renderId });
		}
	}

	return (
		<div
			data-island-name={props.name}
			data-props={jsonProps}
			data-render-id={renderId}
			data-client-only={props.clientOnly}
			data-hydrate-on-visible={props.hydrateOnVisible}
			innerHTML={solidHtml}
		></div>
	);
}
