# Point web server to repository's www
sudo rm -rf /srv/www  # Remove www folder that was created from overlays
# Replace it with a symbolic link to the corresponding location in the repository
sudo ln -s ~/SAM/overlays/ipm/rootfs/srv/www/ /srv/www
# Also add www shortcut in home folder as a convenience, e.g. cd ~/www/source
sudo ln -s ~/SAM/overlays/ipm/rootfs/srv/www/ ~/
