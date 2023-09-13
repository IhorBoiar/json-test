type SchemaJSON = {
  [key: string]: any
  type: string
}

type RandomObject = {
  id: string | number
  title: string
  description: string
  startDate: number
  endDate: number
  attendees: {
    userId: number
    access: 'view' | 'modify' | 'sign' | 'execute'
    formAccess?: 'view' | 'execute' | 'execute_view'
  }[]
  parentId?: null | string | number
  locationId?: null | number
  process?: null | string
  readOnly?: boolean
  priorProbability?: null | number
  channelId?: null | number
  externalId?: null | string
  tags?: any[]
  form?: {
    id: number
    viewModel?: object
  }
  formValue?: object
}

let schema: SchemaJSON = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "attendees": {
      "type": "object",
      "$id": "#attendees",
      "properties": {
        "userId": {
          "type": "integer"
        },
        "access": {
          "enum": [
            "view",
            "modify",
            "sign",
            "execute"
          ]
        },
        "formAccess": {
          "enum": [
            "view",
            "execute",
            "execute_view"
          ]
        }
      },
      "required": [
        "userId",
        "access"
      ]
    }
  },
  "type": "object",
  "properties": {
    "id": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "integer"
        }
      ]
    },
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "startDate": {
      "type": "integer"
    },
    "endDate": {
      "type": "integer"
    },
    "attendees": {
      "type": "array",
      "items": {
        "$ref": "#attendees"
      },
      "default": []
    },
    "parentId": {
      "anyOf": [
        {
          "type": "null"
        },
        {
          "type": "string"
        },
        {
          "type": "integer"
        }
      ]
    },
    "locationId": {
      "anyOf": [
        {
          "type": "null"
        },
        {
          "type": "integer"
        }
      ]
    },
    "process": {
      "anyOf": [
        {
          "type": "null"
        },
        {
          "type": "string",
          "format": "regex",
          "pattern": "https:\\/\\/[a-z]+\\.corezoid\\.com\\/api\\/1\\/json\\/public\\/[0-9]+\\/[0-9a-zA-Z]+"
        }
      ]
    },
    "readOnly": {
      "type": "boolean"
    },
    "priorProbability": {
      "anyOf": [
        {
          "type": "null"
        },
        {
          "type": "integer",
          "minimum": 0,
          "maximum": 100
        }
      ]
    },
    "channelId": {
      "anyOf": [
        {
          "type": "null"
        },
        {
          "type": "integer"
        }
      ]
    },
    "externalId": {
      "anyOf": [
        {
          "type": "null"
        },
        {
          "type": "string"
        }
      ]
    },
    "tags": {
      "type": "array"
    },
    "form": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "viewModel": {
          "type": "object"
        }
      },
      "required": [
        "id"
      ]
    },
    "formValue": {
      "type": "object"
    }
  },
  "required": [
    "id",
    "title",
    "description",
    "startDate",
    "endDate",
    "attendees"
  ]
}

function generateRandomInt(min: number = 0, max: number = 1000): number {
  return Math.floor(Math.random() * (max - min) + min)
}

function generateRandomString(characters: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", minLenght: number = 1, maxLength: number = 10): string {
  let result: string = ''
  const length: number = generateRandomInt(minLenght, maxLength)
  for (let i = 0; i < length; i++) {
    const index: number = generateRandomInt(0, characters.length)
    result += characters.charAt(index)
  }

  return result
}

function generateRandomBoolean(): boolean {
  const variants: boolean[] = [true, false]
  const index: number = generateRandomInt(0, variants.length)

  return variants[index]
}

function generateRandomType(): string {
  const types: string[] = ['string', 'integer', 'boolean', 'null', 'object', 'array']
  const index: number = generateRandomInt(0, types.length)

  return types[index]
}

function generateRandomObject(): object {
  let result: object = {}
  const countFields: number = generateRandomInt(0, 3)
  for (let i = 0; i < countFields; i++) {
    const name: string = generateRandomString()
    result[name] = generateRandomData()
  }

  return result
}

