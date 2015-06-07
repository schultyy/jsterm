rm -rf src/*.js
rm -rf src/browser/*.js
tsc src/*.ts --target es5 --module commonjs
tsc src/browser/*.ts --target es5 --module commonjs
