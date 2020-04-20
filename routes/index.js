const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');
const db = require('../model/db');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const util = require('util')
const rename = util.promisify(fs.rename);

router.get('/', async (ctx) => {
  await ctx.render('pages/index', {
    authorized: ctx.session.isAuth,
    social: db.get('social'),
    skills: db.get('skills'),
    products: db.get('products'),
  });
});

router.get('/login', async (ctx) => {
  if (ctx.session.isAuth) {
    await ctx.redirect('/admin');
  } else {
    await ctx.render('pages/login', {      
      social: db.get('social'),
    });
  }
});

router.get('/admin', async (ctx) => {
  if (ctx.session.isAuth) {
    await ctx.render('pages/admin', {
      skills: db.get('skills'),
    });
  } else {
    await ctx.redirect('/login');
  }
});

router.post('/login', koaBody(), async (ctx) => {
  //проверка связки логин-пароль
  if (!ctx.request.body.password || !ctx.request.body.email) {
    await ctx.render('pages/login');
  } else {    
    ctx.session.isAuth = true
    await ctx.redirect('/admin');
  }
});

router.post('/admin/skills', koaBody(), async (ctx) => {
  const age = (ctx.request.body.age) ? ctx.request.body.age : undefined;
  const concerts = (ctx.request.body.concerts) ? ctx.request.body.concerts : undefined;
  const cities = (ctx.request.body.cities) ? ctx.request.body.cities : undefined;
  const years = (ctx.request.body.years) ? ctx.request.body.years : undefined;

  if(age || concerts || cities || years) {
    db.set('skills',[age, concerts, cities, years]);
  }
  await ctx.redirect('/admin');
});


router.post('/admin/upload',
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + '/public/assets/img/products',
    },
  }),
  async (ctx) => {
    const name = ctx.request.files.photo.name;
    const { path: filePath } = ctx.request.files.photo
  
    const { projectName, projectUrl, text } = ctx.request.body
    // console.log(__dirname)
    // console.log(process.cwd())

    let fileName = path.join(process.cwd(), 'public', 'assets', 'img', 'products', name)

    const errUpload = await rename(filePath, fileName)
    if (errUpload) {
      return (ctx.body = {
        mes: 'Something went wrong try again...',
        status: 'Error',
      })
    }    
    db.add('products', {
      src: './assets/img/products/' + name,
      name: ctx.request.body.name,
      price: ctx.request.body.price
    });
    ctx.redirect('/admin')
  }
)

module.exports = router;