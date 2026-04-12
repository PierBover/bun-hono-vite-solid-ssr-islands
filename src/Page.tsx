import { Island } from './Island';
import Counter from './islands/Counter';
import CurrentTime from './islands/CurrentTime';

type Props = {
	message: string;
};

function Page(props: Props) {
	const time = new Date().toISOString();

	return (
		<div class="Page">
			<h1>{props.message}</h1>
			<Island component={CurrentTime} islandProps={{ serverTime: time }} />
			<Island component={Counter} hydrateOnVisible />
		</div>
	);
}

export default Page;
