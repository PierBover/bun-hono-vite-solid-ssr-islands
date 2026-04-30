import { createSignal, onCleanup, onMount } from 'solid-js';

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

	return (
		<div class="CurrentTime">
			<h3>The time is: {time()}</h3>
		</div>
	);
}

export default CurrentTime;
