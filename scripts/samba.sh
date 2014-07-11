yes | sudo apt-get install samba
USER="$(whoami)"
sudo sh -c "echo $USER = $USER > /etc/samba/smbusers"
sudo cp smb.conf /etc/samba/smb.conf
sudo smbpasswd -a $USER  # Require user to specify SAMBA password
sudo /etc/init.d/smbd restart
sudo /etc/init.d/nmbd restart
echo "SAMBA share $USER was created."
