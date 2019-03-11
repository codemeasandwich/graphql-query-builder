/* eslint-disable require-jsdoc, yoda, no-use-before-define */
const MSG = {
    INVALID_SECOND_ARG: 'Second argument to should be an alias name(String) or filter arguments(Object). Instead: ',
    UNDEFINED_SECOND_ARG: 'You have passed undefined as Second argument to \'Query\'',
    INVALID_ALIAS: 'Alias objects should only have one value. Instead: ',
    MISSING_RETURN_PROPERTIES: 'return properties are not defined. use the \'select\' function to defined them',
    INVALID_SELECT: 'Cannot handle select value of ',
    FALSY_SELECT: 'select value can not be >>falsy<<'
};

class Query {
    constructor(field, fieldAlias_OR_args) {

        this.field = field;
        this.args = [];

        if ('string' === typeof fieldAlias_OR_args) {
            this.fieldAlias = fieldAlias_OR_args;
        } else if ('object' === typeof fieldAlias_OR_args) {
            this.filter(fieldAlias_OR_args);
        } else if (undefined !== fieldAlias_OR_args) {
            throw new TypeError(MSG.INVALID_SECOND_ARG + fieldAlias_OR_args);
        }
    }

    /**
     * Provide arguments to the Query or Mutation
     * @param {object} args
     * @return {Query}
     */
    filter(args) {

        Object.keys(args).forEach((filterKey) => {
            if ('function' === typeof args[filterKey]) {
                return;
            }
            const filterValue = this._getGraphQLValue(args[filterKey]);
            if ('{}' === filterValue) {
                return;
            }
            this.args.push(`${filterKey}:${filterValue}`);
        });

        return this;
    }

    /**
     * get GraphQL Value
     * @param {string|Array<String>|object} value
     * @return {string}
     * @private
     */
    _getGraphQLValue(value) {
        let graphQLValue;
        if ('string' === typeof value) {
            graphQLValue = JSON.stringify(value);
        } else if (Array.isArray(value)) {
            graphQLValue = value.map((item) => {
                return this._getGraphQLValue(item);
            }).join();
            graphQLValue = `[${graphQLValue}]`;
        } else if ('object' === typeof value) {
            graphQLValue = this._objectToString(value);
        } else {
            graphQLValue = value;
        }
        return graphQLValue;
    }

    /**
     * @param {object} obj
     * @return {string}
     * @private
     */
    _objectToString(obj) {

        const sourceA = [];

        Object.keys(obj).forEach((key) => {
            if ('function' === typeof obj[key]) {
                return;
            }
            sourceA.push(`${key}:${this._getGraphQLValue(obj[key])}`);
        });
        return `{${sourceA.join()}}`;
    }

    setAlias(_fieldAlias) {
        this.fieldAlias = _fieldAlias;
        return this;
    }

    /**
     * Select the values that you would like returned in the response from the server
     * @param {Array<string|object>} selectionFields
     * @return {Query}
     */
    select(selectionFields) {
        if (!selectionFields) {
            throw new TypeError(MSG.FALSY_SELECT);
        }
        // If its a string, then it may have other values
        // else it should be an Object or Array of mapped values
        const selectionArray = Array.isArray(selectionFields) ? selectionFields : Array.from(arguments);
        this.selectionFields = this._parseSelection(selectionArray);
        return this;
    }

    find(selectionFields) {
        return this.select(selectionFields);
    }

    /**
     * parse properties to find
     * @param {Array} selectionFields
     * @return {string}
     * @private
     */
    _parseSelection(selectionFields) {

        const selection = selectionFields.map(function(returnProperty) {
            if (returnProperty instanceof Query) {
                return returnProperty.toString();
            } else if (!Array.isArray(returnProperty) && 'object' === typeof returnProperty) {
                const filterKeysA = Object.keys(returnProperty);
                if (1 !== filterKeysA.length) {
                    throw new RangeError(MSG.INVALID_ALIAS + JSON.stringify(returnProperty));
                }
                const filterKey = filterKeysA[0];
                const item = returnProperty[filterKey];
                if (Array.isArray(item)) {
                    return new Nested(filterKey).select(item);
                }
                return `${filterKey} : ${item} `;
            } else if ('string' === typeof returnProperty) {
                return returnProperty;
            } else {
                throw new RangeError(MSG.INVALID_SELECT + returnProperty);
            }
        });

        return selection.join(',');
    }

    /**
     * @return {string}
     * @private
     */
    _baseToString() {
        const fieldAlias = this.fieldAlias ? this.fieldAlias + ':' : '';
        const args = 0 < this.args.length ? '(' + this.args.join(',') + ')' : '';
        const selection = this.selectionFields ? '{' + this.selectionFields + '}' : '';
        return `${fieldAlias} ${this.field} ${args} ${selection}`;
    }

    toString() {
        if (undefined === this.selectionFields) {
            throw new ReferenceError(MSG.MISSING_RETURN_PROPERTIES);
        }
        return `query {${this._baseToString()}}`;
    }
}

class Mutation extends Query {
    toString() {
        return `mutation {${this._baseToString()}}`;
    }
}
class Nested extends Query {
    toString() {
        return this._baseToString();
    }
}

module.exports = {
    Query,
    Mutation,
    Nested
};
