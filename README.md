# vanilla-pwa-shell

this is the shell of an installable PWA with serviceWorker (with working update mechanism), zero dependencies (no framework, no library, no server-side code needed, just javascript, html, svg and css files in a directory).

## It actually works (as of 1/14/26)

That fact is frankly the differentiator. Every single demo, blog post, and code snippet spat out by AI assistants that I could find was broken or outdated to the point it might as well have been broken.

easy enough to clone the git and try it for yourself, but if you wanna just see it working, I've got it installed on a public webserver [here](https://www.hicox.com/vanilla-pwa-shell/)



## you may ask yourself "how do I work this"?

The only real requirement is that you've gotta webserver that can serve flat files and that has an SSL certificate trusted by default on your OS (self-signed won't cut it). This is entirely because per-spec, browser engines will refuse to spin up serviceWorker threads unless served from an origin with an OS trusted SSL cert. Though it didn't used to be the case, I see docs and blog posts stating that `localhost` is now a trusted origin in all the major browsers. I haven't tried this myself, but I've heard it might work, so there's that. If not, good ol' letsencrypt certbot should get the job done.

Here's all the files and what they do:

* `index.html`

    this is a default landing page that checks the user's platform for PWA compatibility. If the user's platform is PWA compatible, it'll render an install button, otherwise, it'll render a "please load this page on supported platform" notice. Once the user completes the install, the app window is spawned, containing the app content (`./app_main.html`, which spawns the serviceWorker thread, etc). If the user hits it and the app is already installed, it just forwards to `./app_main.html`

* `app_main.html`

    this is the actual entry point for your app. This spawns/loads/manages the serviceWorker thread, and whatever else you want in your app. This file contains instructions on how to release app updates through the serviceWorker.

* `manifest.json`

    this is the secret sauce that makes a web page an installable app (in its own window and behaving more or less like any other app on the system). Both `index.html` & `app_main.html` link it

* `./gfx/app_touch_icon.svg`

    this is the app icon. It's also the favicon, and splash screen. Because it's SVG we don't have to worry about resolution and image dimensions. See the `icons` property in `manifest.json` -- we can specify all the standard system icon dimensions for the same file which is super nice.

* `./gfx/app_touch_icon.png`

    Apple gotta be different. Safari doesn't support SVG for app icon, so this is used when on MacOS and iOS

*  `./gfx/apple-share-icon.svg`

    For the Safari (MacOS) install instructions on `index.html`

* `serviceWorker.js`

    this is the secret sauce that lets you run your web app without a network connection (or really, a reachable server at all). Fair warning, if DNS lookup fails (like network is up, DNS server is up, it just doesn't know the hostname it was installed from), there's a good chance the browser engine in question will refuse to start your app (though the behavior is inconsistent across platforms).

* `./lib/app.js`

    this would normally be the main code for your app. Here, all it does is spawn the serviceWorker, manage button state for the `Install & Restart` button, handle click on the `Check for Updates` button, and toggle the UI mode for the `Light Mode/Dark Mode` button.

* `./main.css`

    basic CSS that applies to the app as a whole and `:root` variables to drive light/dark themes


## TO-DO

* (1/14/26) Firefox actually *does* support installable PWAs now?! At least on windows on FFOX Developer Edition? Because I just discovered it testing out the live link above. The app works, its just (like safari) the installer banner on `index.html` seems confused, not sure if unsupported events on that platform or just that the code wasn't expecting FFOX to actually support `manifest.json`? Will get down with that shortly! Wow!

* Add push notifications. This feature is mature and well supported across browser engines.

    https://developer.mozilla.org/en-US/docs/Web/API/Push_API

* Make `index.html` work properly on Safari

    the `beforeinstallprompt` and `appinstalled` events which drive the install dialog are not support on Safari. You can still directly install from the `[+]` icon in the browser's location bar (or `add to homescreen` in the share menu on iOS), and the app will function normally. This just needs a nicer install banner kinda thing for Safari.
