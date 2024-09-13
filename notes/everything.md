- 黎民百姓
  - 黄河中下游两岸三大农耕部落联盟：黄帝，炎帝，蚩尤
  - 黄帝先打败炎帝，形成华夏族的雏形，我们因此自称“炎黄子孙”
  - 黄帝后击杀蚩尤，蚩尤部落部分归入华夏族
  - 蚩尤领导的部落联盟叫“九黎”（九个部落的合称），所以子民叫“黎民”，炎黄的部落更先进，子民有自己的姓，所以叫“百姓”，“黎民百姓”就这么来的

- 分支提交到新的远程仓库
  ```
  //报错 已有关联的远程仓库
  fatal: remote origin already exists. 

  // 删除关联的origin的远程库
  git remote rm origin
  ```

- 马太效应
  - 《马太福音》：凡有的，还要加给他，叫他有余；凡没有的，连他所有的也要夺去。
  - 《道德经》：天之道，损有余而补不足。人之道，则不然，损不足而奉有余。
  - 简言之，就是“赢者全拿”。

- elementui 中 el-button 点击后按钮颜色保持 focus 状态不恢复
  ```
  // html <button /> onmousedown的默认策略鼠标按下后处于 focus 状态，也就是看上去没有恢复成原来的颜色（此时是focus样式被激活）。
  @mousedown="e => e.preventDefault()"
  ```

- css终于支持垂直居中命令了
  ```css
  align-content: center;
  ```

- 100M宽带传输速度为什么达不到100MB/s
  - 100M宽带的传输速度达不到100MB/s是因为“100M”宽带的“M”代表的是Megabits（兆比特，Mb），而不是Megabytes（兆字节，MB）
    - 100M宽带通常指的是100 Mbps（兆比特每秒）。这个“b”是指bits（比特）
    - MB/s是兆字节每秒。这个“B”是指Bytes（字节）
    - 由于1字节（Byte）等于8比特（bits），因此在将 Mbps 转换为 MB/s 时，需要除以8
    - 所以，100 Mbps 的宽带在理想情况下的最大传输速度是 12.5 MB/s，而不是 100 MB/s
  - 单位
    - MB/s (Megabytes per second): 1 MB (Megabyte) = (10^6) bytes = 1,000,000 bytes
    - Mib/s (Mebibits per second): 1 Mib (Mebibit) = (2^{20}) bits = 1,048,576 bits
  
- 虚与委蛇
  - `xū yǔ wēi yí`

- 合法JSON
  - JavaScript Object Notation，是一种用于数据交换的文本格式
  - 格式
    - 复合类型只能是普通对象或数组，不能是函数、正则、日期
    - 原始类型只有四种：字符串，数值（十进制），布尔值，null（不能使用undefined，NaN，Infinity）
    - 字符串必须使用双引号
    - 对象键名必须使用双引号
    - 数组或对象最后一个成员后面，不能加逗号
  - null、空数组、空对象都是合法的 JSON

- respective
  - respective adj.分别的，各自的
  - respect n.尊敬
  - expective adj.期待的

- present
  - represent v.代表，表示；象征，体现；展示；等于，相当于
  - present v.提出，介绍

- 埋怨
  - mán yuàn

- git配置http代理
  ```
  git config --global http.proxy 127.0.0.1:7899
  git config --global https.proxy 127.0.0.1:7899

  注意按自己的端口port修改 
  ```
