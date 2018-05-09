var { capitalize } = require('./utils')

function buildTableColumns (propertiesSchema) {
  var properties = Object.keys(propertiesSchema)
  return properties.map(p => `<Column title="${capitalize(p)}" dataIndex="${p}"/>`).join('')
}

function buildFilterFieldConfig (propertiesSchema) {
  return `{
      ${Object.keys(propertiesSchema).map(p => `"${p}": {}`).join(',')}
    }`
}

function buildFilterForm (propertiesSchema) {
  var code = ''
  var properties = Object.keys(propertiesSchema)
  // build rows
  var ROW_START = '<Row gutter={24}>'
  var ROW_END = '</Row>'
  properties.forEach((property, i) => {
    if (i % 4 === 0) {
      if (i !== 0) {
        code += ROW_END
      }
      code += ROW_START
    }
    code +=
    `<Col md={6} sm={24}>
      <Form.Item label="${capitalize(property)}">
        ${buildFormItem(property, propertiesSchema[property])}
      </Form.Item>
    </Col>`
  })
  code =
    code +
    `<Col md={6} sm={24}>
      <Form.Item>
        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
          Search
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
          Reset
        </Button>
      </Form.Item>
    </Col>` +
    ROW_END
  return `
  <Form onSubmit={this.handleSearch} className="filter">
    ${code}
  </Form>
  `
}

function buildEditFormItems (propertiesSchema) {
  return Object.keys(propertiesSchema).map(
    p => p === 'id' ? '' // id is not editable
      : `<FormItem label="${capitalize(p)}" {...FORM_ITEM_LAYOUT}>
            ${buildFormItem(p, propertiesSchema[p])}
        </FormItem>`
  ).join('')
}

// TODO: build with uischema
function buildFormItem (field, schema) {
  if (schema.type === 'integer' || schema.type === 'number') {
    return (
      `{getFieldDecorator('${field}', fieldsConfig['${field}'])(
        <InputNumber placeholder="${capitalize(field)}" />
      )}`
    )
  } else if (schema.type === 'string' && schema.enum) {
    var options = schema.enum.map(
      (item, i) => `<Option value={${i}}>${item}</Option>`
    )
    return (
      `{getFieldDecorator('${field}', fieldsConfig['${field}'])(
        <Select placeholder="Choose One" style={{ width: '100%' }}>
          <Option value={-1}>--Choose One--</Option>
          ${options.join('')}
        </Select>
      )}`
    )
  } else {
    return (
      `{getFieldDecorator('${field}', fieldsConfig['${field}'])(
        <Input placeholder="${capitalize(field)}" />
      )}`
    )
  }
}

// TODO: Jest
// console.log(buildFormItem("id", { "type": "integer", "minimum": 0 }))
// console.log(buildFormItem("category", { "type": "string", "enum": ["Fruit", "Hardware", "Sports", "Book"] }))
// console.log(buildFormItem("name", { "type": "string" }))
// console.log(buildFilterForm({
//     "id": {
//       "type": "integer",
//       "minimum": 0
//     },
//     "category": {
//       "type": "string",
//       "enum": ["Fruit", "Hardware", "Sports", "Book"]
//     },
//     "name": {
//       "type": "string",
//     }
//   }))

module.exports = {
  buildTableColumns,
  buildFilterForm,
  buildFilterFieldConfig,
  buildEditFormItems,
  buildFormItem
}
