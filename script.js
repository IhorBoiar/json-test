var schema = {
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
};
function generateRandomInt(min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1000; }
    return Math.floor(Math.random() * (max - min) + min);
}
function generateRandomString(characters, minLenght, maxLength) {
    if (characters === void 0) { characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; }
    if (minLenght === void 0) { minLenght = 1; }
    if (maxLength === void 0) { maxLength = 10; }
    var result = '';
    var length = generateRandomInt(minLenght, maxLength);
    for (var i = 0; i < length; i++) {
        var index = generateRandomInt(0, characters.length);
        result += characters.charAt(index);
    }
    return result;
}
function generateRandomBoolean() {
    var variants = [true, false];
    var index = generateRandomInt(0, variants.length);
    return variants[index];
}
function generateRandomType() {
    var types = ['string', 'integer', 'boolean', 'null', 'object', 'array'];
    var index = generateRandomInt(0, types.length);
    return types[index];
}
function generateRandomObject() {
    var result = {};
    var countFields = generateRandomInt(0, 3);
    for (var i = 0; i < countFields; i++) {
        var name_1 = generateRandomString();
        result[name_1] = generateRandomData();
    }
    return result;
}
function generateRandomArray() {
    var result = [];
    var count = generateRandomInt(0, 3);
    for (var i = 0; i < count; i++) {
        result.push(generateRandomData());
    }
    return result;
}
function generateRandomData() {
    var type = generateRandomType();
    switch (type) {
        case 'string':
            return generateRandomString();
        case 'integer':
            return generateRandomInt(0, 100);
        case 'boolean':
            return generateRandomBoolean();
        case 'null':
            return null;
        case 'object':
            return generateRandomObject();
        case 'array':
            return generateRandomArray();
    }
}
function generateStringFromPattern(pattern) {
    var domain = generateRandomString('abcdefghijklmnopqrstuvwxyz');
    var num = generateRandomString('0123456789');
    var alphaNum = generateRandomString('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    return pattern.replace(/\\/g, '')
        .replace('[a-z]+', domain)
        .replace('[0-9]+', num)
        .replace('[0-9a-zA-Z]+', alphaNum);
}
function hasNestedProperty(obj, searchKey) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (key === searchKey) {
                return true;
            }
            else if (typeof obj[key] === 'object') {
                if (hasNestedProperty(obj[key], searchKey)) {
                    return obj[key];
                }
            }
        }
    }
    return false;
}
function checkProperty(obj) {
    switch (obj.type) {
        case 'object':
            var result = {};
            var refs = [];
            if (obj.definitions) {
                for (var def in obj.definitions) {
                    refs.push(obj.definitions[def]);
                }
            }
            if (obj.properties) {
                var _loop_1 = function (prop) {
                    if (obj.properties.hasOwnProperty(prop)) {
                        if (obj.required.find(function (el) { return el === prop; }) || generateRandomBoolean()) {
                            if (hasNestedProperty(obj.properties[prop], '$ref')) {
                                for (var i = 0; i < refs.length; i++) {
                                    if (refs[i].$id === hasNestedProperty(obj.properties[prop], '$ref').$ref) {
                                        if (obj.properties[prop].type === 'array') {
                                            obj.properties[prop].items = refs[i];
                                        }
                                        else {
                                            obj.properties[prop] = refs[i];
                                        }
                                    }
                                }
                            }
                            result[prop] = commonObject(obj.properties[prop]);
                        }
                        else {
                            if (typeof obj.properties[prop].default != "undefined") {
                                result[prop] = obj.properties[prop].default;
                            }
                        }
                    }
                };
                for (var prop in obj.properties) {
                    _loop_1(prop);
                }
            }
            else {
                result = generateRandomObject();
            }
            return result;
        case 'string':
            if (obj.format === 'regex') {
                return generateStringFromPattern(obj.pattern);
            }
            else {
                return generateRandomString();
            }
        case 'integer':
            return generateRandomInt(obj.minimum, obj.maximum);
        case 'boolean':
            return generateRandomBoolean();
        case 'null':
            return null;
        case 'array':
            if (obj.items) {
                var result_1 = [];
                var count = generateRandomInt(0, 3);
                for (var i = 0; i < count; i++) {
                    result_1.push(commonObject(obj.items));
                }
                return result_1;
            }
            else {
                return generateRandomArray();
            }
    }
}
// function that generates an object based on the given JSON schema
function commonObject(schema) {
    if (!schema || typeof schema !== "object") {
        console.log("You are submitting incorrect data");
        return;
    }
    if (schema.anyOf) {
        var index = generateRandomInt(0, Number(schema.anyOf.length));
        return checkProperty(schema.anyOf[index]);
    }
    if (schema.enum && Array.isArray(schema.enum) && schema.enum.length > 0) {
        var index = Math.floor(Math.random() * schema.enum.length);
        return schema.enum[index];
    }
    return checkProperty(schema);
}
var script = commonObject(schema);
console.log(script, 'script');
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("schema").textContent = JSON.stringify(script, undefined, 2);
});
