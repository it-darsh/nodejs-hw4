const Koa = require('koa');
const app = new Koa();
const static = require('koa-static');
const port = process.env.PORT || 3000;
const router = require('./routes');
const path = require('path');
const session = require('koa-session');
const config = require('./config');
const Pug = require('koa-pug');

new Pug({
  viewPath: path.resolve(__dirname, './views'),
  pretty: false,
  basedir: './views',
  noCache: true,
  app: app
})

app.use(static('./public'));

app.use(session(config.session, app))

app.use(router.routes());

app.listen(port, () => {
  console.log('Server start on port: ', port);
});