# foxhole-discord-bot

## What does this do?
This application spawns a service that listens to new Foxhole events using Foxholestats.com. New events are posted to a Discord channel.

Example:
```
The Moors - The Wind Hills Relic Base was taken by WARDENS on day 191 @ Wed Dec 21 2022 18:36:01 GMT+0100 (Central European Standard Time)
```

## Configuration
Configuration of this program is done using environment variables which are described below.

| Variable | Description |
|--|--|
| `DISCORD_WEBHOOK_URL` | Your Discord Webhook URL | 
| `FOXHOLESTATS_DOMAIN` | Foxholestats.com domain to use for stats. E.g. `foxholestats.com` for Able and `shard3.foxholestats.com` for Charlie |
| `FOXHOLESTATS_PORT` | The Foxholestats.com port where the event source is located. E.g. `7551` for Able and `7533` for Charlie |
| `DEBUG` | namespace for `debug`. set to `*` for verbose logging or `app:*` for only app-related logging (recommended) |

e.g.:
```sh
DEBUG=app:* \
DISCORD_WEBHOOK_URL=DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/XXX/YYY \
FOXHOLESTATS_DOMAIN=foxholestats.com \
FOXHOLESTATS_PORT=7551 \
npm run start
```

Or copy `.env.example` to `.env` and edit the values and simply run `npm run start`