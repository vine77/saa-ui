#! /bin/bash
echo "Installing development tools..."

# Add persistent environmental variables for Intel's proxy
export HTTP_PROXY=http://proxy.jf.intel.com:911
export HTTPS_PROXY=http://proxy.jf.intel.com:911
sudo bash -c 'echo "export HTTP_PROXY=http://proxy.jf.intel.com:911" >> /etc/environment'
sudo bash -c 'echo "export HTTPS_PROXY=http://proxy.jf.intel.com:911" >> /etc/environment'

# Install development tools
sudo npm install -g grunt-cli bower  # grunt for build and test server, bower for dependency management
sudo npm install  # Add the other dev dependencies (global option not needed)

# Point web server to corresponding location in repository
sudo rm -rf /srv/www
sudo ln -s ~/SAM/overlays/ipm/rootfs/srv/www/ /srv/www

echo "Finished installing development tools."
