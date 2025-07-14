## webpack
### loader 和 plugin 区别
+ 常见loader
    - babel-loader：es6 转为 es5
    - sass-loader：sass 转为 css
    - postcss-loader：优化 css，加前缀等
    - css-loader：css 转为 js 字符串
    - style-loader：js 字符串转为 style 标签
    - vue-loader：单文件组件（SFC）转为 js 模块
    - thread-loader：用于多进程打包
+ 常见plugin
    - html-webpack-plugin：生成 html，并自动引入 js、css
    - mini-css-extract-plugin：用于将 js 中的 css 抽离成单独的 css 文件
    - Eslint-webpack-plugin：用于检查代码中的错误
    - SplitChunkPlugin：用于代码分包（code split）
    - Dll Plugin + DllReference plugin 用于避免大依赖频繁重新打包，大幅降低打包时间
    - clean-webpack-plugin：用于清理之前打包的残留文件
    - copy-webpack-plugin：用于拷贝静态文件到dist
    - 自动生成骨架屏
+ loader 和 plugin 区别、
    - loader 是加载器，plugin 是 webpack 插件
    - loader 能够对文件进行编译、优化、混淆等，比如...，plugin 有更多功能，比如...
    - loader 在生成最终产物之前运行，plugin 在整个打包过程（以及前后）都能运行
    - loader 处理资源模块，plugin 解决打包过程额外需求和功能

### webpack 如何解决开发时的跨域问题
```javascript
module.exports = {
  // ...
  devServer: {
    proxy: {
      'api': {
        target: 'http://10.0.2.30:9090',
        changeOrigin: true, // 修改请求中的 origin
        secure: false // 如果请求 https 且不配证书可以这样搞
      }
    }
  }
}
```

### 如何实现 tree-shaking
+ tree-shaking 是依赖模块静态分析实现的功能，在编译时安全的移除代码中没有使用的部分
+ 怎么删
    - 使用 ES Modules 语法（import ，export）才能删
    - CommonJS 语法无法 tree-shaking （require，exports）
    - 只引入需要的模块
        * 要写 import { cloneDeep } from 'lodash-es'
        * 不要写 import _ from lodash
+ 怎么不删
    - 在 package.json 中配置 sideEffects，防止某些文件被删掉
    - 比如 import 了 x.js，而 x.js 里只是添加了 window.x 属性，那 x.js 路径就要放到 sideEffects 里
    - 比如所有被 import 的 css 都要放在 sideEffects 里
+ 怎样开启
    - mode: production
    - 开发环境不用 tree-shaking

### 如何提高 webpack 构建速度
+ DllPlugin 将不变化的代码提前打包，并复用，如 vue，react
+ thread-loader 或 HappyPack 进行多线程打包
+ 开发环境，在 webpack config 中将 cache 设为 true，或使用 cache-loader
+ 生产环境，关闭不必要的环节，如 source map

### webpack 与 vite 的区别是什么
+ 开发环境区别
    - vite 自己实现的 server，不对代码打包，利用浏览器对 <script type=module> 的支持
        * 比如 main.js 引入了 vue
        * 只改引入文件的路径，比如 import { createApp } from 'vue' => import { createApp } from 'node_modules/xxxx/vue.js'
    - webpack-dev-server 使用 babel-loader 基于内存打包，比 vite 慢很多
        * 会把 vue.js 的代码（递归的）打包进 main.js
+ 生产环境区别
    - vite 使用 <font style="background-color:#ED740C;">rollup</font> + <font style="background-color:#8CCF17;">esbuild（go）</font> 打包 js 代码
    - <font style="background-color:#ED740C;">webpack</font> 使用 <font style="background-color:#8CCF17;">babel（js）</font>打包 js 代码，慢很多
        * webpack 也能使用 esbuild，需要配置
+ 文件处理时机
    - vite 在请求某个文件时侯处理文件
    - webpack 会提前打包好，请求的时候直接输出打包好的 JS
+ vite 的缺点
    - 热更新常常失败，原因不清楚
    - 有些功能 rollup 不支持，需要自己写插件（例如：自动生成骨架屏）
    - 不支持非现代浏览器

