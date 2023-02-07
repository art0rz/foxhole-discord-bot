import fetch from 'node-fetch';

async function getLastEventId(domain: string, port: string): Promise<number> {
	const html = await (await fetch(`https://${domain}/`)).text();
	const matches = new RegExp(`https:\\/\\/${domain}:${port}\\/channel\\/eventlog\\?lastEventId=([0-9]+)`).exec(html);

	if (matches === null || Number.isNaN(parseInt(matches[1], 10))) {
		throw new Error('unable to get lastEventId');
	}

	return parseInt(matches[1], 10);
}

export default getLastEventId;
