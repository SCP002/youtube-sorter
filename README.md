## youtube-sorter

> Web application to sort liked videos into playlists. https://scp002.github.io/youtube-sorter/dist/

## What it does

It connects to your youtube account.

Then it displays list of liked videos that does not exist in any of your 
custom playlists on the left side of the screen and list of playlists on 
the right side of the screen.

Next all you need to do is to drag liked video from the left side to the 
proper playlist on the right side.

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
