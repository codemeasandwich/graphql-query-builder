"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
require("babel-polyfill");
//=====================================================
//========================================= Query Class
//=====================================================
var GraphQLQueryBuilder = /** @class */function () {
    function GraphQLQueryBuilder(operationName, alias_OR_Filter) {
        this.operationName = operationName;
        this.head = [];
        if ("string" === typeof alias_OR_Filter) {
            this.alias = alias_OR_Filter;
        } else if ("object" === (typeof alias_OR_Filter === "undefined" ? "undefined" : _typeof(alias_OR_Filter))) {
            this.filter(alias_OR_Filter);
        } else if (undefined === alias_OR_Filter && 2 === arguments.length) {
            throw new TypeError("You have passed undefined as Second argument to 'Query'");
        } else if (undefined !== alias_OR_Filter) {
            throw new TypeError("Second argument to 'Query' should be an alias name(String) or filter arguments(Object). was passed " + alias_OR_Filter);
        }
    }
    GraphQLQueryBuilder.prototype.find = function (find) {
        if (!find) {
            throw new TypeError("find value can not be >>falsy<<");
        }
        // if its a string.. it may have other values
        // else it sould be an Object or Array of maped values
        this.body = parceFind(Array.isArray(find) ? find : Array.from(arguments));
        return this;
    };
    ;
    GraphQLQueryBuilder.prototype.setAlias = function (alias) {
        this.alias = alias;
        return this;
    };
    GraphQLQueryBuilder.prototype.filter = function (filters) {
        var _this = this;
        Object.entries(filters).filter(function (_a) {
            var key = _a[0],
                prop = _a[1];
            return "function" !== typeof prop && "{}" !== getGraphQLValue(prop);
        }).map(function (_a) {
            var key = _a[0],
                prop = _a[1];
            return _this.head.push(key + ":" + getGraphQLValue(prop));
        });
        return this;
    };
    GraphQLQueryBuilder.prototype.toString = function () {
        var queryArguments = 0 < this.head.length ? "(" + this.head.join(",") + ")" : "";
        var alias = this.alias ? this.alias + ":" : "";
        if (undefined === this.body) {
            throw new ReferenceError("return properties are not defined. use the 'find' function to defined them");
        }
        return alias + " " + this.operationName + " " + queryArguments + "  { " + this.body + " }";
    };
    return GraphQLQueryBuilder;
}();
//=====================================================
//============================ parce properties to find
//=====================================================
function parceFind(level) {
    //+++++++++++++++++++++++++++++++++++ work over Array
    //++++++++++++++++++++++++++++++++++++++++++++++++++++
    return level.map(function (currentValue) {
        if (currentValue instanceof GraphQLQueryBuilder) {
            return currentValue.toString();
        } else if (!Array.isArray(currentValue) && "object" === (typeof currentValue === "undefined" ? "undefined" : _typeof(currentValue))) {
            return parseAlias(currentValue);
        } else if ("string" === typeof currentValue) {
            return currentValue;
        } else {
            throw new RangeError("cannot handle Find value of " + currentValue);
        }
    }).join(",");
}
function parseAlias(currentValue) {
    var props = Object.keys(currentValue);
    var prop = props[0];
    var item = currentValue[prop];
    if (1 !== props.length) {
        throw new RangeError("Alias objects should only have one value. was passed: " + JSON.stringify(currentValue));
    } else if (Array.isArray(item)) {
        // contributor: https://github.com/charlierudolph/graphql-query-builder/commit/878328e857e92d140f5ba6f7cfe07837620ec490
        return new GraphQLQueryBuilder(prop).find(item);
    }
    return prop + " : " + item + " ";
}
//=====================================================
//=================================== get GraphQL Value
//=====================================================
function getGraphQLValue(value) {
    if ("string" === typeof value) {
        return JSON.stringify(value);
    } else if (Array.isArray(value)) {
        return "[" + value.map(function (item) {
            return getGraphQLValue(item);
        }).join() + "]";
    } else if ("object" === (typeof value === "undefined" ? "undefined" : _typeof(value))) {
        return objectToString(value);
    }
    return value.toString();
}
function objectToString(obj) {
    var source = Object.entries(obj).filter(function (_a) {
        var key = _a[0],
            prop = _a[1];
        return "function" !== typeof prop;
    }).map(function (_a) {
        var key = _a[0],
            prop = _a[1];
        return key + ":" + getGraphQLValue(prop);
    }).join();
    return "{" + source + "}";
}
exports.default = GraphQLQueryBuilder;