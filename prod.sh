CLIENT=/var/www/html/drawo.ru/client
SERVER=/var/www/html/drawo.ru/server

RED='\033[0;31m'
GREEN='\033[0;32m'


echo "'${GREEN}'updating npm deps"
if ! yarn > /dev/null 2>&1; then
  echo "${RED}Could not update dependencies"
  exit 1
fi

echo "'${GREEN}'building client"
if ! yarn  build > /dev/null 2>&1; then
  echo "${RED}Build failed"
  exit 1
fi

echo "'${GREEN}'building server"
if ! yarn server:build > /dev/null 2>&1; then
  echo "${RED}Build failed"
  exit 1
fi

echo "${GREEN}********************"
echo "${GREEN}* Build successful *"
echo "${GREEN}********************"

[ -d "${CLIENT}"] && rm -R $CLIENT
[ -d "${SERVER}" ] && rm -R $SERVER

mkdir $CLIENT
mkdir $SERVER

echo "'${GREEN}'copying client and server bundles"
cp -R dist/client/* $CLIENT
cp -R dist/server/* $SERVER

rm /tmp/out
echo "#!/usr/bin/env node"|cat - $SERVER/main.js > /tmp/out && mv /tmp/out $SERVER/main.js

chmod +x $SERVER/main.js

systemctl restart drawo
