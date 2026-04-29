import { useContext } from 'solid-js';
import { RequestContext } from '../pages/pages-contexts';

function Nav() {
	const { path } = useContext(RequestContext);

	return (
		<nav class="Nav">
			{path === '/' ? <span>Home</span> : <a href="/">Home</a>}
			{path === '/about' ? <span>About</span> : <a href="/about">About</a>}
		</nav>
	);
}

export default Nav;
