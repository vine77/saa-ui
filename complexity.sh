cd ~/saa-ui
git checkout $(git rev-list -n 1 --before="$(node -p "require('moment')().startOf('month').subtract(5, 'month').format()")" master)
plato -r -d ~/plato/saa-ui -t "SAA UI" -D `node -p "require('moment')().startOf('month').subtract(5, 'month').unix()"` ~/saa-ui/scripts/**/*.js
git checkout $(git rev-list -n 1 --before="$(node -p "require('moment')().startOf('month').subtract(4, 'month').format()")" master)
plato -r -d ~/plato/saa-ui -t "SAA UI" -D `node -p "require('moment')().startOf('month').subtract(4, 'month').unix()"` ~/saa-ui/scripts/**/*.js
git checkout $(git rev-list -n 1 --before="$(node -p "require('moment')().startOf('month').subtract(3, 'month').format()")" master)
plato -r -d ~/plato/saa-ui -t "SAA UI" -D `node -p "require('moment')().startOf('month').subtract(3, 'month').unix()"` ~/saa-ui/scripts/**/*.js
git checkout $(git rev-list -n 1 --before="$(node -p "require('moment')().startOf('month').subtract(2, 'month').format()")" master)
plato -r -d ~/plato/saa-ui -t "SAA UI" -D `node -p "require('moment')().startOf('month').subtract(2, 'month').unix()"` ~/saa-ui/scripts/**/*.js
git checkout $(git rev-list -n 1 --before="$(node -p "require('moment')().startOf('month').subtract(1, 'month').format()")" master)
plato -r -d ~/plato/saa-ui -t "SAA UI" -D `node -p "require('moment')().startOf('month').subtract(1, 'month').unix()"` ~/saa-ui/scripts/**/*.js
git checkout master
plato -r -d ~/plato/saa-ui -t "SAA UI" ~/saa-ui/scripts/{*.js,**/*.js}
