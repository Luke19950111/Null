## watch computed methods
computed是计算属性，watch是侦听器；

computed是依赖其他属性计算所得出最后的值；

watch是去监听一个值得变化，然后去执行对应的函数；

如果一个值依赖多个属性（多对一），computed更好；

如果一个值变化会引起一系列变化（一对多），或者在数据变化时要执行异步或开销较大的操作，watch更合适；

watch的回调里会传入监听属性的新旧值，可以做一些特定的操作；computed就是简单的计算。



<font style="color:#24292E;background-color:#F8F8F8;">computed 和 methods 相比，最大区别是 computed 有缓存：如果 computed 属性依赖的属性没有变化，那么 computed 属性就不会重新计算。methods 则是每次重新渲染时，都会再次调用方法，执行函数。</font>

<font style="color:#24292E;background-color:#F8F8F8;"></font>

## vue有哪些生命周期钩子函数，分别有什么用
+ beforeCreate 组件创建之初，组件属性生效之前，data和methods中的数据还没有初始化
+ created 组件完全创建，可以操作data、调用methods中方法，但真实DOM还没有生成
+ beforeMount 在挂载之前被调用，模板已经在内存中渲染好，但是尚未挂载到页面中
+ mounted 内存中渲染好的模板，真实的替换到浏览器页面，可以操作页面DOM节点了
+ beforeUpdate 组件数据更新之前调用，页面中显示的数据还是旧的，data中的数据是新的
+ updated 组件数据更新之后，页面和data数据已保持同步
+ beforeDestroy 组件销毁前调用，组件实例仍完全可用
+ destroyed 组件销毁后调用，组件已完全销毁，所有数据、方法、指令等都已不可用