### webpack 怎么配置多页应用
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['app']
    }),
    new HtmlWebpackPlugin({
      filename: 'admin.html',
      chunks: ['admin']
    })
  ]
    
}
```

+ 这样写会有重复打包问题，比如 app.js 和 admin.js 都引入了 vue.js，那么 vue.js 的代码既会打包进 app.js，也会打包进 admin.js。需要分包。
+ 支持无限多页面，Node.js 引入目录，循环
    - fs.readdirSync('./src/pages')
    - .filter(file => file.endWith('js'))   // 取 js 文件
    - .map(file => path.basenam(file, '.js'))  // 取文件名
    - 生成上面的格式

### swc、esbuild 是什么
+ swc
    - 实现语言：Rust
    - 编译、打包 JS/TS
    - 不能对 TS 进行类型检查；不能打包 CSS、SVG 等 非 js文件
+ esbuild
    - 实现语言：Go
    - 编译、打包 JS/TS
    - 不能对 TS 进行类型检查；不能打包 CSS、SVG 等 非 js文件

## HTTP
### 状态码
[https://www.yuque.com/u1361107/brekb1/eo14rh](https://www.yuque.com/u1361107/brekb1/eo14rh)

### GET 和 POST 的区别有哪些
+ 语义上，get 是读，post 是写，所以 get 是幂等的，post 不是幂等的（一般查询用get，增加、编辑、删除用post）
+ 通常浏览器打开页面发送 get 请求，也可以用 post 打开网页，用 form 标签
+ get 打开的页面刷新是无害的，post 打开的页面刷新需要确认
+ get 打开的页面可以添加书签
+ get 请求结果可以被缓存，post 结果不会被缓存



+ 通常，get 参数在 url 上，post 参数在消息体里
+ get 参数放在 url 上有长度限制，post 在 body 里可以传更多数据



+ get 产生一个 tcp 数据包，post 产生两个或以上 tcp 数据包
+ ![](https://cdn.nlark.com/yuque/0/2023/png/1622085/1690355093153-2b3dac43-274e-4314-8c36-38864837d91c.png)

### HTTP 缓存有哪些方案
[https://www.yuque.com/u1361107/xe1aqa/eqdbm1](https://www.yuque.com/u1361107/xe1aqa/eqdbm1)

+ cache-control 多长时间后过期，http1.1
+ expires 什么时间过期，用户本地时间，http1.0
+ Etag（响应头）if-None-Match（请求头），http1.1，返回 200 或 304
+ last-Modified（响应头）if-Modified-Since（请求头） http1.0，返回 200 或 304

### HTTP 和 HTTPS 的区别有哪些
+ http 明文传输，不安全；https 加密传输，安全
+ http 使用 80 端口；https 使用 443 端口
+ https 多了加密解密的过程，比 http 慢
+ https 需要证书，http 不需要

### HTTP/1.1 和 HTTP/2 的区别有哪些
[https://febook.hzfe.org/awesome-interview/book3/network-http-1-2](https://febook.hzfe.org/awesome-interview/book3/network-http-1-2)

+ http2 使用二进制传输，且 head 和 body 分成帧来传输；http1.1 是字符串传输
+ http2 支持多路复用，在单个 TCP 连接上并行的处理多个 http 请求响应
    - 队头阻塞：http1.1也支持持久连接（请求头 Connection: keep-alive），能在一次 TCP 连接中发送和接收多个 http 请求/响应，但是一个管道中同时只能处理一个请求
    - 头部冗余：http 每次请求都会带上头部
    - TCP 连接数限制，同一个域名，只允许同时存在若干个 TCP 连接，超过浏览器限制，后续请求被阻塞
+ http2 可以压缩 head，http1.1 不行
+ http2 支持服务器推送
    - 允许服务端主动向浏览器推送额外资源，不再是完全被动的响应请求
    - 如客户端请求 html，服务端同时下发 js 和 css 文件

### TCP 三次握手和四次挥手是什么
+ 三次握手
    - 浏览器向服务器发送 TCP 数据：SYN(seq=x)
    - 服务器向浏览器发送 TCP 数据：ACK(seq=x+1),SYN(seq=y)
    - 浏览器想服务器发送 TCP 数据：ACK(seq=y+1)
+ 四次挥手
    - 浏览器向服务器发送 TCP 数据：FIN(seq=x)
    - 服务器向浏览器发送 TCP 数据：ACK(seq=x+1)
    - 服务器向浏览器发送 TCP 数据：FIN(seq=y)
    - 浏览器向服务区发送 TCP 数据：ACK(seq=y+1)
+ [https://zhuanlan.zhihu.com/p/108504297](https://zhuanlan.zhihu.com/p/108504297)
+ TCP 头部
    - 两个16位的端口
    - 32位的序号 **seq**
    - 32位的确认号 **ack**
    - 1位的标志位 **SYN** **ACK** **FIN**
        * SYN：同步标志位，用于建立连接，同步序列号
        * ACK：确认标志位，对已接受的数据包进行确认
        * FIN：完成标志位，表示没有数据要发送了，即将关闭连接
    - 最多40字节
+ 三次握手
    - 第一次握手：客户端在头部将标志位 SYN 置为 1，生成随机序号 seq，指定端口号发送
    - 第二次握手：服务器收到数据包后，由 SYN=1 知道客户端请求建立连接，同意连接的话将标志位 SYN 和 ACK 都置为 1，将收到的序号 +1 作为 确认号，生成自己的序号 seq，将数据包发送给客户端
    - 第三次握手：客户端收到确认后，检查确认号是否为自己发送的序号 +1，检查标志位 ACK 是否为 1，如果正确则将自己的标志号 ACK 置为 1，也将收到的序号 +1 作为确认号，将数据包发送为服务器，服务器也检查确认号和标志位，正确则建立连接成功
+ 四次挥手：可以是客户端或服务器发起，假设是客户端发起
    - 第一次挥手：客户端向服务器发送标志位 FIN 的报文段，并设置序号，表示客户端没有数据要发送给服务器了
    - 第二次挥手：服务器收到 FIN 报文段，向客户端发送 ACK 报文段，并将收到的序号 +1 作为确认号，确认并同意关闭请求
    - 第三次挥手：服务器向客户端发送标志位是 FIN 的报文段，请求关闭连接
    - 第四次挥手：客户端收到 FIN 报文段，向服务器发送 ACK 报文段，并将收到的序号 +1 作为确认号；服务端收到后关闭连接，客户端等 2MSL 的时间后没有再收到回复，确认服务器已经正常关闭连接，自己也可以关闭连接
        * 为什么要等：
            + MSL 是报文段最大生存时间，是报文段被丢弃前在网络内的最长时间。如果由于网络原因，服务器没有收到客户端发送的 ACK 报文段，会重新发送 FIN 报文段，这个时候如果客户端已经关闭连接，会导致连接错乱。
            + 脏数据：立刻关闭，如果重新建立新的连接且端口号相同，如果前一次连接有数据滞留在网络中，这些延迟数据在新连接建立后到达客户端，由于ip端口都一样，会被当做新数据。所以需要等一等，保证本次连接的所有数据都在网络中消失。
+ ![](https://cdn.nlark.com/yuque/0/2023/png/1622085/1683717352132-9eedebaf-ef68-4827-88b6-fc1c2e707472.png)

## 事件委托
### DOM事件模型
+ 先经历从上到下捕获阶段，在经历从下到上冒泡阶段
+ addEventListener('click', fn, true/false) 第三个参数可以选择阶段，默认 false，在冒泡阶段触发
+ 可以使用 event.stopPropagation() 来阻止捕获或冒泡

### 手写事件委托
+ 在父元素上统一处理子元素的事件，通过判断触发事件的子元素执行对应的逻辑
+ 事件委托好处：节省监听器；实现动态监听
+ 坏处：调试比较复杂，不容易确定监听者

```javascript
ul.addEventListener('click', function(e) {
  if (e.target.tagName.toLowerCase() === 'li') { // e.tagret 是点击的元素，e.currentTarget 是监听的元素
    fn() // 执行某个函数
  }
})
```

```javascript
function delegate(element, eventType, selector, fn) {
  element.addEventListener(eventType, e => {
    let el = e.target
    while (!el.matches(selector)) {
      if (el === element) {
        el = null
        break
			}
      el = el.parentNode
    }
    el && fn.call(el, e)
  })
}

