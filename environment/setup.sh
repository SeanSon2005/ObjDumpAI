#! /bin/bash

touch package_versions.txt
printf "Python: " > package_versions.txt
python3 --version | cut -c 8- >> package_versions.txt

sudo apt install python3-django > /dev/null
printf "Django: " >> package_versions.txt
django-admin --version >> package_versions.txt

sudo apt install python3-pip python3-venv > /dev/null
python3 -m venv env
source env/bin/activate

pip install -r requirements.txt
printf "Requirement Versions... " >> package_versions.txt

