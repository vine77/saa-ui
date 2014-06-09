#! /bin/bash
echo -e "Installing front-end development tools... \n"

# Use Intel's proxy to reach outside world
sudo bash -c 'echo "export HTTP_PROXY=http://proxy.jf.intel.com:911" >> /etc/environment'
sudo bash -c 'echo "export HTTPS_PROXY=http://proxy.jf.intel.com:911" >> /etc/environment'
export {http,https,ftp}_proxy=http://proxy.jf.intel.com:911
npm config set proxy http://proxy.jf.intel.com:911
npm config set https-proxy http://proxy.jf.intel.com:911

# Install development tools
sudo npm install -g grunt-cli bower

# Remove proxy
sudo head -n -2 /etc/environment > ~/tmp/environment
sudo mv ~/tmp/environment /etc/environment
unset {http,https,ftp}_proxy
npm config delete proxy
npm config delete https-proxy

echo -e "\nFinished installing front-end development tools. \n"