delegate('ul', click, 'li', fn)
```



### 手写可拖曳 div
```html
<body>
  <div id="xxx"></div>
  <script>
    let dragging = false
    let position = []

    xxx.addEventListener('mousedown', (e) => {
      dragging = true
      position = [e.clientX, e.clientY]
    })

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return false
      const { clientX, clientY } = e
      const deltaX = clientX - position[0]
      const deltaY = clientY - position[1]
      xxx.style.left = parseInt(xxx.style.left || 0) + deltaX + 'px'
      xxx.style.top = parseInt(xxx.style.top || 0) + deltaY + 'px'
      position = [clientX, clientY] 
    })

    document.addEventListener('mouseup', (e) => {
      dragging = false
    })
  </script>
</body>
```

## 说说同源策略和跨域
### 同源策略是什么
+ 如果两个 URL 协议、域名、端口号都完全一致，则这两个 URL 是同源的

### 同源策略怎么做
+ 只要在浏览器里打开页面，就默认遵守同源策略

### 优点
+ 保证用户隐私安全和数据安全

### 缺点
+ 很多时候前端需要访问另一个域名的后端接口，会被浏览器阻止获取响应
+ 请求会发出，响应会被浏览器屏蔽

### 跨域方法
+ JSONP
    - 利用 script 标签可以跨域的特性，动态创建 script 标签，src 是要请求的 url，参数带回调函数名，发送 get 请求
    - 服务端拿到请求，包装参数里的函数名，把数据作为参数传入回调函数
    - 客户端拿到响应后会调用回调函数，拿到服务端传来的数据
    - 优点改动较小，缺点只能发送 get 请求，且没有认证（可以用 csrf token）
+ CORS 跨域资源共享
    - 对于简单请求，服务器在响应头里添加 <font style="background-color:#FBDE28;">Access-Control-Allow-Origin: http://前端域名</font>
        * <font style="background-color:#FFFFFF;">get，head，post(content-type 不为 json) 等</font>
    - 对于复杂请求，如 patch，post(content-type: application/json)
        * 响应 options 请求，在请求头中添加
            + <font style="background-color:#FCE75A;">Access-Control-Allow-Origin</font>: https://前端站点
            + <font style="background-color:#FCE75A;">Access-Control-Allow-Methods</font>: POST, GET, OPRIONS, PATCH
            + <font style="color:#000000;background-color:#FCE75A;">Access-Control-Allow-Headers</font>: Content-Type
        * 响应 post 请求，在响应头中添加 <font style="background-color:#FCE75A;">Access-Control-Allow-Origin</font> 头
    - 如果需要附带身份信息，js 中需要在 ajax 里设置 <font style="background-color:#FCE75A;">xhr.withCredentials = true</font>
    - PATCH 方法用于对资源进行部分更新，只需要发送要更新的字段，而不需要发送整个资源
    - HEAD方法用于获取资源的元信息，类似于GET方法，但不返回实际的资源内容，只返回响应头部
+ Nginx 代理 / Node.js 代理
    - <font style="color:#000000;">前端 => 后端 => 另一个域名的后端</font>

## Session、Cookie、LocalStorage、SessionStorage 的区别
### Cookie 和 LocalStorage
+ Cookie 会被发送到服务端，LocalSotrage 不会，如果不需要发送服务端就存 LocalStorage
+ Cookie 一般最大4k，LocalStorage 5M 到 10M

### LocalStorage 和 SessionStorage
+ LocalStorage 一般不会自动过期，除非手动清除/空间占满
+ SessionStorage 在会话结束时过期，如关闭浏览器
    - 相同的 url 打开多个 tab，有各自的 SessionStorage

### Cookie 和 Session
+ cookie 存在浏览器，session 存在服务器
+ session 是基于 cookie 实现的，具体做法就是把 sessionid 下发到浏览器设为 cookie，每次请求时通 cookie 把 sessionid 带给服务器，验证身份

## JS 手写
### 手写节流 throttle、防抖 debounce
```javascript
// 节流 【技能冷却中】 在一段时间内只执行一次回调
const throttle = function (fn, delay) {
  let canUse = true
  return function () {
    if (!canUse) return
    fn.call(undifined, ...arguments)
    canUse = false
    timer = setTimeout(() => {
      canUse = true
    }, delay)
  }
}

