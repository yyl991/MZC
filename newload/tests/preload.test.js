const fs=require("fs"),vm=require("vm"),path=require("path"),assert=require("assert");
const html=fs.readFileSync(path.join(__dirname,"../index.html"),"utf8");
const start=html.indexOf("function backgroundPreload()");
const code=html.slice(start,html.indexOf("</script>",start));
function run(withData) {
  const urls=[];
  const sb={setTimeout:fn=>fn(),Image:class {set src(value){urls.push(value);if(this.onload)this.onload();}}};
  sb.window=sb;vm.createContext(sb);
  if(withData)vm.runInContext(`
    const MOCK_MOMENTS_DATA={role:{posts:[{images:["./moment.jpg"]}]}};
    const MOCK_PHOTOS=[{src:"./old-photo.jpg"}];
    function getPhoneDisplayList(){return [{type:"section"},{src:"./actual-photo.jpg"}];}
  `,sb);
  vm.runInContext(code,sb);
  assert.strictEqual(sb.MOCK_MOMENTS_DATA,undefined); // const确实没有挂window
  sb.backgroundPreload();return urls;
}
assert.deepStrictEqual(run(true),["./moment.jpg","./actual-photo.jpg"]);
assert.deepStrictEqual(run(false),[]); // 可选模块缺失不抛错
console.log("OK preload: lexical const data, actual photo source, missing-module fallback");
