# module.exports vs exports in Node.js

- module.exports 和 exports 初始指向同一个空对象
- 导出的模块是module.exports
- exports.a = 1 给对象上加属性，可以输出；modules.exports.b = 2 同理
- exports = {}， exports指向新的对象，与modules.exports失去关联，不会导出，导出的仍然是modules.exports所指的对象
- modules.exports = {}， modules.exports指向新对象也会使两者失去关联，再给exports加属性不影响导出模块