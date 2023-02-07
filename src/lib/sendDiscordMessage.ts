import debug from 'debug';
import fetch from 'node-fetch';

const log = debug('app:discord');

interface DiscordEmbed {
	title?: string;
	description?: string;
	color?: string;
	author?: {
		name?: string;
	};
	footer?: {
		text?: string;
	};
}

async function sendDiscordMessage(
	webhookUrl: string,
	body: {
		content: string | null;
		embeds?: Array<DiscordEmbed>;
	}
) {
	try {
		const res = await fetch(webhookUrl, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		if (res.status !== 200) {
			const data = await res.json();
			log('Unable to send Discord message:', data);
			throw new Error('Unable to send Discord message');
		}
	} catch (e) {
		log('Unable to send Discord message:', e);
		throw e;
	}
}

export default sendDiscordMessage;
