## youtube-sorter

> Web application to sort liked videos into playlists. https://scp002.github.io/youtube-sorter/dist/

## What it does?

It connects to your youtube account.

Then it displays list of liked videos that does not exist in any of your 
custom playlists on the left side of the screen and list of playlists on 
the right side of the screen.

Next, all you need to do is to select liked videos on the left side and 
click arrow button of the proper playlist on the right side.

Also, this application can:
* Filter results with search query.
* Display or hide videos which is already in playlists.
* Create new playlists.
* Delete existing playlists.
* Remove liked videos from playlists.
* Move liked videos from one playlist to another (no manual actions 
  required).
* Play liked videos.
* Change application "Client ID" (used by Google API).

---
**Warnings**:

* Fetching playlists and liked videos can take a (relatively) long time.
> The more liked videos and playlists you have, the more time load 
> process will take. Under the some conditions - exponentially more.
> 
> A reason for that is a google api design (it has limitation in 50 items 
> for each response) and this application design (for multiple reasons).

* Moving multiple videos to the playlist can take a long time, too.
> The more videos you select to move, the more time moving process will
> take.
> 
> A reason for that is a google api design (if send a bunch of requests
> without waiting for previous to finish, server will skip some videos).

* If you want to use this application on the mobile device - turn on
  lanscape orientation.
> This application can not be displayed properly on screen width less
> than 490px.

* This application can not load and display deleted or unavailable videos
  from your liked playlist.
> This is what "available" and "total" counters stands for.

## Why?

To make life easier if you have hundreds of liked videos and make decision 
to organize them.

## Build setup

``` bash
# Install dependencies
npm install

# Serve with hot reload at localhost:4200
ng serve --aot

# Build for production with minification
ng build --prod
```

## Notes

To get production build work with Github Pages, use following command:

``` bash
ng build --prod --base-href "https://<user-name>.github.io/<repo-name>/<dist-folder>/"

# In current case:
ng build --prod --base-href "https://scp002.github.io/youtube-sorter/dist/"
```

Also, production build does not work with `file://` protocol.

Use HTTP server, for example:

``` bash
npm install -g http-server
cd dist
http-server -p 80
```
