#!/bin/bash

docker-compose down -v
docker-compose up -d

until docker-compose exec node1 mysql -uroot -pmypass \
  -e "CREATE USER 'root'@'%' IDENTIFIED BY 'mypass';" \
  -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;" \
  -e "CREATE DATABASE mydb;"
do
    echo "Waiting for mysql_master database connection..."
    sleep 4
done

docker-compose exec node1 mysql -uroot -pmypass \
  -e "SET @@GLOBAL.group_replication_bootstrap_group=1;" \
  -e "create user 'repl'@'%' IDENTIFIED WITH sha256_password BY 'mypass';" \
  -e "GRANT SELECT,REPLICATION SLAVE ON *.* TO repl@'%';" \
  -e "flush privileges;" \
  -e "change master to master_user='root' for channel 'group_replication_recovery';" \
  -e "START GROUP_REPLICATION;" \
  -e "SET @@GLOBAL.group_replication_bootstrap_group=0;" \
  -e "SELECT * FROM performance_schema.replication_group_members;"

for N in 2 3
do docker-compose exec node$N mysql -uroot -pmypass \
  -e "change master to master_user='repl', master_password='mypass' for channel 'group_replication_recovery';" \
  -e "START GROUP_REPLICATION;"
done
  
docker-compose exec node1 mysql -uroot -pmypass \
  -e "SHOW VARIABLES WHERE Variable_name = 'hostname';" \
  -e "SELECT * FROM performance_schema.replication_group_members;"

