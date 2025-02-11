# TV Time List Sonarr

A simple web API for importing your TV Time data into Sonarr.

## How to run

Using docker:

```
docker run -e TVTIME_EMAIL='<your_tv_time_email_address>' \
-e TVTIME_PASSWORD='<your_tv_time_password>' \
-p 3000:3000 nyakaspeter/tvtime-list-sonarr
```

Using bun:

```
git clone https://github.com/nyakaspeter/tvtime-list-sonarr.git
cd tvtime-list-sonarr
bun install
bun run index.ts
```

The TVTIME_EMAIL and TVTIME_PASSWORD env vars must be set before launching the application!

## How to use

Once the web server is running, add one or more custom lists to Sonarr (under Settings > Import Lists > Advanced List) with one of the following list URLs (replace localhost and port number if needed):

- **http://localhost:3000/shows**: returns all shows from your account
- **http://localhost:3000/shows/watching**: returns shows that you're currently watching but not up to date with
- **http://localhost:3000/shows/up_to_date**: returns running shows that you're up to date with
- **http://localhost:3000/shows/finished**: returns shows that you finished
- **http://localhost:3000/shows/not_started_yet**: returns shows you haven't started yet
- **http://localhost:3000/shows/for_later**: returns shows you set as 'watch later'
- **http://localhost:3000/shows/stopped_watching**: returns shows you stopped watching before finishing them
- **http://localhost:3000/shows/all_time_favorites**: returns shows you set as favorites

Sonarr will periodically fetch the lists and monitor & download the shows on them according to your settings.
