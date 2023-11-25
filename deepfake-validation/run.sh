#!/bin/sh

apt install build-essential cmake libgl1-mesa-dev

pip install -r requirements.txt

python3 ./api/index.py