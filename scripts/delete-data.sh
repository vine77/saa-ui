#! /bin/bash
sudo rm -rf /data/*
sudo touch /data/nostart-carbon
sudo touch /data/nostart-logstash
sudo touch /data/nostart-elasticsearch
sudo mkdir /data/system/
sudo touch /data/system/is-slave
