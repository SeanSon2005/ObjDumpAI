#! /bin/bash

touch environment/package_versions.txt
printf "Python: " > environment/package_versions.txt
python3 --version | cut -c 8- >> environment/package_versions.txt

sudo apt install python3-django > /dev/null
printf "Django: " >> environment/package_versions.txt
django-admin --version >> environment/package_versions.txt

sudo apt install python3-pip python3-venv > /dev/null
python3 -m venv environment/env
source environment/env/bin/activate

pip install -r environment/requirements.txt
printf "Requirement Versions... " >> environment/package_versions.txt

