#!bin/sh
cd /Users/renpenghao/Desktop/work-place/Blog-server/Blog-Server-nodeJs/node-blog/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log    