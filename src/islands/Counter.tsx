import {createSignal} from 'solid-js';

function Counter() {
	const [count, setCount] = createSignal(0);

	return (
		<div class="Counter">
			<h4>{count()}</h4>
			<button onClick={() => setCount(count() + 1)}>Add</button>
		</div>
	);
}

export default Counter;
