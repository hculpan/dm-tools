#!/bin/bash

rm -rf dist

npm run build

echo "Zipping dist"
cd dist
rm -f dmtools.zip
zip -r9 dmtools.zip *
echo "Copying to server"
scp -i ~/culpan_org dmtools.zip harry@culpan.org:~
rm -f dmtools.zip
cd ..
echo "Done"