function generateRandomArray(): any[] {
  let result = []
  const count: number = generateRandomInt(0, 3)
  for (let i = 0; i < count; i++) {
    result.push(generateRandomData())
  }

  return result
}

function generateRandomData(): any {
  const type: string = generateRandomType()
  switch (type) {
    case 'string':
      return generateRandomString()
    case 'integer':
      return generateRandomInt(0, 100)
    case 'boolean':
      return generateRandomBoolean()
    case 'null':
      return null
    case 'object':
      return generateRandomObject()
    case 'array':
      return generateRandomArray()
  }
}

function generateStringFromPattern(pattern: string): string {
  const domain: string = generateRandomString('abcdefghijklmnopqrstuvwxyz')
  const num: string = generateRandomString('0123456789')
  const alphaNum: string = generateRandomString('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

  return pattern.replace(/\\/g, '')
    .replace('[a-z]+', domain)
    .replace('[0-9]+', num)
    .replace('[0-9a-zA-Z]+', alphaNum)
}

function hasNestedProperty(obj: any, searchKey: string): any | boolean {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === searchKey) {
        return true;
      } else if (typeof obj[key] === 'object') {
        if (hasNestedProperty(obj[key], searchKey)) {
          return obj[key];
        }
      }
    }
  }
  return false;
}

function checkProperty(obj: any): any {
  switch (obj.type) {
    case 'object':
      let result: any = {}

      let refs = []
      if (obj.definitions) {
        for (const def in obj.definitions) {
          refs.push(obj.definitions[def])
        }
      }

      if (obj.properties) {
        for (const prop in obj.properties) {
          if (obj.properties.hasOwnProperty(prop)) {
            if (obj.required.find((el: string) => el === prop) || generateRandomBoolean()) {
              if (hasNestedProperty(obj.properties[prop], '$ref')) {
                for (let i = 0;i < refs.length; i++) {
                  if (refs[i].$id === hasNestedProperty(obj.properties[prop], '$ref').$ref) {
                    if (obj.properties[prop].type === 'array') {
                      obj.properties[prop].items = refs[i]
                    } else {
                      obj.properties[prop] = refs[i]
                    }
                  }
                }
              }

              result[prop] = commonObject(obj.properties[prop])
            } else {
              if (typeof obj.properties[prop].default != "undefined") {
                result[prop] = obj.properties[prop].default
              }
            }
          }
        }
      } else {
        result = generateRandomObject()
      }

      return result

    case 'string':
      if (obj.format === 'regex') {
        return generateStringFromPattern(obj.pattern)
      } else {
        return generateRandomString()
      }

    case 'integer':
      return generateRandomInt(obj.minimum, obj.maximum)

    case 'boolean':
      return generateRandomBoolean()

    case 'null':
      return null

    case 'array':
      if (obj.items) {
        let result = []
        const count: number = generateRandomInt(0, 3)
        for (let i = 0; i < count; i++) {
          result.push(commonObject(obj.items))
        }

        return result
      } else {
        return generateRandomArray()
      }
  }
}

// function that generates an object based on the given JSON schema
function commonObject(schema: SchemaJSON | any): RandomObject | any {
  if (!schema || typeof schema !== "object") {
    console.log("You are submitting incorrect data")
    return
  }

  if (schema.anyOf) {
    const index: number = generateRandomInt(0, Number(schema.anyOf.length))
    return checkProperty(schema.anyOf[index])
  }

  if (schema.enum && Array.isArray(schema.enum) && schema.enum.length > 0) {
    const index: number = Math.floor(Math.random() * schema.enum.length)
    return schema.enum[index]
  }

  return checkProperty(schema)

}

const script: RandomObject = commonObject(schema)
console.log(script, 'script')

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("schema").textContent = JSON.stringify(script, undefined, 2);
})

