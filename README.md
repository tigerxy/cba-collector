# cba-collector

# TODO
- [ ] hilfe (uta)
- [ ] größen beschreiben (uta)
- [ ] automatisch haufen auf karte aktuallisieren (roland)
- [ ] zurücksetzen button für admin (roland)
- [ ] user in status anzeigen (roland)
- [x] tooltip gebietname
- [x] auswahl haufengröße
- [x] benachrichtigungen automatisch ausblenden
- [x] button um zu gebiet zurück zu kehren

# Installation
## Node.js
Install packages
> npm install

Run app normal
> sudo npm run 

# Development
## Node.js
Run app during development
> sudo npm run dev

## Typescript
Run watcher:
> ./node_modules/typescript/bin/tsc -w -p ./

# Azure

## Web-Service
TODO: descripe DNS entrys

## SSH Key
Generate with Let's Encrypt SSL key.

Docker command:
> sudo docker run -it --rm --name certbot -v "etcletsencrypt:/etc/letsencrypt" -v "libletsencrypt:/var/lib/letsencrypt" certbot/certbot certonly --manual --preferred-challenges dns

This files are now generated:
> cert.pem  chain.pem  fullchain.pem  privkey.pem  README

Find docker volume with generated keys:
> docker volume inspect etcletsencrypt

Convert key:
> openssl pkcs12 -certfile chain.pem -inkey privkey.pem -in cert.pem -export -out cert.pfx

Upload cert.pfx file to Azure an select it for cosumised domain.