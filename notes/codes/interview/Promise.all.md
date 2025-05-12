我来详细讲解这三个 Promise 组合方法：

### 1. Promise.all
`Promise.all` 接收一个 Promise 数组，当所有 Promise 都成功时返回所有结果的数组，如果任何一个 Promise 失败则立即返回第一个失败的错误。

```javascript
// 示例1：所有Promise都成功
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.resolve(3);

Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log(results); // [1, 2, 3]
  });

// 示例2：其中一个Promise失败
const promise1 = Promise.resolve(1);
const promise2 = Promise.reject('Error');
const promise3 = Promise.resolve(3);

Promise.all([promise1, promise2, promise3])
  .catch(error => {
    console.log(error); // 'Error'
  });
```

使用场景：
- 并行请求多个接口数据
- 需要等待多个异步操作都完成
```javascript
// 实际应用示例
async function fetchUserData(userId) {
  const [userInfo, userPosts, userSettings] = await Promise.all([
    fetch(`/api/users/${userId}`),
    fetch(`/api/users/${userId}/posts`),
    fetch(`/api/users/${userId}/settings`)
  ]);
  return { userInfo, userPosts, userSettings };
}
```

### 2. Promise.race
`Promise.race` 接收一个 Promise 数组，返回第一个完成的 Promise 的结果（无论成功或失败）。

```javascript
// 示例1：第一个Promise先完成
const promise1 = new Promise(resolve => setTimeout(() => resolve(1), 1000));
const promise2 = new Promise(resolve => setTimeout(() => resolve(2), 500));

Promise.race([promise1, promise2])
  .then(result => {
    console.log(result); // 2
  });

// 示例2：第一个Promise失败
const promise1 = new Promise((resolve, reject) => 
  setTimeout(() => reject('Error'), 500));
const promise2 = new Promise(resolve => 
  setTimeout(() => resolve(2), 1000));

Promise.race([promise1, promise2])
  .catch(error => {
    console.log(error); // 'Error'
  });
```

使用场景：
- 超时处理
- 竞态条件处理
```javascript
// 实际应用示例：请求超时处理
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}
```

### 3. Promise.allSettled
`Promise.allSettled` 接收一个 Promise 数组，等待所有 Promise 完成（无论成功或失败），返回一个包含所有 Promise 结果的对象数组。

```javascript
// 示例：混合成功和失败的情况
const promise1 = Promise.resolve(1);
const promise2 = Promise.reject('Error');
const promise3 = Promise.resolve(3);

Promise.allSettled([promise1, promise2, promise3])
  .then(results => {
    console.log(results);
    // [
    //   { status: 'fulfilled', value: 1 },
    //   { status: 'rejected', reason: 'Error' },
    //   { status: 'fulfilled', value: 3 }
    // ]
  });
```

使用场景：
- 需要处理多个可能失败的异步操作
- 需要知道每个 Promise 的具体结果
```javascript
// 实际应用示例：批量处理数据
async function processItems(items) {
  const results = await Promise.allSettled(
    items.map(item => processItem(item))
  );
  
  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
    
  const failed = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);
    
  return { successful, failed };
}
```

### 比较总结：

1. `Promise.all`:
   - 所有 Promise 成功才成功
   - 一个失败就失败
   - 适合需要所有结果都成功的场景

2. `Promise.race`:
   - 返回第一个完成的 Promise
   - 不关心其他 Promise 的结果
   - 适合竞态或超时场景

3. `Promise.allSettled`:
   - 等待所有 Promise 完成
   - 返回所有结果（成功和失败）
   - 适合需要处理部分失败的情况

### 实际应用建议：

1. 使用 `Promise.all` 当：
   - 需要并行执行多个操作
   - 所有操作都必须成功
   - 需要等待所有操作完成

2. 使用 `Promise.race` 当：
   - 需要实现超时机制
   - 只需要第一个完成的结果
   - 处理竞态条件

3. 使用 `Promise.allSettled` 当：
   - 需要处理部分失败的情况
   - 需要知道每个操作的具体结果
   - 不想因为单个失败而中断整个流程
