#! /bin/bash
echo "Installing development tools..."

# Add persistent environmental variables for Intel's proxy
export HTTP_PROXY=http://proxy.jf.intel.com:911
export HTTPS_PROXY=http://proxy.jf.intel.com:911
sudo bash -c 'echo "export HTTP_PROXY=http://proxy.jf.intel.com:911" >> /etc/environment'
sudo bash -c 'echo "export HTTPS_PROXY=http://proxy.jf.intel.com:911" >> /etc/environment'

# Install development tools
yes | sudo apt-get install git nano
sudo npm install -g grunt-cli bower  # grunt for build and test server, bower for dependency management
sudo npm install  # Add the other dev dependencies (global option not needed)

# Point web server to repository's www
sudo rm -rf /srv/www  # Remove www folder that was created from overlays
# Replace it with a symbolic link to the corresponding location in the repository
sudo ln -s ~/SAM/overlays/ipm/rootfs/srv/www/ /srv/www
# Also add www shortcut in home folder as a convenience, e.g. cd ~/www/source
sudo ln -s ~/SAM/overlays/ipm/rootfs/srv/www/ ~/www

# If specified (with switch "-s samba"), install SAMBA share
# User can access SAMBA share at \\{IP}\{username}
while getopts ':s:' option; do
  case "${option}" in
    s) SERVER=${OPTARG}
       ;;
  esac
done


if [[ "$SERVER" == "samba" ]]; then
  yes | sudo apt-get install samba
  USER="$(whoami)"
  sudo sh -c "echo $USER = $USER > /etc/samba/smbusers"
  sudo cp smb.conf /etc/samba/smb.conf
  sudo smbpasswd -a $USER  # Require user to specify SAMBA password
  sudo /etc/init.d/smbd restart
  sudo /etc/init.d/nmbd restart
  echo "SAMBA share $USER was created."
fi

echo "Finished installing development tools."
