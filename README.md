Nginx
-----

Proxy server runs on https 8443. 

If the request is not to /replay it proxies to session cam. Otherwise it proxies
to our application server. 

This allows both things to be on the same domain.

```
    server {
        listen       8443 ssl;
        server_name  localhost;

        ssl_certificate      cert.pem;
        ssl_certificate_key  cert.key;

        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;

        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;

        location / {
            proxy_pass https://console.sessioncam.com;
        }

        location /replay/ {
            proxy_pass http://localhost:9000;
        }
    }
```

Startup
=======

1. grunt serve:dist
2. ./runscope-passageway -b yjky3ycny91o 9000
3. Start NGINX
4. Copy the domain name into Session Cam -> My Session Cam -> My Segments -> Session Cam Replay (Edit) -> Actions ->  HTTP End Point
  # https://<domain>/replay/api/sessions/receive
5. Go to https://localhost:8443/replay/

You can debug incoming sessions from https://www.runscope.com/passageway/yjky3ycny91o
