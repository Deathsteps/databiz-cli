# 视图数据处理架构规范

> 该规范旨在约定一般中台系统最基本的数据表CRUD处理流程，数据字段命名等

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

* 异步动作
```
请求 [model]/[action]/request
成功 [model]/[action]/success
失败 [model]/[action]/failure
```

* 一般状态树

这里采取按页分State的方法

```
列表 [model]List
详情 [model]Detail
编辑 [model]Editor
```

* 聚合状态树

以数据列表页为例，它可能有两个基本操作：获取列表、删除某条记录。所以，该页的聚合State也应该是这两个操作的State聚合。
