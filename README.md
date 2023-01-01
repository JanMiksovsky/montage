Note: As of September 2022, the collage layout styling only works properly in Safari. It doesn't work correctly in Chrome.

# Install webviewscreensaver

https://github.com/liquidx/webviewscreensaver

# Start the server

From project root:

```sh
slideshow.sh
```

# Set screen saver in Desktop & Screen Saver properties

Select "WebViewScreenSaver".
Click "Screen Saver Options…".
Enter the URL `http://localhost:3000/slideshow.html`.

# Install cron job

To start the server automatically:

```sh
crontab cronjob
```
