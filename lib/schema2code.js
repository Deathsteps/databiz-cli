var { capitalize } = require('./utils')

function buildFlowTypes (model, listSchema, formSchema) {
  var modelProperties = []
  for (let p in listSchema.items.properties) {
    modelProperties.push(
      p + ': ' + (listSchema.items.properties.type === 'string' ? 'string' : 'number')
    )
  }
  var modelTypeStr = '{\r\n  ' + modelProperties.join(',\r\n  ') + '\r\n}'
  var modelDetailProperties = []
  for (let p in formSchema.properties) {
    modelDetailProperties.push(
      p + ': ' + (formSchema.properties.type === 'string' ? 'string' : 'number')
    )
  }
  var modelDetailTypeStr = '{\r\n  ' + modelDetailProperties.join(',\r\n  ') + '\r\n}'
  return { modelTypeStr, modelDetailTypeStr }
}

function buildTableColumns (propertiesSchema) {
  var properties = Object.keys(propertiesSchema)
  return properties.map(p => `<Column title="${capitalize(p)}" dataIndex="${p}"/>`).join('')
}

function buildFilterFieldConfig (propertiesSchema, requiredFields) {
  const fields = Object.keys(propertiesSchema).map(p => {
    const schema = propertiesSchema[p]
    let rules = []
    if (requiredFields && requiredFields.indexOf(p) > -1) {
      rules.push(`{ required: true, message: 'Please enter the ${p}' }`)
    }
    switch (schema.type) {
      case 'string':
        // TODO: deal with pattern
        // Input maxLength will be set if schema.maxLength is set
        if (schema.minLength) {
          rules.push(`{ min: ${schema.minLength}, message: 'Length of ${p} must be greater than ${schema.minLength}' }`)
        }
        break
      case 'integer':
        // InputNumber component will achieve maximum and minimum logic
        rules.push(`{ type: 'integer', message: '${p} must be ${schema.minimum === 0 ? 'a positive' : 'an'} integer' }`)
        break
      default:
        break
    }
    if (rules.length) {
      return `"${p}": { rules: [${rules.join(',')}] }`
    } else {
      return `"${p}": {}`
    }
  })
  return `{
      ${fields.join(',')}
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
  let limit = ''
  if (schema.type === 'integer' || schema.type === 'number') {
    if (typeof schema.minimum === 'number') {
      limit += `min={${schema.minimum}} `
    }
    if (typeof schema.maximum === 'number') {
      limit += `max={${schema.maximum}} `
    }
    return (
      `{getFieldDecorator('${field}', fieldsConfig['${field}'])(
        <InputNumber placeholder="${capitalize(field)}" ${limit}/>
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
    if (schema.maxLength) {
      limit = `maxLength={${schema.maxLength}} `
    }
    return (
      `{getFieldDecorator('${field}', fieldsConfig['${field}'])(
        <Input placeholder="${capitalize(field)}" ${limit}/>
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
  buildFlowTypes,
  buildTableColumns,
  buildFilterForm,
  buildFilterFieldConfig,
  buildEditFormItems,
  buildFormItem
}