// 防抖 【回城被打断】 在一段连续触发的事件中只执行一次回调
const debounce = function (fn, delay) {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.call(null, ...arguments)
      timer = null
    }, delay)
  }
}
```

### 手写发布订阅
+ [https://vue3js.cn/interview/design/Observer%20%20Pattern.html#%E4%BA%8C%E3%80%81%E5%8F%91%E5%B8%83%E8%AE%A2%E9%98%85%E6%A8%A1%E5%BC%8F](https://vue3js.cn/interview/design/Observer%20%20Pattern.html#%E4%BA%8C%E3%80%81%E5%8F%91%E5%B8%83%E8%AE%A2%E9%98%85%E6%A8%A1%E5%BC%8F)
+ <font style="color:#DF2A3F;">观察者</font>模式是一种对象间的依赖关系，一个对象状态改变，可以通知到依赖它的对象
    - 发布订阅和观察者区别
        * 观察者模式中，被观察者保存所有观察者的列表；发布订阅发布者和订阅者互相不知道对方存在
        * 发布订阅组件间松散耦合；观察者相反
        * 观察者大多数是同步的；发布订阅一般是异步的，使用消息队列
+ 发布订阅模式有一个事件中心，发布者和订阅者通过事件中心发布或订阅不同类别的事件，没有直接联系
+ 事件中心有订<font style="color:#DF2A3F;">阅事件的方法</font>、<font style="color:#DF2A3F;">消息发布的方法</font>、<font style="color:#DF2A3F;">取消订阅的方法</font>，和<font style="color:#DF2A3F;">一个对象存储所有订阅的事件及对应的函数数组</font>
+ 所以发布订阅模式可以细致的了解到有多少种事件类型及对应的函数，方便进一步监听控制

```javascript
class EventHub {
  // 存储所有订阅事件类型及对应的订阅函数数组
  map = {}
  // 订阅事件方法
  on(name, fn) {
    this.map[name] = this.map[name] || []
    this.map[name].push(fn)
  }
  // 消息发布方法
  emit(name, data) {
    const fnList = this.map[name] || []
    fnList.forEach((fn) => fn.call(null, data))
  }
  // 取消订阅
  off(name, fn) {
    const fnList = this.map[name] || []
    const index = fnList.indexOf(fn)
    if (index < 0) return
    fnList.splice(index, 1)
  }
}

