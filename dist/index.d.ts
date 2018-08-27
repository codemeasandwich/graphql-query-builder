declare namespace GraphQLQueryBuilder {
    interface FilterMap {
        [key: string]: FilterMap | string | number;
    }
    namespace QueryDescriptor {
        type Scalar = string;
        interface Object {
            [field: string]: QueryDescriptor;
        }
        interface Alias {
            [alias: string]: QueryDescriptor;
        }
        type Field = Scalar | Object | Alias | GraphQLQueryBuilder;
    }
    type Field = QueryDescriptor.Field;
    type QueryDescriptor = Field | Field[];
}
import FilterMap = GraphQLQueryBuilder.FilterMap;
import QueryDescriptor = GraphQLQueryBuilder.QueryDescriptor;
declare class GraphQLQueryBuilder {
    operationName: string;
    head: Array<FilterMap | string>;
    alias?: string;
    body?: string;
    constructor(operationName: string);
    constructor(operationName: string, filter?: FilterMap);
    constructor(operationName: string, alias?: string);
    find(find: QueryDescriptor): this;
    setAlias(alias: string): this;
    filter(filters: FilterMap): this;
    toString(): string;
}
export default GraphQLQueryBuilder;
