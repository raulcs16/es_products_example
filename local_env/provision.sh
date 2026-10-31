#!/bin/bash
# 1. Stop and disable the automatic upgrade services
sudo systemctl stop unattended-upgrades
sudo systemctl disable unattended-upgrades
    
# 2. Disable apt periodic update triggers
sudo sed -i 's/Update-Package-Lists "1"/Update-Package-Lists "0"/' /etc/apt/apt.conf.d/10periodic || true
sudo sed -i 's/Unattended-Upgrade "1"/Unattended-Upgrade "0"/' /etc/apt/apt.conf.d/20auto-upgrades || true
# 3. Clean up any existing apt/dpkg locks safely
sudo dpkg --configure -a

echo "Installing dependencies..."
sudo apt-get update
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/9.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-9.x.list
# Download and install the public signing key:
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg
# Install the apt-transport-https packages
sudo apt-get install apt-transport-https
# Save the repository definition
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/9.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-9.x.list
sudo apt-get update && sudo apt-get install elasticsearch

sudo tee /etc/elasticsearch/elasticsearch.yml > /dev/null <<'EOF'
# cluster
cluster.name: products_search
# node
node.name:  node-1
#path
path.data: /var/lib/elasticsearch
path.logs: /var/lib/elasticsearch
#memory
#path
network.host: "0.0.0.0"
http.port: 9200
#discovery
discovery.seed.hosts: ["127.0.0.1"]
cluster.initial_master_nodes: ["node-1"]
##security

xpack.security.enabled: false
xpack.security.enrollment.enabled: true
xpack.security.http.ssl:
    enabled: true
    keystore.path: certs/http.p12
xpack.security.transport.ssl:
    enabled: true
    verification_mode: certificate
    keystore.path: certs/transport.p12
    truststore.path: certs/transport.p12

http.host: "0.0.0.0"
EOF

# Give permissions to read elasticsearch logs

sudo chmod 755 -R /var/log/elasticsearch/

# Configure Elasticsearch to start automatically when the system boots up
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable elasticsearch.service

sudo /bin/systemctl start elasticsearch.service
sudo /bin/systemctl status elasticsearch.service


## Configure Kibana
ES_VERSION=$(sudo /usr/share/elasticsearch/bin/elasticsearch --version 2>/dev/null | awk '/Version:/ {print $2}' | tr -d ',')
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y "kibana=${ES_VERSION}"

sudo tee /etc/kibana/kibana.yml > /dev/null << 'EOF'


#system server
server.port: 5601
server.host: "0.0.0.0"

#logging:
logging:
    appenders:
        file:
            type: file
            filename: /var/log/kibana/kibana.log
            layout:
                type: json
    root:
        appenders:
            - default
            - file

#system other
pid.file: /run/kibana/kibana.pid

EOF

sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable kibana.service

sudo /bin/systemctl start kibana.service
sudo /bin/systemctl status kibana.service