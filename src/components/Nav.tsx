import {useContext} from 'solid-js';
import {HonoContext} from '../pages/pages-contexts';

function Nav() {
	const {path} = useContext(HonoContext);

	return (
		<nav class="Nav">
			{path === '/' ? <span>Home</span> : <a href="/" data-prefetch>Home</a>}
			{path === '/about' ? <span>About</span> : <a href="/about" data-prefetch>About</a>}
		</nav>
	);
}

export default Nav;