// 使用
const e = new EventHub()
e.on('click', (name) => {
  console.log('hi' + name)
})
e.on('click', (name) => {
  console.log('hello' + name)
})
setTimeout(() => {
  e.emit('click', 'YOU')
}, 3000)
```

### 手写 AJAX
```javascript
const ajax = (method, url, success, fail) => {
  var request = new XMLHttpRequest()
  request.open(method, url)
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      if (request.status >= 200 && request.status < 300 || request.states === 304) {
        success(request)
      } else {
        fail(request)
      }
    }
  }
  request.send()
}
```

### 手写深拷贝
+ 用 JSON：

```javascript
const b = JSON.parse(JOSN.stringify(a))
```

    - 不支持 Date、正则、函数、undefined 等数据
    - 不支持引用（即环状结构）
+ 用递归
    - 递归
    - 判断类型
    - 检查环（循环引用）
    - 不拷贝原型上的属性

```javascript
function deepClone(value) {
  const cache = new Map()
  function baseClone(a) {
    if (a instanceof Object) {
      if (cache.get(a)) { return cache.get(a) }
      let result
      if (a instanceof Function) {
        if (a.prototype) {
          result = function() { return a.call(this, ...arguments) }
        } else {
          result = (...args) => { return a.call(undefined, ...args) }
        }
      } else if (a instanceof Array) {
        result = []
      } else if (a instanceof Date) {
        result = new Date(a - 0)
      } else if (a instanceof RegExp) {
        result = new RegExp(a.source, a.flags)
      } else {
        result = {}
      }
      cache.set(a, result)
      for (let key in a) {
        if (a.hasOwnProperty(key)) {
          result[key] = baseClone(a[key])
        }
      }
      return result
    } else {
      return a
    }
  }
  return baseClone(value)
}
```

```javascript
const a = {
number:1, bool:false, str: 'hi', empty1: undefined, empty2: null,
array: [
{name: 'frank', age: 18},
{name: 'jacky', age: 19}
],
date: new Date(2000,0,1,20,30,0),
regex: /\.(j|t)sx/i,
obj: { name:'frank', age: 18},
f1: (a, b) => a + b,
f2: function(a, b) { return a + b }
}
a.self = a

```

### 手写数组去重
```javascript
Array.from(new Set(arr))
[...new Set(arr)]


function uniq(arr) {
  const result = []
  arr.forEach(item => {
    if(result.indexOf(item) < 0) {
      result.push(item)
    }
  })
  return result
}

