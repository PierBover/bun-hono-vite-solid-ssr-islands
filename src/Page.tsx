type Props = {
	message:string;
}

function Page (props:Props) {
	return (
		<h1>{props.message}</h1>
	);
}

export default Page;