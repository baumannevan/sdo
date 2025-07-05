#!/bin/bash

# Prompt for MySQL root password
echo "Enter MySQL root password:"
read -s MYSQL_ROOT_PASSWORD

# new MySQL user password
SDO_DEV_PASSWORD="password"

mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<EOF
CREATE DATABASE IF NOT EXISTS sdo_development;
CREATE USER IF NOT EXISTS 'sdo_development'@'localhost' IDENTIFIED BY '$SDO_DEV_PASSWORD';
GRANT ALL PRIVILEGES ON sdo_development.* TO 'sdo_development'@'localhost';
FLUSH PRIVILEGES;
EOF

echo "MySQL user 'sdo_development' has been set up with privileges on database 'sdo_development'."