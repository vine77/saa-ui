if [ $# -eq 0 ]
  then
    echo "Provide work week as integer for argument"
    exit 1
fi

echo "Generating report..."

WEEK=$1
CURRENTPATH=$(pwd)
WORKWEEK="WW$WEEK"
FILEPATH="$CURRENTPATH/ww$WEEK-update.md"
AFTER="$(node -p "require('moment')($WEEK, 'WW').format()")"
BEFORE="$(node -p "require('moment')($WEEK, 'WW').add(1, 'week').format()")"
TAB=$'\t'

echo -e "# $WORKWEEK SAA Front-End Update\n" > $FILEPATH

cd ~/saa-groups
echo -e "saa-groups.git" >> $FILEPATH
echo -e "--------------\n" >> $FILEPATH
echo -e "### Commits\n" >> $FILEPATH
git log --all --no-merges --after="$AFTER" --before="$BEFORE" --pretty=format:"%h %an: %s" | sed "s/Nathan Ward/NW/g;s/Alex Houchens/AH/g;s/GregoryX Houchens/AH/g" >> $FILEPATH
echo -e "\n" >> $FILEPATH

cd ~/saa-ui
echo -e "saa-ui.git" >> $FILEPATH
echo -e "----------\n" >> $FILEPATH
echo -e "### Commits\n" >> $FILEPATH
git log --all --no-merges --after="$AFTER" --before="$BEFORE" --pretty=format:"%h %an: %s" | sed "s/Nathan Ward/NW/g;s/Alex Houchens/AH/g;s/GregoryX Houchens/AH/g" >> $FILEPATH
echo -e "\n" >> $FILEPATH

cd ~/co-ui
echo -e "co-ui.git" >> $FILEPATH
echo -e "---------\n" >> $FILEPATH
echo -e "### Commits\n" >> $FILEPATH
git log --all --no-merges --after="$AFTER" --before="$BEFORE" --pretty=format:"%h %an: %s" | sed "s/Nathan Ward/NW/g;s/Alex Houchens/AH/g;s/GregoryX Houchens/AH/g" >> $FILEPATH
echo -e "\n" >> $FILEPATH

cd ~/sam
echo -e "SAM.git" >> $FILEPATH
echo -e "-------\n" >> $FILEPATH
echo -e "### git shortlog -ns\n" >> $FILEPATH
git shortlog -ns | head -10 | sed "/gkblditp/d;s/${TAB}/ /g" >> $FILEPATH

cd $CURRENTPATH
echo "Finished generating report: $FILEPATH"
