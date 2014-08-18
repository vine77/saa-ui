echo "Generating report..."

CURRENTPATH=$(pwd)
TAB=$'\t'
FILEPATH=~/Dropbox/Intel/reports/$(node -p "require('moment')().startOf('month').format('YYYY-MM-DD')").md

cd ~/saa-ui
node -p "require('moment')().format('MMMM YYYY')" > $FILEPATH
echo -e "$(node -p "require('moment')().format('MMMM YYYY')" | sed -e "s/./=/g")\n" >> $FILEPATH
echo -e "saa-ui.git" >> $FILEPATH
echo -e "----------\n" >> $FILEPATH
echo -e "### Commits\n" >> $FILEPATH
~/saa-ui/gitreport.sh >> $FILEPATH
echo -e "\n" >> $FILEPATH

cd ~/co-ui
echo -e "co-ui.git" >> $FILEPATH
echo -e "---------\n" >> $FILEPATH
echo -e "### Commits\n" >> $FILEPATH
~/co-ui/scripts/gitreport.sh >> $FILEPATH
echo -e "\n" >> $FILEPATH

cd ~/sam
echo -e "SAM.git" >> $FILEPATH
echo -e "-------\n" >> $FILEPATH
echo -e "### git shortlog -ns\n" >> $FILEPATH
git shortlog -ns | head -10 | sed "/gkblditp/d;s/${TAB}/ /g" >> $FILEPATH

cd $CURRENTPATH
echo "Finished generating report: ~/Dropbox/Intel/reports/$(node -p "require('moment')().startOf('month').format('YYYY-MM-DD')").md"
