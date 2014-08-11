cd ~/saa-ui
git checkout `git rev-list -n 1 --before="5 months ago" master`
plato -r -d ~/plato/saa-ui -t "SAA UI" -x .json ~/saa-ui/scripts/{*.js,**/*.js}
git checkout `git rev-list -n 1 --before="4 months ago" master`
plato -r -d ~/plato/saa-ui -t "SAA UI" -x .json ~/saa-ui/scripts/{*.js,**/*.js}
git checkout `git rev-list -n 1 --before="3 months ago" master`
plato -r -d ~/plato/saa-ui -t "SAA UI" -x .json ~/saa-ui/scripts/{*.js,**/*.js}
git checkout `git rev-list -n 1 --before="2 months ago" master`
plato -r -d ~/plato/saa-ui -t "SAA UI" -x .json ~/saa-ui/scripts/{*.js,**/*.js}
git checkout `git rev-list -n 1 --before="1 months ago" master`
plato -r -d ~/plato/saa-ui -t "SAA UI" -x .json ~/saa-ui/scripts/{*.js,**/*.js}
git checkout master
plato -r -d ~/plato/saa-ui -t "SAA UI" -x .json ~/saa-ui/scripts/{*.js,**/*.js}