var uniq = function (a) {
  cosnt map = new Map()
  for (let i = 0; i < a.length; i++) {
    if (a[i] === undefined) { continue }
    if (map.has(a[i])) {
      continue
    }
    map.set(a[i], true)
  }
  return [...map.keys()]
}
```



## JS 基础篇
### JS 数据类型有哪些
+ 数组、函数、日期，是类（Class），不是类型

### 原型链是什么
+ 怎样创建原型链

```javascript
a = Object.create(f) // a.__proto__ === f.prototype
或
a = new F() // a.__proto__ === F.prototype
```

+ 继承是两个类之间的关系
+ let a = []; a 有 length 属性，这叫<font style="color:#DF2A3F;">实例化</font>，a 是 Array 的实例
+ a.valueOf(),  a 有 Object.prototype 上的属性，是因为 Array 继承了 Object

### 代码中的 this 是什么
+ [https://segmentfault.com/a/1190000039366823](https://segmentfault.com/a/1190000039366823)
+ 箭头函数会捕获并保持对创建它的作用域的this引用（猫的名字）

### new 做了什么
### 什么是立即执行函数
### 什么是闭包
### 如何实现类
+ 使用原型：把实例对象本身的属性写在构造函数里面，把共有属性写在构造函数原型上面
+ 使用 class：把实例对象本身的属性写在 constructor 里面，把共有属性写在 constructor 外面

### 如何实现继承
+ 使用原型

```javascript
function Super() {
  this.x = 0
  this.y = 0
}

function Sub(value) {
  //this是子类的实例，在实例上调用父类的构造函数Super，就会让子类实例具有父类实例的属性
  Super.call(this)
  this.prop = value
}
Sub.prototype = Object.create(Super.prototype)
Sub.prototype.constructor = Sub
Sub.prototype.method = function () {}
```

+ 使用 class

```javascript
class Super {
  constructor() {
    this.x = 0
    this.y = 0
  }
  method () {}
}
class Sub extends Super {
  constructor(value) {
    super() //调用父类的 constructor(x, y)，生成继承父类的 this 对象
    this.prop = value
  }
  subMehtod () {}
}
```

+ this 区别
    - 原型：实例在前，继承在后。先创造一个独立的子类实例对象，再将父类的实例方法添加到这个对象上面（先有 this，即子类实例，再在子类实例上调用父类构造函数，使子类实例有父类实例的属性和方法）
    - class：继承在前，实例在后。先将父类实例的属性和方法，加到一个空对象上面，再将该对象作为子类的实例（先调用 super() 创造 this）

## 算法
### 无重复最长子串
```javascript
// 滑动窗口法
// 两层遍历，声明变量 p1、p2，对应索引 0 和 1
// p2 逐位向后移动，这是第一层遍历
// p2 每移动一位，要跟它前面所有位对比，这是第二层遍历
// 刚开始 p1=0, p2=1, 如果没有重复，最长子串为 p2 - p1 + 1，有重复为 p2 - p1
// 遇到重复，则 p1 移动到重复位的下一位

var lengthOfLongestSubstring = function(s) {
  if (s.length <= 1 ) return s.length
  let max = 0
  let p1 = 0
  let p2 = 1
  while (p2 < s.length) {
    let sameIndex = -1
    for (let i = p1; i < p2; i++) {
      if (s[i] === s[p2]) {
        sameIndex = i
        break
      }
    }
    let tempMax = 0
    if (sameIndex >= 0) {
      tempMax = p2 - p1
      p1 = sameIndex + 1
    } else {
      tempMax = p2 - p1 + 1
    }
    if (max < tempMax) {
      max = tempMax
    }
    p2 += 1
  }
  return max
};
```

### 两数之和
```javascript
var twoSum = function(nums, target) {
    const map = {}
    for (let i = 0; i < nums.length; i++) {
        const num1 = nums[i]
        const num2 = target - nums[i]
        if (num2 in map) {
            return [map[num2], i]
        } else {
            map[num1] = i
        }
    }
};
```

### 大数相加
```javascript
const add = (a, b) => {
  const maxLength = Math.max(a.length, b.length)
  let overflow = false
  let sum = ''
  for (let i = 1; i <= maxLength; i++) {
    const ai = a[a.length - i] || '0'
    const bi = b[b.length - i] || '0'
    let ci = parseInt(ai) + parseInt(bi) + (overflow ? 1 : 0)
    overflow = ci >= 10
    ci = overflow ? ci - 10 : ci
    sum = ci + sum
  }
  sum = overflow ? '1' + sum : sum
  return sum
}
```

