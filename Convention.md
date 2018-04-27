# 视图数据处理架构规范

> 该规范旨在约定一般中台系统最基本的数据表CRUD处理流程，数据字段命名等

注：本规范聚焦Action与State, UI表现（笔者认为路由也是UI表现的一部分）不在本文档讨论范围内。

## 基本数据处理操作

#### UI交互表现

* 多条数据表现形式

  * 表格
  * 卡片
  * 树形

* 数据列表上的单条操作
  * 编辑单一字段
  * 删除某条数据

* 对一条数据的相对完整操作可表现为以下两种形式

  * Form表单页
  * Form模态窗口

* 操作通知

#### 增加(Create)

动作Payload

字段 | 类型 | 描述
----|-----|-------
info | Object | 增加的记录
relateId | ?number | 关联记录的Id，比如要给某个类型添加一条产品，这个就是类型Id

状态

状态字段 | 类型 | 描述
-------|-----|-------
info | Object | 增加的记录
creating | boolean | 增加接口请求标识
createErr | ?Error | 增加失败的错误信息
createResult | ?Object | 增加成功信息

#### 读取查询(Retrieve)

动作Payload

字段 | 类型 | 描述
----|-----|-------
pageIndex | number | 页码
pageSize | number | 每页条数
query | Object | 查询条件（搜索、筛选、排序等条件）

状态

状态字段 | 类型 | 描述
-------|-----|-------
list | ?Object[] | 数据列表
totalCount | number | 数据总条数
fetching | boolean | 数据请求标识
fetchErr | Error | 数据请求错误对象

#### 更新(Update)

动作Payload

字段 | 类型 | 描述
----|-----|-------
info | Object | 更新的记录
id | number | 记录id

状态

状态字段 | 类型 | 描述
-------|-----|-------
info | Object | 更新的记录
editing | boolean | 更新接口请求标识
editErr | ?Error | 更新失败的错误对象
editResult | ?Object | 更新成功对象

#### 删除(Delete)

动作Payload

字段 | 类型 | 描述
----|-----|-------
id | number | 记录id

状态

状态字段 | 类型 | 描述
-------|-----|-------
deleting | boolean | 删除接口请求标识
deleteErr | ?Error | 删除失败的错误信息
deleteResult | ?Object | 删除成功信息

#### 批量更新

动作Payload

字段 | 类型 | 描述
----|-----|-------
infoList | Object[] | 更新的记录列表

状态

状态字段 | 类型 | 描述
-------|-----|-------
batchEditing | boolean | 批量更新接口请求标识
batchEditErr | ?Error | 批量更新失败的错误对象
batchEditResult | ?Object | 批量更新成功对象

#### 批量删除

动作Payload

字段 | 类型 | 描述
----|-----|-------
idList | number[] | 删除的记录Id列表

状态

状态字段 | 类型 | 描述
-------|-----|-------
batchDeleting | boolean | 批量删除接口请求标识
batchDeleteErr | ?Error | 批量删除失败的错误对象
batchDeleteResult | ?Object | 批量删除成功对象


## 动作及状态树管理

#### 名称约定

model：业务实体表， action：动作

* 动作约定

一般动作是 `[model]/[action]`。一般动作之外，常见的是一种异步动作，该动作事实上是多步动作的一种特例（Task）。对此做以下约定

```
请求 [model]/[action]/request
成功 [model]/[action]/success
失败 [model]/[action]/failure
```

* 状态树约定

这里采取按视图分State的方法

```
列表 [model]List
详情 [model]Detail
编辑 [model]Editor
```

按视图分State有个大的需求，即状态树聚合。以数据列表视图为例，它可能有两个基本操作：获取列表、删除某条记录。所以，该视图的聚合State也应该是这两个操作的State聚合。（注意：由于State需要聚合，所以子操作的State在名称上需互不冲突）

视图拆分State最好的地方在，模态窗口可归类为一种视图，它本质上和一个页面没有本质区别。

* App总线动作及状态


通知操作

在App的任意位置，都可以发出通知行为，我们希望统一处理这些。所以定义


状态字段 | 类型 | 描述
-------|-----|-------
alertMessage | ?string | 通知信息
alertTitle | string | 通知标题
alertDisplayed | boolean | 是否显示通知
alertType | Enum("warning"|"error"|"info") | 通知类型


动作名 | payload
-------|---------
app/notify/show | { title: string, message: string, type: "warning"|"error"|"info" }
app/notify/hide | null


* Component动作及状态

在通用组件之外，我们往往需要有一套业务组件。该组件有两方式引入系统

  * 作为第三方组件引入
  * 放在项目某个目录中，相对路径引入

针对第二种方式，建议所有的组件以`comp[ComponentName]`作为之前约定的model。