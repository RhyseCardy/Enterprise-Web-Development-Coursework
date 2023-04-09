#!/bin/bash
apt update
apt install sudo
sudo apt-get install -y git 
sudo apt-get install wget
sudo apt-get install -y gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo apt-get install -y nodejs
mkdir MongoDatabase
git clone https://github.com/RhyseCardy/Enterprise-Web-Development-Coursework.git
cd Enterprise-Web-Development-Coursework/
cd backend/
npm install
