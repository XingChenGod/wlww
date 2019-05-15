const Koa = require('koa'),
      Router = require('koa-router'),
      cheerio = require('cheerio'),
    // 解决中文乱码
      charset = require('superagent-charset'),
      superagent = charset(require('superagent')),
      app = new Koa(),
      router = new Router();

router.get('/', async ctx => {
   const url = 'https://news.baidu.com/';

   superagent.get(url)
       .charset('utf-8')
       .end((err, sres) => { // 获取数据
           if (err) {
               ctx.body = err;
           }
           const html = sres.text; // 获取到html
           const $ = cheerio.load(html, { // 解析页面
               decodeEntities: false,
               ignoreWhitespace: false,
               xmlMode: false,
               lowerCaseTags: false
           });
           console.log(1);
           let obj = {}, arr = [];
           $(".hotnews ul li strong").each((index, element) => {
               const text = $(element).text().replace(/\n/g, '');
              arr.push(text);
           });
           console.log(arr);
           try {
               ctx.body = {arr};
           }catch (e) {
               console.log(e);
           }

       })
});

app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3002, () => {
    console.log('服务已启动');
})
