## 响应式
+ reactive()
    - 返回一个 proxy（对象的响应式代理）
    - 局限
        * 仅对对象类型有效，对 string、number、boolean 这样的原始类型无效
        * **vue 的响应式是通过属性访问进行追踪的**，解构、赋值或传入函数时失去响应性
+ ref()
    - 返回一个有 .value 属性的 ref 对象
    - 如果值是对象类型，会用 reactive() 自动转换 .value 属性（.value 会变成一个 proxy），可以响应式的替换整个对象
+ ref 解包
    - 在模板中作为顶层属性被访问
    - 文本插值计算的最终值
    - ref 被嵌套在响应式对象中，作为属性被访问

# Vue3 新特性
## 为什么要有组合式API
[https://cn.vuejs.org/guide/extras/composition-api-faq.html#why-composition-api](https://cn.vuejs.org/guide/extras/composition-api-faq.html#why-composition-api)

+ 更好的<font style="color:#DF2A3F;">逻辑复用</font>和<font style="color:#DF2A3F;">代码组织</font>
    - 组合式 API 通过组合函数实现逻辑复用，都是普通 js 变量和函数
    - 选项式逻辑复用主要使用 mixins，缺陷
        * 数据来源不清晰：使用多个 mixin 时，数据来自哪个 mixin 变得不清晰
        * 命名冲突：多个 mixin 可能会注册相同的属性名
        * 隐式的跨 mixin 交流：多个 mixin 隐式的耦合在一起
+ 更好的<font style="color:#DF2A3F;">类型推导</font>
    - 变量和函数本身就是类型友好的
+ 更小的生产包体积
    - <script setup> 组件模板编译为内联函数，和<script setup> 中代码同一作用域
    - 选项式 API 依赖 this 上下文对象属性，vue 实例对象
    - 本地变量名字可以被压缩，对象属性名不能

## Teleport 组件
+ <Teleport> 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去

## Fragments 片段
+ Vue3 支持多根节点的组件
+ 要显式定义 attribute 应该分布在哪里 <font style="color:rgb(137, 221, 255);background-color:rgb(41, 45, 62);"><</font><font style="color:rgb(240, 113, 120);background-color:rgb(41, 45, 62);">main </font><font style="color:rgb(199, 146, 234);background-color:rgb(41, 45, 62);">v-bind</font><font style="color:rgb(137, 221, 255);background-color:rgb(41, 45, 62);">="</font><font style="color:rgb(195, 232, 141);background-color:rgb(41, 45, 62);">$attrs</font><font style="color:rgb(137, 221, 255);background-color:rgb(41, 45, 62);">"></font><font style="color:rgb(166, 172, 205);background-color:rgb(41, 45, 62);">...</font><font style="color:rgb(137, 221, 255);background-color:rgb(41, 45, 62);"></</font><font style="color:rgb(240, 113, 120);background-color:rgb(41, 45, 62);">main</font><font style="color:rgb(137, 221, 255);background-color:rgb(41, 45, 62);">></font>

## CSS 中的 v-bind
+ 支持 javascript 表达式，包裹在引号中
+ <font style="color:rgb(178, 204, 214);background-color:rgb(36, 36, 36);">color</font><font style="color:rgb(137, 221, 255);background-color:rgb(36, 36, 36);">:</font><font style="color:rgb(166, 172, 205);background-color:rgb(36, 36, 36);"> v-bind(</font><font style="color:rgb(137, 221, 255);background-color:rgb(36, 36, 36);">'</font><font style="color:rgb(195, 232, 141);background-color:rgb(36, 36, 36);">theme.color</font><font style="color:rgb(137, 221, 255);background-color:rgb(36, 36, 36);">'</font><font style="color:rgb(166, 172, 205);background-color:rgb(36, 36, 36);">)</font>

## Emits 组件选项
+ Emits 选项会影响一个监听器被解析为<font style="color:#DF2A3F;">组件事件监听器</font>，还是<font style="color:#DF2A3F;">原生 DOM 事件监听器</font>
+ 被声明为组件事件监听器不会被透传到组件根元素上，且从组件的 $attrs 属性上移除

## SFC <style scoped> 新增全局规则和针对插槽内容的规则
+ `:deep(.foo) {}`
+ `:slotted(.foo) {}`
+ `:global(.foo) {}`

# Vue3 与 Vue2 变化
非兼容变更：[https://v3-migration.vuejs.org/zh/breaking-changes/](https://v3-migration.vuejs.org/zh/breaking-changes/)

## Vue3 性能提升通过哪几方面提升的
[https://vue3js.cn/interview/vue3/performance.html](https://vue3js.cn/interview/vue3/performance.html)

+ 响应式
    - vue2 需要深度遍历，用 defineProperty 把对象属性改为 getter、setter
    - vue3 用 proxy 对整个对象进行监听，不需要深度遍历，可以监听动态添加、删除属性，可以监听数组索引和数组 length 属性
+ 打包体积小
    - vue2 构造函数集成了所有功能
    - vue3 把这些功能作为普通函数导出，重复利用，treeshaking 优化打包体积
    - vue3移除了一些不常用的API
+ 编译阶段
    - diff 算法优化，静态标记
    - 静态提升，对不需要更新的元素，只创建一次，每次 render 时复用
    - 事件监听做缓存

## createApp() 与 new Vue()
+ Vue2 用 `new Vue()` 从同一个 Vue 构造函数创建实例，每个实例共享相同的全局配置
+ Vue3 `createApp()` 返回一个应用实例，任何改变 Vue 行为的 API 都放在实例上
+ 全局属性：`Vue.prototype` vs `app.config.globalProperties` 
+ Vue2 构造函数集成了太多功能，不利于 tree shaking；Vue3 把这些功能作为普通函数导出，充分利用 tree shaking 优化打包体积

## 移除 .native
+ Vue2 传给子组件的 v-on 事件监听器都要靠子组件内 emit 触发，想直接传给子组件根元素用 .native

```javascript
<my-component
  v-on:close="handleComponentEvent"
  v-on:click.native="handleNativeClickEvent"
/>
```

+ Vue3 需要用 emit 触发的事件需要在 emits 选项里声明，没有声明的默认 attributes 透传给子组件根元素

```javascript
<my-component
  v-on:close="handleComponentEvent"
  v-on:click="handleNativeClickEvent"
/>

// myConponent.vue
<script>
  export default {
    emits: ['close']
  }
</script>
```

## v-model
[https://v3-migration.vuejs.org/zh/breaking-changes/v-model.html](https://v3-migration.vuejs.org/zh/breaking-changes/v-model.html)

+ prop 和 事件：`value/input` → `modelValue/update:modelValue`
+ vue2 有 `v-bind.sync` 修饰符和 `model 选项`，用来改默认的 value/input；vue3 移除，在 v-model 上加参数代替
+ vue3 可以使用多个 v-model
+ vue3 可以自定义 v-model 修饰符

```vue
// Vue2 默认 value/input
<ChildComponent v-model="pageTitle" />
<ChildComponent :value="pageTitle" @input="pageTitle = $event" />

// 可用 model 选项改写默认 prop 和 event
model: {
  	prop: 'title',
    event: 'change'
}
<ChildComponent :title="pageTitle" @change="pageTitle = $event" />
```

## v-if 和 v-for 优先级
+ v-if 和 v-for 作用在同一个元素上时
    - vue2 v-for 优先级高
    - vue3 v-if 优先级高
+ 不推荐这样用，套一层标签
    - 性能问题：每次循环都进行一次if判断
    - 可读性变差：不容易理解逻辑

## v-bind 合并
+ 可以绑定 object 和 独立 attribute
+ vue2 独立 attribute 总会覆盖 object 中属性
+ vue3 绑定顺序影响结果，写在后面的覆盖前面的

```vue
<div id="red" v-bind="{ id: 'blue' }"></div>
```

## vue3 移除了 $on，$off，$once 事件 API
+ Vue2 可以用它们创建事件总线 eventBus
+ Vue3 eventBus 需要使用外部库， mitt、tiny-emitter
+ 通信
    - Props 和 事件，父子组件通信
    - provide/inject 组件间远距离通信，避免 props 逐级透传
    - provide/inject 也可以用于组件与它的插槽内容通信
    - 全局状态管理，Vuex、Pinia

## vue3 $children 移除
+ 使用模板引用访问子组件

## vue3 deep 侦听数组
+ 当侦听一个数组时，只有当数组被替换时才会触发回调。如果你需要在数组被改变时触发回调，必须指定 `deep` 选项。

# api
## setup()
```vue
import { h, ref } from 'vue'

setup(props, { attrs, slots, emit, expose }) {

  // 推荐通过 props.xxx 的形式来使用其中的 props
  // 通过 attrs.x 或 slots.x 的形式使用其中的属性
  
  // 可以返回渲染函数
  const count = ref(0)
  return () => h('div', count.value)
}
```



## 响应式 - 核心
### computed()
+ 接收 getter 函数，返回只读的 ref 对象
+ 也可以接收包含 get、set 的对象，创建可写的 ref 对象

### readyonly()
+ 接受一个对象 (不论是响应式还是普通的) 或是一个 ref，返回一个原值的只读代理（proxy）

### watchEffect()
+ 第一个参数接收一个函数
+ 立即运行函数，并响应式追踪其依赖，在依赖更新时重新执行
+ 返回函数，停止该副作用函数
+ 第二个参数接收可选选项，调整刷新时机或调试依赖。默认组件渲染之前执行
    - `flush: 'post'`
    - `flush: 'sync'`

### watch()
+ 侦听一个或多个响应式数据源，变化时调用回调函数
+ 第一个参数是数据源：响应式对象，ref对象，getter函数，它们组成的数组
+ 第二个参数是回调函数
+ 第三个参数是一个对象
    - immediate
    - deep
    - flush
    - onTrack / onTrigger
+ 与 watchEffect() 相比
    - 更明确侦听源
    - 可以懒执行
    - 回调函数可以接收新旧值
+ 侦听响应式对象时（reactive），自动 deep

## 响应式 - 工具
### isRef()
+ 检查某个值是否为 ref

### unRef()
+ 如果参数是 ref，则返回内部值，否则返回参数本身
+ `val = isRef(val) ? val.value : val`

### toValue()
+ 接收`值`、`refs`、`getter`，返回值
+ 与 unRef() 类似，区别是 getter 函数也会返回执行后的值

### toRef()
+ 接收值、refs、getters，转换为规范 refs
+ 接收 ref，原样返回
+ 接收 getter，返回只读 ref，访问时调用 getter 函数 `toRef(() => props.foo)`
+ 接收普通值，等同于 `ref()`

### toRefs()
+ 将响应式对象转为普通对象，每个属性都是源对象对应的属性用 toRef() 转换的 ref
+ 在组合式函数返回响应式对象时，用 toRefs() 转换，消费组件可以解构返回值而保持响应性
+ 只为源对象上可枚举属性创建 ref，如果为还不存在的属性，使用 toRef()

### isProxy()
+ 检查一个值是否为 reactive()、readonly()、shallowReactive()、shallowReadonly() 创建的代理

### isReactive()
+ 检查一个值是否为 reactive()、shallowReactive() 创建的代理

### isReadonly()
+ 检查传入的值是否为只读对象
+ 只读对象的属性可以改，但不能通过传入的对象直接赋值
+ computed() 没有 set 的话返回只读对象
+ readyonly()、shallowReadonly() 返回的代理是只读的，是没有 set 的 computed()
+ toRef() 转换的 getter 函数是只读的 ref

## 响应式 - 进阶
### toRaw()
+ 根据 Vue 创建的代理返回其原始对象
+ 返回由 reactive()，shallowReactive()，readonly()，shallowReadonly() 创建的代理对应的原始对象

