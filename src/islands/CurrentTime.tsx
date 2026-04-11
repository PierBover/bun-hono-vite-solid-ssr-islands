import { createSignal, onMount, onCleanup } from 'solid-js';

interface Props {
	serverTime: string;
}

function CurrentTime(props: Props) {
	const [time, setTime] = createSignal(props.serverTime);

	function updateTime() {
		setTime(new Date().toISOString());
	}

	onMount(() => {
		updateTime();
		const intervalId = setInterval(updateTime, 1000);

		onCleanup(() => {
			clearInterval(intervalId);
		});
	});

	return <h3>The time is: {time()}</h3>;
}

export default CurrentTime;
