import type { Context } from 'hono';
import { useContext } from 'solid-js';
import Nav from '../components/Nav';
import { Island } from '../Island';
import Counter from '../islands/Counter';
import CurrentTime from '../islands/CurrentTime';
import Desktop from '../islands/Desktop';
import Mobile from '../islands/Mobile';
import { HomeContext, type HomeContextValue } from './pages-contexts';

function route(c: Context) {
	const value: HomeContextValue = { welcomeMessage: 'Hello context' };
	const renderOptions = { title: 'Home' };

	return c.renderSolidPage(() => (
		<HomeContext.Provider value={value}>
			<Home />
		</HomeContext.Provider>
	), renderOptions);
}

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

export default route;
