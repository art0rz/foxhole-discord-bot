import debug from 'debug';
import fetch from 'node-fetch';

const log = debug('app:discord');

async function sendDiscordMessage(webhookUrl: string, body: string) {
	try {
		const res = await fetch(webhookUrl, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				content: body,
			}),
		});

		if (res.status !== 200) {
			const data = await res.json();
			log('Unable to send Discord message:', data);
		}
	} catch (e) {
		log('Unable to send Discord message:', e);
	}
}

export default sendDiscordMessage;
