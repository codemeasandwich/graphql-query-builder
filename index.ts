namespace GraphQLQueryBuilder {
    export interface FilterMap {
      [key: string]: FilterMap | string | number
    }
    export namespace QueryDescriptor {
      export type Scalar = string
      export interface Object {
        [field: string]: QueryDescriptor
      }
      export interface Alias {
        [alias: string]: QueryDescriptor
      }

      export type Field = Scalar | Object | Alias | GraphQLQueryBuilder
    }

    type Field = QueryDescriptor.Field
    export type QueryDescriptor = Field | Field[]
}

import FilterMap = GraphQLQueryBuilder.FilterMap
import QueryDescriptor = GraphQLQueryBuilder.QueryDescriptor

  //=====================================================
  //========================================= Query Class
  //=====================================================
class GraphQLQueryBuilder {
  operationName: string
  head: Array<FilterMap | string>
  alias?: string
  body?: string

  constructor (operationName: string)
  constructor (operationName: string, filter?: FilterMap)
  constructor (operationName: string, alias?: string)
  constructor (operationName: string, alias_OR_Filter?: string | FilterMap) {
    this.operationName = operationName;
    this.head = [];

    if ("string" === typeof alias_OR_Filter) {
      this.alias = alias_OR_Filter;
    } else if ("object" === typeof alias_OR_Filter) {
      this.filter(alias_OR_Filter);
    } else if (undefined === alias_OR_Filter && 2 === arguments.length) {
      throw new TypeError("You have passed undefined as Second argument to 'Query'");
    } else if (undefined !== alias_OR_Filter) {
      throw new TypeError("Second argument to 'Query' should be an alias name(String) or filter arguments(Object). was passed " + alias_OR_Filter);
    }
  }

  find(find: QueryDescriptor) { // THIS NEED TO BE A "FUNCTION" to scope 'arguments'
    if (!find) {
      throw new TypeError("find value can not be >>falsy<<");
    }

    // if its a string.. it may have other values
    // else it sould be an Object or Array of maped values
    this.body = parceFind(Array.isArray(find) ? find : Array.from(arguments))
    return this;
  };

  setAlias(alias: string) {
    this.alias = alias;
    return this;
  }

  filter(filters: FilterMap) {
    Object.entries(filters)
      .filter(([key, prop]: [string, any]) => (
        ("function" !== typeof prop) &&
        ("{}" !== getGraphQLValue(prop))
      ))
      .map(([key, prop]: [string, any]) =>
        this.head.push(`${key}:${getGraphQLValue(prop)}`))

    return this;
  }

  toString () {
    const queryArguments = ((0 < this.head.length) ? "(" + this.head.join(",") + ")" : "")
    const alias = ((this.alias) ? (this.alias + ":") : "")

    if (undefined === this.body) {
      throw new ReferenceError("return properties are not defined. use the 'find' function to defined them");
    }

    return `${alias} ${this.operationName} ${queryArguments}  { ${this.body} }`;
  }
}

//=====================================================
//============================ parce properties to find
//=====================================================

function parceFind(level: QueryDescriptor[]) {
  //+++++++++++++++++++++++++++++++++++ work over Array
  //++++++++++++++++++++++++++++++++++++++++++++++++++++

  return level.map(currentValue => {
    if (currentValue instanceof GraphQLQueryBuilder) {
      return currentValue.toString();
    } else if (!Array.isArray(currentValue) && "object" === typeof currentValue) {
      return parseAlias(currentValue)
    } else if ("string" === typeof currentValue) {
      return currentValue;
    } else {
      throw new RangeError("cannot handle Find value of " + currentValue);
    }
  }).join(",");
}

function parseAlias (currentValue: QueryDescriptor.Alias) {
  let props = Object.keys(currentValue);
  let prop = props[0];
  let item = currentValue[prop];

  if (1 !== props.length) {
    throw new RangeError("Alias objects should only have one value. was passed: " + JSON.stringify(currentValue));
  } else if (Array.isArray(item)) {
  // contributor: https://github.com/charlierudolph/graphql-query-builder/commit/878328e857e92d140f5ba6f7cfe07837620ec490
    return new GraphQLQueryBuilder(prop).find(item)
  }
  return `${prop} : ${item} `;
}

//=====================================================
//=================================== get GraphQL Value
//=====================================================
function getGraphQLValue(value: string | number | FilterMap | Array<FilterMap>): string {
  if ("string" === typeof value) {
    return JSON.stringify(value);
  } else if (Array.isArray(value)) {
    return `[${value.map(item => getGraphQLValue(item)).join()}]`;
  } else if ("object" === typeof value) {
    return objectToString(value);
  }

  return value.toString();
}


function objectToString(obj: any): string {
  let source = Object.entries(obj)
    .filter(([key, prop]) => "function" !== typeof prop)
    .map(([key, prop]: [string, any]) => (`${key}:${getGraphQLValue(prop)}`))
    .join()
  return `{${source}}`;
}

export default GraphQLQueryBuilder
