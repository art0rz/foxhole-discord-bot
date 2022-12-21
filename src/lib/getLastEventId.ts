import fetch from 'node-fetch';

async function getLastEventId(domain: string, port: string): Promise<string> {
	const html = await (await fetch(`https://${domain}/`)).text();
	const matches = new RegExp(`https:\\/\\/${domain}:${port}\\/channel\\/eventlog\\?lastEventId=([0-9]+)`).exec(html);

	if (matches === null) {
		throw new Error('unable to get lastEventId');
	}

	return matches[1];
}

export default getLastEventId;
