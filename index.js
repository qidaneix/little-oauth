import koa from "koa";
import koaRouter from "koa-router";
import axios from "axios";
const app = new koa();
const router = koaRouter();

router.get("/ask-code", async (ctx, next) => {
  const code = ctx.query.code;
  console.log("code", code);

  const getToken = await axios.get(
    `https://github.com/login/oauth/access_token`,
    {
      params: {
        code,
        client_id: "9e3d9aa06d8e0f1419d4",
        client_secret: "这我TM能公布出来？",
      },
      headers: {
        Accept: "application/json",
      },
    }
  );
  try {
    const getInfo = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: `token ${getToken.data.access_token}`,
      },
    });
    console.log("getInfo", getInfo.data);
    ctx.response.body = `ask-code page, data: ${JSON.stringify(getInfo.data)}`;
  } catch (e) {
    console.log(e);
  }
});
router.get("/", async (ctx, next) => {
  ctx.response.body = `<a href="https://github.com/login/oauth/authorize?client_id=9e3d9aa06d8e0f1419d4&scope=user">
  要github拿code
  </a>`;
});

app.use(async (ctx, next) => {
  console.log(`request ${ctx.URL}`);
  await next();
});
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log("ms", ms);
  ctx.set("the-time", `${ms}ms`);
});
app.use(router.routes());

app.listen(3000);
console.log("app started at port 3000...");