![](https://cdn.nlark.com/yuque/0/2020/png/1622085/1597370802066-59b68cf8-d6d2-4d64-9a54-2802d7419942.png)



[https://www.cxymsg.com/guide/vue.html#%E4%BD%A0%E5%AF%B9mvvm%E7%9A%84%E7%90%86%E8%A7%A3](https://www.cxymsg.com/guide/vue.html#%E4%BD%A0%E5%AF%B9mvvm%E7%9A%84%E7%90%86%E8%A7%A3)

![](https://cdn.nlark.com/yuque/0/2020/png/1622085/1597368904932-403be81d-58cc-4585-90b8-8e4da22baf80.png)



[https://cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA](https://cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA) 红字

翻译

在mounted发请求



[http://doc.liangxinghua.com/vue-family/1.3.html](http://doc.liangxinghua.com/vue-family/1.3.html)



## 组件通信
+ 父子组件 $emit('xxx', data)  $on('xxx', function(){})
+ 爷孙组件，兄弟组件

```javascript
var eventBus = new Vue()
eventBus.$emit()
eventBus.$on()
```

+ props
+ provide/inject
+ Vuex



## Vuex怎么用
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。

+ 创建store实例，里面有state，getter, mutation，action等；
+ Vuex通过store选项，把状态从根组件注入到每一个子组件中；
+ 与普通全局对象区别
    - 状态存储是响应式的
    - 不能直接改变 state，要提交 mutation



state

+ state是存储在vuex中的数据，类似vue实例中的data;
+ 子组件获取store中状态的方法：在计算属性中返回某个状态。



getter

+ 从state中派生出的一些状态，类似vue实例中的计算属性，getter的返回值会根据它的依赖缓存；
+ getter接收state作为第一个参数，也可以接收其他getters作为第二个参数；
+ 在计算属性中使用；通过方法访问（无缓存）。



mutation

+ mutation 非常类似于事件：每个mutation都有一个事件类型和一个回调函数；
+ 更改store中状态的唯一方法是提交mutation： store.commit('xxx');
+ mutation必须是同步函数。



action

+ action 类似于 mutation：action 提交 mutation，而不是直接变更状态；action 可以包含任意异步操作；
+ action 函数接收一个 context对象，与store实例有相同的属性和方法；
+ 通过 store.dispatch 触发；
+ 组合 actions：store.dispatch 可以处理触发的 action 返回的 promise，并且仍旧返回 promise。

```javascript
actions: {
	increment(context){
  	context.commit('increment')
  }
}

store.dispatch('increment')
```

模块化

+ 对于模块内的 getters，mutations，接收的第一个参数是模块内的 state
+ 对于 getters ，rootState 作为第三个参数，rootGetters 作为第四个参数；四个参数分别为** (state, getters, rootState, rootGetters)**
+ 对于 actions，**context.rootState** 获取根节点状态，**context.rootGetters** 根节点 getters
+ **namespace: true**，开启模块命名空间，getters、mutations、actions 路径拼接
+ getters 和 actions 收到局部化的 getters 和 dispatch、commit，使用时不需要拼路径
+ 在模块内触发全局 dispatch('someOtherAction', null, **{ root: true }**) 

## Vue数据响应式怎么做到的
+ 普通js对象作为data选项传入Vue实例，Vue遍历此对象，并使用 Object.defineProperty 将对象的所有属性转为 getter/setter；
+ 每个实例组件有个 watcher 实例，把所有数据记为依赖，依赖的setter触发时通知 watcher，重新渲染组件。
+ Vue不能检测对象属性的添加或移除，要手动调用 Vue.set(object, propertyName,value) 或 this.$set() 向嵌套对象添加响应式属性；
+ 不允许动态添加根级别的响应式property。



![](https://cdn.nlark.com/yuque/0/2020/png/1622085/1602732497892-062962ff-3fe3-455d-8d92-ee5db26c00a6.png)



+ 普通对象传给vue ,vue会用 `Object.defineProperty` 给对象属性添加 `getter`、`setter`
    - observe() => new Observer() => defineReactive() 循环调用形成递归
+ 每个组件有对应的 `Watcher实例`，这些实例会在 `getter` 里被收集为依赖，在 `setter` 触发时遍历依赖列表更新依赖
    - dep.depend()
    - dep.notify() => watcher update() 执行传入watcher的回调函数



## Vue.set 用法
```javascript
var vm = new Vue({
  data:{
    a:1
  }
})
Vue.set(vm.someObject, 'b', 2)
this.$set(this.someObject, 'b', 2)
this.someObject = Object.assign({}, this.someObject, {a: 1, b: 2})
```

```javascript
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
// vm.items[indexOfItem] = newValue // 不是响应式的
Vue.set(vm.items, indexOfItem, newValue)
vm.$set(vm.items, indexOfItem, newValue)
vm.items.splice(indexOfItem, 1, newValue)

// vm.items.length = 2 // 不是响应式的
vm.items.splice(newLength)
```



## VueRouter 怎么用
+ Vue Router 是 Vue.js 官方的路由管理器。
+ 使用 router-link 组件导航，匹配到的组件渲染到 router-view 里

```html
<p>
  <!-- 使用 router-link 组件来导航. -->
  <!-- 通过传入 `to` 属性指定链接. -->
  <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
  <router-link to="/foo">Go to Foo</router-link>
  <router-link to="/bar">Go to Bar</router-link>
</p>
<!-- 路由出口 -->
<!-- 路由匹配到的组件将渲染在这里 -->
<router-view></router-view>
```

+ 注入路由器，可以在任何组件通过 this.$router 访问路由器，也可以通过 this.$route 访问当前路由

```javascript
// 定义路由
const routes = [
  {path: '/foo', component: Foo},
  {path: '/bar', component: Bar}
]
// 创建 router 实例
const router = new VueRouter({
	routes
})
// 注入路由
const app = new Vue({
	router
}).$mount('#app')
```

+ 动态路由匹配，使用 <font style="color:#F5222D;">动态路径参数</font>，用冒号 <font style="color:#F5222D;">:</font> 匹配，参数值设置到 <font style="color:#F5222D;">this.$route.params</font>

```javascript
routes: [
  {path: '/user/:id'}
]
{{$route.params.id}}
```

+ 使用路由参数，组件实例被复用，生命周期钩子不会再调用，想对路由参数做响应，watch 或 导航守卫

```javascript
watch: {
	$route(to, from){
  	// 对路由变化响应
  }
}

beforeRouteUpdate(to, from, next){
}
```

+ 匹配任意路由，用<font style="color:#F5222D;">通配符*</font>，通常用于404错误，使用通配符，$route.params内添加 <font style="color:#F5222D;">pathMatch</font> 参数
+ 嵌套路由 path component children，以 / 开头的嵌套路径被当做根路径（使用嵌套组件而不必使用嵌套的url）
+ router.push() 会向 history 栈添加新纪录
+ router.replace() 不会添加记录
+ router.push() 和 router.replace() 返回 Promise
+ router.go(n) 在 history 记录中前进或后退多少步
+ 命名路由，命名视图 router 和 router-view 给 name
+ 重定向 <font style="color:#F5222D;">{path: '/a', redirect: '/b'} </font> redirect 也可以是命名路由或方法（返回目标）；导航守卫只应用在目标上，没有应用在中间跳转路由上
+ 别名 <font style="color:#F5222D;">{path: '/a', component: A, alias: '/b'}</font>  url显示b，路由匹配为a
+ 路由组件传参，**props: true**，使路由参数变为组件内 props，不再需要使用 this.$route.params
+ History模式：history.pushState API，需要服务器配置，匹配不到的资源都指向同一个 html，注意这样服务端不会再响应 404，前端需要做好 404路由；hash模式，用URL 的hash模拟，有#
+ 路由懒加载：使用**动态导入**，component 配置使用一个**返回 promise 的函数**，只有第一次进入这个页面的时候才会获取函数，然后缓存数据

```javascript
const Foo = () => import('./Foo.vue')

const router = new VueRouter({
	routes: [
    {path: '/foo', component: Foo}
  ]
})
```

+ 注册路由器插件 ![](https://cdn.nlark.com/yuque/0/2024/png/1622085/1716434184066-db2e8184-8888-4a01-9cfa-4ff1b00f0d8c.png)



**<font style="color:#DF2A3F;">路由对象的children里的内容渲染在该路由对象的component的router-view里</font>**

```javascript
routes: [
    {
        path: '/',
        component: () => import('@/layout'),
        children: [
            {
                path: '/a',
                component: () => import('@/a.vue')
            },
            {
                path: '/b',
                component: () => import('@/b.vue')
            }
        ]
    }
]

// layout.vue
<template>
    <side-bar></side-bar>
    <router-view></router-view>
</template>
```



```javascript
const router = new Router({
  routes: [
    {
      path: '/',
      components: { // 命名视图
        sidebar: () => import('@/components/sidebar.vue'),
        content: () => import('@/components/content.vue')
      },
      children: [ // 渲染在 content.vue 里的 <router-view /> 里
        {
          path: 'page1',
          component: () => import('@/views/page1.vue')
        },
        {
          path: 'page2',
          components: () => import('@/views/page2.vue')
        }
      ]
    }
  ]
})

// App.vue
<template>
  <div class="app">
    <router-view name="sidebar"></router-view>
    <router-view name="content"></router-view>
  </div>
</template>

// content.vue
<template>
  <router-view />
</template>
```

### 前端路由
+ 前端路由根据实现方式，可以分为 hash 和 history 两种
+ hash 路由
    - 通过监听 hashchange 事件，通过解析 hash 的值来切换页面内容
    - 优点：无需服务端配置；兼容性最佳
    - 缺点：服务端无法获取 hash 部分内容；可能和锚点功能冲突；SEO 不友好
+ history 路由
    - 通过浏览器原生提供的 history api 实现路由功能
    - history.pushState、history.replaceState 改记录，popstate 事件监听历史记录变化
    - 优点：服务端可以获取完整的链接和参数；SEO 相对 hash 友好
    - 缺点：需要服务端额外配置（各 path 均指向同一个 html）；兼容性较弱
    - **服务器加一个简单的回退路由，如果 URL 不匹配任何静态资源，它应提供与 index.html 相同的页面**
+ 前端路由优缺点
    - 优点：无刷新切换页面内容，体验好，基于此可以做 spa 单页应用；减轻服务器压力
    - 缺点：初次加载耗时长；SEO 不友好





## 导航守卫
<font style="color:#F5222D;">导航</font>表示路由正在发生改变。

+ 全局前置守卫

```javascript
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})

// next() 进行下一个钩子
// next('/') 当前导航中断，进行一个新的导航
// next(false) 当前导航中断，地址重置到 from 对应地址
// next(error) 参数是个Error实例，导航终止且错误传递给router.onError()
```

+ 全局解析守卫 <font style="color:#F5222D;">router.beforeResolve</font>  在<font style="color:#F5222D;">所有组件内守卫和异步路由组件</font>被解析之后调用
+ 全局后置钩子 不接受 next 函数， 也不会改变导航

```javascript
router.afterEach((to, from) => {
  // ...
})
```

+ 路由独享守卫  在路由配置上定义 beforeEnter 守卫

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

+ 组件内守卫 在组件内定义守卫 

```javascript
beforeRouteEnter 不能获取this，可以给next传回调,组件实例作为回调参数 next(vm => {})
beforeRouteUpdate 路由改变，但是组件复用
beforeRouteLeave 用户未保存离开时提示，可以通过 next(false) 取消

const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
```

+ 完整导航解析流程

```javascript
1. 导航被触发
2. 在失活组件里调用 beforeRouteLeave 守卫
3. 调用全局 beforeEach 守卫
4. 在重用组件里调用 beforeRouteUpeate 守卫
5. 在路由配置里调用 beforeEnter 守卫
6. 解析异步路由组件
7. 在被激活的组件里调用 beforeRouteEnter 守卫
8. 调用全局的 beforeResolve 守卫
9. 导航被确认
10. 调用全局的 afterEach 钩子
11. 触发 DOM 更新
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入
```

## mixin
+ created、mounted等生命周期中的方法，mixin里先执行，组件内后执行
    - ![](https://cdn.nlark.com/yuque/0/2023/png/1622085/1690454110445-ea4b00a6-70fc-4eab-b0aa-ae8036a044a2.png)
+ data 组件覆盖 mixins
+ methods 中同名方法，组件覆盖 mixins

## vue 相关优化
+ 优化列表渲染，列表使用 key，尽可能重用已经存在的 dom 节点
+ 使用计算属性 computed，有缓存
+ 频繁切换显示隐藏，v-show 代替 v-if
+ 使用 keep-alive 缓存组件
+ 路由组件懒加载

## 自定义指令
[https://v3-migration.vuejs.org/zh/breaking-changes/custom-directives.html](https://v3-migration.vuejs.org/zh/breaking-changes/custom-directives.html)

[https://v2.cn.vuejs.org/v2/guide/custom-directive.html](https://v2.cn.vuejs.org/v2/guide/custom-directive.html)

[https://cn.vuejs.org/guide/reusability/custom-directives.html#directive-hooks](https://cn.vuejs.org/guide/reusability/custom-directives.html#directive-hooks)



是vue框架提供的一种机制，可以直接在DOM元素上应用自定义行为。

作用就是重用对dom元素的一些操作。

视图和逻辑分离，复用性和可维护性更好。



+ Vue2 钩子函数
    - bind - 指令绑定到元素，只调用一次
    - inserted - 元素插入父DOM后调用
    - update - 元素更新，子元素尚未更新
    - componentUpdate - 组件和子级都被更新
    - unbind - 指令被移除
+ Vue3 钩子函数，和生命周期钩子一样
    - created
    - beforeMount
    - mounted
    - beforeUpdate
    - updated
    - beforeUnmount
    - unmounted
+ 钩子函数参数
    - el
    - binding - value，oldValue，arg(参数)，modifiers(包含修饰符的对象)
    - vnode
    - oldVnode

```javascript
Vue.directive('permission', {
  bind() {},
  inserted(el, binding) {},
  update() {},
  componentUpdated() {},
  unbind() {}
})

const app = Vue.createApp({})
app.directive('permission', {
  created(el, binding, vnode, prevVnode) {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeUnmount() {},
  unmounted() {}
})
```

## 常见修饰符
vue修饰符是一种用来改变指令行为的标记。



v-model 内置修饰符

+ `.lazy`  input触发更新改为change触发
+ `.number` paseFloat() 处理，无法处理返回原值
+ `.trim`

事件修饰符

+ `.stop` 停止传播
+ `.prevent` 阻止默认事件
+ `.self` event.target 是元素本身才会触发
+ .capture 捕获阶段触发
+ .once 只调用一次
+ .passive 永远不会调用 preventDefault()，不要和.prevent一起使用

按键修饰符

+ `@keyup.enter`
+ .tab
+ .delete
+ .space
+ .up
+ .down
+ .left
+ .right
+ .ctrl
+ .alt
+ .shift
+ .meta windows/command

鼠标按键修饰符

+ .left
+ .right
+ .middle

vue3已移除

+ `.sync` 实现双向绑定，将子组件变化同步到父组件
+ `.native` 监听组件根元素原生事件，而不是组件内部的自定义事件





## 对vue的理解
+ vue 是一个创建用户界面的 javascript 框架，常用于创建 spa 单页应用
+ 核心特性是数据驱动，也就是 MVVM，不再直接操作dom，而是通过修改数据，自动体现在视图上
    - model 是模型层，处理逻辑和服务器交互
    - view 是视图层，可以简单理解为 html 页面
    - viewmodel 用来连接 model 和 view
+ 组件化
    - 可以把一部分视图、数据抽离成一个组件，组合复用，快速实现需求
    - 页面各模块间耦合度降低
    - 便于调试，快速定位报错
    - 易维护
+ 指令系统
    - 重用涉及普通元素底层 DOM 访问的逻辑

