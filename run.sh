#!/bin/sh

apt install build-essential cmake libgl1-mesa-dev

pip install -r ./runtime/requirements.txt

python3 ./runtime/api/index.py