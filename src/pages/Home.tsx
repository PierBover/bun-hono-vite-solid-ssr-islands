import { Island } from '../Island';
import Counter from '../islands/Counter';
import CurrentTime from '../islands/CurrentTime';
import Desktop from '../islands/Desktop';
import Mobile from '../islands/Mobile';
import Nav from '../components/Nav';
import { useContext } from 'solid-js';
import { HomeContext } from './pages-contexts';

function Home() {
	const time = new Date().toISOString();
	const { welcomeMessage } = useContext(HomeContext);

	return (
		<div class="Home">
			<Nav />
			<h1>Home</h1>
			<h2>{welcomeMessage}</h2>
			<Island component={Desktop} hydrateOnMedia="(min-width: 1000px)" />
			<Island component={Mobile} hydrateOnMedia="(max-width: 999px)" />
			<Island component={CurrentTime} islandProps={{ serverTime: time }} />
			<p>Scroll down to hydrate a component when it becomes visible</p>
			<Island component={Counter} hydrateOnVisible />
		</div>
	);
}

export default Home;
