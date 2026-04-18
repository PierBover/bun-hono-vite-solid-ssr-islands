import { Island } from './Island';
import Counter from './islands/Counter';
import CurrentTime from './islands/CurrentTime';
import Desktop from './islands/Desktop';
import Mobile from './islands/Mobile';

type Props = {
	message: string;
};

function Page(props: Props) {
	const time = new Date().toISOString();

	return (
		<div class="Page">
			<h1>{props.message}</h1>
			<Island component={Desktop} hydrateOnMedia="(min-width: 1000px)" />
			<Island component={Mobile} hydrateOnMedia="(max-width: 999px)" />
			<Island component={CurrentTime} islandProps={{ serverTime: time }} />
			<Island component={Counter} hydrateOnVisible />
		</div>
	);
}

export default Page;
