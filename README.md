Architecture
============

Application server runs on 9000 under the path /replay

Proxy server runs on https 8000. 

If the request is not to /replay it proxies to session cam. Otherwise it proxies
to our application server. 

This allows both things to be on the same domain.

Startup
=======

1. grunt serve
2. ./runscope-passageway -b yjky3ycny91o 9000
3. Copy the domain name into Session Cam -> My Session Cam -> My Segments -> Session Cam Replay (Edit) -> Actions ->  HTTP End Point
  # https://<domain>/replay/api/sessions/receive
4. Go to https://localhost:8000/replay/

You can debug incoming sessions from https://www.runscope.com/passageway/yjky3ycny91o

TODO
====
Auto play
