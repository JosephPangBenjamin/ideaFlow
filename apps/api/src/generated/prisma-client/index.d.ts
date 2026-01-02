
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Idea
 * 
 */
export type Idea = $Result.DefaultSelection<Prisma.$IdeaPayload>
/**
 * Model Task
 * 
 */
export type Task = $Result.DefaultSelection<Prisma.$TaskPayload>
/**
 * Model Canvas
 * 
 */
export type Canvas = $Result.DefaultSelection<Prisma.$CanvasPayload>
/**
 * Model CanvasNode
 * 
 */
export type CanvasNode = $Result.DefaultSelection<Prisma.$CanvasNodePayload>
/**
 * Model CanvasConnection
 * 
 */
export type CanvasConnection = $Result.DefaultSelection<Prisma.$CanvasConnectionPayload>
/**
 * Model AnalyticsEvent
 * 
 */
export type AnalyticsEvent = $Result.DefaultSelection<Prisma.$AnalyticsEventPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TaskStatus: {
  todo: 'todo',
  in_progress: 'in_progress',
  done: 'done'
};

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

}

export type TaskStatus = $Enums.TaskStatus

export const TaskStatus: typeof $Enums.TaskStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.idea`: Exposes CRUD operations for the **Idea** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ideas
    * const ideas = await prisma.idea.findMany()
    * ```
    */
  get idea(): Prisma.IdeaDelegate<ExtArgs>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **Task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.TaskDelegate<ExtArgs>;

  /**
   * `prisma.canvas`: Exposes CRUD operations for the **Canvas** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Canvas
    * const canvas = await prisma.canvas.findMany()
    * ```
    */
  get canvas(): Prisma.CanvasDelegate<ExtArgs>;

  /**
   * `prisma.canvasNode`: Exposes CRUD operations for the **CanvasNode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CanvasNodes
    * const canvasNodes = await prisma.canvasNode.findMany()
    * ```
    */
  get canvasNode(): Prisma.CanvasNodeDelegate<ExtArgs>;

  /**
   * `prisma.canvasConnection`: Exposes CRUD operations for the **CanvasConnection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CanvasConnections
    * const canvasConnections = await prisma.canvasConnection.findMany()
    * ```
    */
  get canvasConnection(): Prisma.CanvasConnectionDelegate<ExtArgs>;

  /**
   * `prisma.analyticsEvent`: Exposes CRUD operations for the **AnalyticsEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnalyticsEvents
    * const analyticsEvents = await prisma.analyticsEvent.findMany()
    * ```
    */
  get analyticsEvent(): Prisma.AnalyticsEventDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Idea: 'Idea',
    Task: 'Task',
    Canvas: 'Canvas',
    CanvasNode: 'CanvasNode',
    CanvasConnection: 'CanvasConnection',
    AnalyticsEvent: 'AnalyticsEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "idea" | "task" | "canvas" | "canvasNode" | "canvasConnection" | "analyticsEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Idea: {
        payload: Prisma.$IdeaPayload<ExtArgs>
        fields: Prisma.IdeaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IdeaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdeaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IdeaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdeaPayload>
          }
          findFirst: {
            args: Prisma.IdeaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdeaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IdeaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdeaPayload>
          }
          findMany: {
            args: Prisma.IdeaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdeaPayload>[]
          }
          create: {
            args: Prisma.IdeaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdeaPayload>
          }
          createMany: {
            args: Prisma.IdeaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IdeaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdeaPayload>[]
          }
          delete: {
            args: Prisma.IdeaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdeaPayload>
          }
          update: {
            args: Prisma.IdeaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdeaPayload>
          }
          deleteMany: {
            args: Prisma.IdeaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IdeaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.IdeaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdeaPayload>
          }
          aggregate: {
            args: Prisma.IdeaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIdea>
          }
          groupBy: {
            args: Prisma.IdeaGroupByArgs<ExtArgs>
            result: $Utils.Optional<IdeaGroupByOutputType>[]
          }
          count: {
            args: Prisma.IdeaCountArgs<ExtArgs>
            result: $Utils.Optional<IdeaCountAggregateOutputType> | number
          }
        }
      }
      Task: {
        payload: Prisma.$TaskPayload<ExtArgs>
        fields: Prisma.TaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findFirst: {
            args: Prisma.TaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findMany: {
            args: Prisma.TaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          create: {
            args: Prisma.TaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          createMany: {
            args: Prisma.TaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          delete: {
            args: Prisma.TaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          update: {
            args: Prisma.TaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          deleteMany: {
            args: Prisma.TaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          aggregate: {
            args: Prisma.TaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTask>
          }
          groupBy: {
            args: Prisma.TaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCountAggregateOutputType> | number
          }
        }
      }
      Canvas: {
        payload: Prisma.$CanvasPayload<ExtArgs>
        fields: Prisma.CanvasFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CanvasFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CanvasFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>
          }
          findFirst: {
            args: Prisma.CanvasFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CanvasFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>
          }
          findMany: {
            args: Prisma.CanvasFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>[]
          }
          create: {
            args: Prisma.CanvasCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>
          }
          createMany: {
            args: Prisma.CanvasCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CanvasCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>[]
          }
          delete: {
            args: Prisma.CanvasDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>
          }
          update: {
            args: Prisma.CanvasUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>
          }
          deleteMany: {
            args: Prisma.CanvasDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CanvasUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CanvasUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasPayload>
          }
          aggregate: {
            args: Prisma.CanvasAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCanvas>
          }
          groupBy: {
            args: Prisma.CanvasGroupByArgs<ExtArgs>
            result: $Utils.Optional<CanvasGroupByOutputType>[]
          }
          count: {
            args: Prisma.CanvasCountArgs<ExtArgs>
            result: $Utils.Optional<CanvasCountAggregateOutputType> | number
          }
        }
      }
      CanvasNode: {
        payload: Prisma.$CanvasNodePayload<ExtArgs>
        fields: Prisma.CanvasNodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CanvasNodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasNodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CanvasNodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasNodePayload>
          }
          findFirst: {
            args: Prisma.CanvasNodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasNodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CanvasNodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasNodePayload>
          }
          findMany: {
            args: Prisma.CanvasNodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasNodePayload>[]
          }
          create: {
            args: Prisma.CanvasNodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasNodePayload>
          }
          createMany: {
            args: Prisma.CanvasNodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CanvasNodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasNodePayload>[]
          }
          delete: {
            args: Prisma.CanvasNodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasNodePayload>
          }
          update: {
            args: Prisma.CanvasNodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasNodePayload>
          }
          deleteMany: {
            args: Prisma.CanvasNodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CanvasNodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CanvasNodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasNodePayload>
          }
          aggregate: {
            args: Prisma.CanvasNodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCanvasNode>
          }
          groupBy: {
            args: Prisma.CanvasNodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<CanvasNodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.CanvasNodeCountArgs<ExtArgs>
            result: $Utils.Optional<CanvasNodeCountAggregateOutputType> | number
          }
        }
      }
      CanvasConnection: {
        payload: Prisma.$CanvasConnectionPayload<ExtArgs>
        fields: Prisma.CanvasConnectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CanvasConnectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasConnectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CanvasConnectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasConnectionPayload>
          }
          findFirst: {
            args: Prisma.CanvasConnectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasConnectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CanvasConnectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasConnectionPayload>
          }
          findMany: {
            args: Prisma.CanvasConnectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasConnectionPayload>[]
          }
          create: {
            args: Prisma.CanvasConnectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasConnectionPayload>
          }
          createMany: {
            args: Prisma.CanvasConnectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CanvasConnectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasConnectionPayload>[]
          }
          delete: {
            args: Prisma.CanvasConnectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasConnectionPayload>
          }
          update: {
            args: Prisma.CanvasConnectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasConnectionPayload>
          }
          deleteMany: {
            args: Prisma.CanvasConnectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CanvasConnectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CanvasConnectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanvasConnectionPayload>
          }
          aggregate: {
            args: Prisma.CanvasConnectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCanvasConnection>
          }
          groupBy: {
            args: Prisma.CanvasConnectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CanvasConnectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CanvasConnectionCountArgs<ExtArgs>
            result: $Utils.Optional<CanvasConnectionCountAggregateOutputType> | number
          }
        }
      }
      AnalyticsEvent: {
        payload: Prisma.$AnalyticsEventPayload<ExtArgs>
        fields: Prisma.AnalyticsEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalyticsEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalyticsEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>
          }
          findFirst: {
            args: Prisma.AnalyticsEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalyticsEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>
          }
          findMany: {
            args: Prisma.AnalyticsEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>[]
          }
          create: {
            args: Prisma.AnalyticsEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>
          }
          createMany: {
            args: Prisma.AnalyticsEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnalyticsEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>[]
          }
          delete: {
            args: Prisma.AnalyticsEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>
          }
          update: {
            args: Prisma.AnalyticsEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>
          }
          deleteMany: {
            args: Prisma.AnalyticsEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalyticsEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AnalyticsEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>
          }
          aggregate: {
            args: Prisma.AnalyticsEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalyticsEvent>
          }
          groupBy: {
            args: Prisma.AnalyticsEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalyticsEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnalyticsEventCountArgs<ExtArgs>
            result: $Utils.Optional<AnalyticsEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    ideas: number
    tasks: number
    canvases: number
    analyticsEvents: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ideas?: boolean | UserCountOutputTypeCountIdeasArgs
    tasks?: boolean | UserCountOutputTypeCountTasksArgs
    canvases?: boolean | UserCountOutputTypeCountCanvasesArgs
    analyticsEvents?: boolean | UserCountOutputTypeCountAnalyticsEventsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountIdeasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IdeaWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCanvasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanvasWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAnalyticsEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalyticsEventWhereInput
  }


  /**
   * Count Type IdeaCountOutputType
   */

  export type IdeaCountOutputType = {
    tasks: number
    nodes: number
  }

  export type IdeaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | IdeaCountOutputTypeCountTasksArgs
    nodes?: boolean | IdeaCountOutputTypeCountNodesArgs
  }

  // Custom InputTypes
  /**
   * IdeaCountOutputType without action
   */
  export type IdeaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdeaCountOutputType
     */
    select?: IdeaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * IdeaCountOutputType without action
   */
  export type IdeaCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * IdeaCountOutputType without action
   */
  export type IdeaCountOutputTypeCountNodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanvasNodeWhereInput
  }


  /**
   * Count Type CanvasCountOutputType
   */

  export type CanvasCountOutputType = {
    nodes: number
    connections: number
  }

  export type CanvasCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    nodes?: boolean | CanvasCountOutputTypeCountNodesArgs
    connections?: boolean | CanvasCountOutputTypeCountConnectionsArgs
  }

  // Custom InputTypes
  /**
   * CanvasCountOutputType without action
   */
  export type CanvasCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasCountOutputType
     */
    select?: CanvasCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CanvasCountOutputType without action
   */
  export type CanvasCountOutputTypeCountNodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanvasNodeWhereInput
  }

  /**
   * CanvasCountOutputType without action
   */
  export type CanvasCountOutputTypeCountConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanvasConnectionWhereInput
  }


  /**
   * Count Type CanvasNodeCountOutputType
   */

  export type CanvasNodeCountOutputType = {
    fromConnections: number
    toConnections: number
  }

  export type CanvasNodeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fromConnections?: boolean | CanvasNodeCountOutputTypeCountFromConnectionsArgs
    toConnections?: boolean | CanvasNodeCountOutputTypeCountToConnectionsArgs
  }

  // Custom InputTypes
  /**
   * CanvasNodeCountOutputType without action
   */
  export type CanvasNodeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasNodeCountOutputType
     */
    select?: CanvasNodeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CanvasNodeCountOutputType without action
   */
  export type CanvasNodeCountOutputTypeCountFromConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanvasConnectionWhereInput
  }

  /**
   * CanvasNodeCountOutputType without action
   */
  export type CanvasNodeCountOutputTypeCountToConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanvasConnectionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    phone: string | null
    password: string | null
    nickname: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    phone: string | null
    password: string | null
    nickname: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    phone: number
    password: number
    nickname: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    phone?: true
    password?: true
    nickname?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    phone?: true
    password?: true
    nickname?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    phone?: true
    password?: true
    nickname?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    phone: string | null
    password: string
    nickname: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    phone?: boolean
    password?: boolean
    nickname?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ideas?: boolean | User$ideasArgs<ExtArgs>
    tasks?: boolean | User$tasksArgs<ExtArgs>
    canvases?: boolean | User$canvasesArgs<ExtArgs>
    analyticsEvents?: boolean | User$analyticsEventsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    phone?: boolean
    password?: boolean
    nickname?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    phone?: boolean
    password?: boolean
    nickname?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ideas?: boolean | User$ideasArgs<ExtArgs>
    tasks?: boolean | User$tasksArgs<ExtArgs>
    canvases?: boolean | User$canvasesArgs<ExtArgs>
    analyticsEvents?: boolean | User$analyticsEventsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      ideas: Prisma.$IdeaPayload<ExtArgs>[]
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      canvases: Prisma.$CanvasPayload<ExtArgs>[]
      analyticsEvents: Prisma.$AnalyticsEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      phone: string | null
      password: string
      nickname: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ideas<T extends User$ideasArgs<ExtArgs> = {}>(args?: Subset<T, User$ideasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdeaPayload<ExtArgs>, T, "findMany"> | Null>
    tasks<T extends User$tasksArgs<ExtArgs> = {}>(args?: Subset<T, User$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    canvases<T extends User$canvasesArgs<ExtArgs> = {}>(args?: Subset<T, User$canvasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findMany"> | Null>
    analyticsEvents<T extends User$analyticsEventsArgs<ExtArgs> = {}>(args?: Subset<T, User$analyticsEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly nickname: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.ideas
   */
  export type User$ideasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Idea
     */
    select?: IdeaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdeaInclude<ExtArgs> | null
    where?: IdeaWhereInput
    orderBy?: IdeaOrderByWithRelationInput | IdeaOrderByWithRelationInput[]
    cursor?: IdeaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IdeaScalarFieldEnum | IdeaScalarFieldEnum[]
  }

  /**
   * User.tasks
   */
  export type User$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * User.canvases
   */
  export type User$canvasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    where?: CanvasWhereInput
    orderBy?: CanvasOrderByWithRelationInput | CanvasOrderByWithRelationInput[]
    cursor?: CanvasWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CanvasScalarFieldEnum | CanvasScalarFieldEnum[]
  }

  /**
   * User.analyticsEvents
   */
  export type User$analyticsEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    where?: AnalyticsEventWhereInput
    orderBy?: AnalyticsEventOrderByWithRelationInput | AnalyticsEventOrderByWithRelationInput[]
    cursor?: AnalyticsEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnalyticsEventScalarFieldEnum | AnalyticsEventScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Idea
   */

  export type AggregateIdea = {
    _count: IdeaCountAggregateOutputType | null
    _min: IdeaMinAggregateOutputType | null
    _max: IdeaMaxAggregateOutputType | null
  }

  export type IdeaMinAggregateOutputType = {
    id: string | null
    content: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type IdeaMaxAggregateOutputType = {
    id: string | null
    content: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type IdeaCountAggregateOutputType = {
    id: number
    content: number
    source: number
    userId: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type IdeaMinAggregateInputType = {
    id?: true
    content?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type IdeaMaxAggregateInputType = {
    id?: true
    content?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type IdeaCountAggregateInputType = {
    id?: true
    content?: true
    source?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type IdeaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Idea to aggregate.
     */
    where?: IdeaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ideas to fetch.
     */
    orderBy?: IdeaOrderByWithRelationInput | IdeaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IdeaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ideas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ideas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ideas
    **/
    _count?: true | IdeaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IdeaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IdeaMaxAggregateInputType
  }

  export type GetIdeaAggregateType<T extends IdeaAggregateArgs> = {
        [P in keyof T & keyof AggregateIdea]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIdea[P]>
      : GetScalarType<T[P], AggregateIdea[P]>
  }




  export type IdeaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IdeaWhereInput
    orderBy?: IdeaOrderByWithAggregationInput | IdeaOrderByWithAggregationInput[]
    by: IdeaScalarFieldEnum[] | IdeaScalarFieldEnum
    having?: IdeaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IdeaCountAggregateInputType | true
    _min?: IdeaMinAggregateInputType
    _max?: IdeaMaxAggregateInputType
  }

  export type IdeaGroupByOutputType = {
    id: string
    content: string
    source: JsonValue | null
    userId: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: IdeaCountAggregateOutputType | null
    _min: IdeaMinAggregateOutputType | null
    _max: IdeaMaxAggregateOutputType | null
  }

  type GetIdeaGroupByPayload<T extends IdeaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IdeaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IdeaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IdeaGroupByOutputType[P]>
            : GetScalarType<T[P], IdeaGroupByOutputType[P]>
        }
      >
    >


  export type IdeaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    source?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    tasks?: boolean | Idea$tasksArgs<ExtArgs>
    nodes?: boolean | Idea$nodesArgs<ExtArgs>
    _count?: boolean | IdeaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["idea"]>

  export type IdeaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    source?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["idea"]>

  export type IdeaSelectScalar = {
    id?: boolean
    content?: boolean
    source?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type IdeaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    tasks?: boolean | Idea$tasksArgs<ExtArgs>
    nodes?: boolean | Idea$nodesArgs<ExtArgs>
    _count?: boolean | IdeaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type IdeaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $IdeaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Idea"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      nodes: Prisma.$CanvasNodePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      source: Prisma.JsonValue | null
      userId: string
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["idea"]>
    composites: {}
  }

  type IdeaGetPayload<S extends boolean | null | undefined | IdeaDefaultArgs> = $Result.GetResult<Prisma.$IdeaPayload, S>

  type IdeaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<IdeaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: IdeaCountAggregateInputType | true
    }

  export interface IdeaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Idea'], meta: { name: 'Idea' } }
    /**
     * Find zero or one Idea that matches the filter.
     * @param {IdeaFindUniqueArgs} args - Arguments to find a Idea
     * @example
     * // Get one Idea
     * const idea = await prisma.idea.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IdeaFindUniqueArgs>(args: SelectSubset<T, IdeaFindUniqueArgs<ExtArgs>>): Prisma__IdeaClient<$Result.GetResult<Prisma.$IdeaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Idea that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {IdeaFindUniqueOrThrowArgs} args - Arguments to find a Idea
     * @example
     * // Get one Idea
     * const idea = await prisma.idea.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IdeaFindUniqueOrThrowArgs>(args: SelectSubset<T, IdeaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IdeaClient<$Result.GetResult<Prisma.$IdeaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Idea that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdeaFindFirstArgs} args - Arguments to find a Idea
     * @example
     * // Get one Idea
     * const idea = await prisma.idea.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IdeaFindFirstArgs>(args?: SelectSubset<T, IdeaFindFirstArgs<ExtArgs>>): Prisma__IdeaClient<$Result.GetResult<Prisma.$IdeaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Idea that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdeaFindFirstOrThrowArgs} args - Arguments to find a Idea
     * @example
     * // Get one Idea
     * const idea = await prisma.idea.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IdeaFindFirstOrThrowArgs>(args?: SelectSubset<T, IdeaFindFirstOrThrowArgs<ExtArgs>>): Prisma__IdeaClient<$Result.GetResult<Prisma.$IdeaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Ideas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdeaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ideas
     * const ideas = await prisma.idea.findMany()
     * 
     * // Get first 10 Ideas
     * const ideas = await prisma.idea.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ideaWithIdOnly = await prisma.idea.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IdeaFindManyArgs>(args?: SelectSubset<T, IdeaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdeaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Idea.
     * @param {IdeaCreateArgs} args - Arguments to create a Idea.
     * @example
     * // Create one Idea
     * const Idea = await prisma.idea.create({
     *   data: {
     *     // ... data to create a Idea
     *   }
     * })
     * 
     */
    create<T extends IdeaCreateArgs>(args: SelectSubset<T, IdeaCreateArgs<ExtArgs>>): Prisma__IdeaClient<$Result.GetResult<Prisma.$IdeaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Ideas.
     * @param {IdeaCreateManyArgs} args - Arguments to create many Ideas.
     * @example
     * // Create many Ideas
     * const idea = await prisma.idea.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IdeaCreateManyArgs>(args?: SelectSubset<T, IdeaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ideas and returns the data saved in the database.
     * @param {IdeaCreateManyAndReturnArgs} args - Arguments to create many Ideas.
     * @example
     * // Create many Ideas
     * const idea = await prisma.idea.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ideas and only return the `id`
     * const ideaWithIdOnly = await prisma.idea.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IdeaCreateManyAndReturnArgs>(args?: SelectSubset<T, IdeaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdeaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Idea.
     * @param {IdeaDeleteArgs} args - Arguments to delete one Idea.
     * @example
     * // Delete one Idea
     * const Idea = await prisma.idea.delete({
     *   where: {
     *     // ... filter to delete one Idea
     *   }
     * })
     * 
     */
    delete<T extends IdeaDeleteArgs>(args: SelectSubset<T, IdeaDeleteArgs<ExtArgs>>): Prisma__IdeaClient<$Result.GetResult<Prisma.$IdeaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Idea.
     * @param {IdeaUpdateArgs} args - Arguments to update one Idea.
     * @example
     * // Update one Idea
     * const idea = await prisma.idea.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IdeaUpdateArgs>(args: SelectSubset<T, IdeaUpdateArgs<ExtArgs>>): Prisma__IdeaClient<$Result.GetResult<Prisma.$IdeaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Ideas.
     * @param {IdeaDeleteManyArgs} args - Arguments to filter Ideas to delete.
     * @example
     * // Delete a few Ideas
     * const { count } = await prisma.idea.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IdeaDeleteManyArgs>(args?: SelectSubset<T, IdeaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ideas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdeaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ideas
     * const idea = await prisma.idea.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IdeaUpdateManyArgs>(args: SelectSubset<T, IdeaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Idea.
     * @param {IdeaUpsertArgs} args - Arguments to update or create a Idea.
     * @example
     * // Update or create a Idea
     * const idea = await prisma.idea.upsert({
     *   create: {
     *     // ... data to create a Idea
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Idea we want to update
     *   }
     * })
     */
    upsert<T extends IdeaUpsertArgs>(args: SelectSubset<T, IdeaUpsertArgs<ExtArgs>>): Prisma__IdeaClient<$Result.GetResult<Prisma.$IdeaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Ideas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdeaCountArgs} args - Arguments to filter Ideas to count.
     * @example
     * // Count the number of Ideas
     * const count = await prisma.idea.count({
     *   where: {
     *     // ... the filter for the Ideas we want to count
     *   }
     * })
    **/
    count<T extends IdeaCountArgs>(
      args?: Subset<T, IdeaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IdeaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Idea.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdeaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IdeaAggregateArgs>(args: Subset<T, IdeaAggregateArgs>): Prisma.PrismaPromise<GetIdeaAggregateType<T>>

    /**
     * Group by Idea.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdeaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IdeaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IdeaGroupByArgs['orderBy'] }
        : { orderBy?: IdeaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IdeaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIdeaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Idea model
   */
  readonly fields: IdeaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Idea.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IdeaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    tasks<T extends Idea$tasksArgs<ExtArgs> = {}>(args?: Subset<T, Idea$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    nodes<T extends Idea$nodesArgs<ExtArgs> = {}>(args?: Subset<T, Idea$nodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasNodePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Idea model
   */ 
  interface IdeaFieldRefs {
    readonly id: FieldRef<"Idea", 'String'>
    readonly content: FieldRef<"Idea", 'String'>
    readonly source: FieldRef<"Idea", 'Json'>
    readonly userId: FieldRef<"Idea", 'String'>
    readonly createdAt: FieldRef<"Idea", 'DateTime'>
    readonly updatedAt: FieldRef<"Idea", 'DateTime'>
    readonly deletedAt: FieldRef<"Idea", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Idea findUnique
   */
  export type IdeaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Idea
     */
    select?: IdeaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdeaInclude<ExtArgs> | null
    /**
     * Filter, which Idea to fetch.
     */
    where: IdeaWhereUniqueInput
  }

  /**
   * Idea findUniqueOrThrow
   */
  export type IdeaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Idea
     */
    select?: IdeaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdeaInclude<ExtArgs> | null
    /**
     * Filter, which Idea to fetch.
     */
    where: IdeaWhereUniqueInput
  }

  /**
   * Idea findFirst
   */
  export type IdeaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Idea
     */
    select?: IdeaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdeaInclude<ExtArgs> | null
    /**
     * Filter, which Idea to fetch.
     */
    where?: IdeaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ideas to fetch.
     */
    orderBy?: IdeaOrderByWithRelationInput | IdeaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ideas.
     */
    cursor?: IdeaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ideas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ideas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ideas.
     */
    distinct?: IdeaScalarFieldEnum | IdeaScalarFieldEnum[]
  }

  /**
   * Idea findFirstOrThrow
   */
  export type IdeaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Idea
     */
    select?: IdeaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdeaInclude<ExtArgs> | null
    /**
     * Filter, which Idea to fetch.
     */
    where?: IdeaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ideas to fetch.
     */
    orderBy?: IdeaOrderByWithRelationInput | IdeaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ideas.
     */
    cursor?: IdeaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ideas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ideas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ideas.
     */
    distinct?: IdeaScalarFieldEnum | IdeaScalarFieldEnum[]
  }

  /**
   * Idea findMany
   */
  export type IdeaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Idea
     */
    select?: IdeaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdeaInclude<ExtArgs> | null
    /**
     * Filter, which Ideas to fetch.
     */
    where?: IdeaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ideas to fetch.
     */
    orderBy?: IdeaOrderByWithRelationInput | IdeaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ideas.
     */
    cursor?: IdeaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ideas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ideas.
     */
    skip?: number
    distinct?: IdeaScalarFieldEnum | IdeaScalarFieldEnum[]
  }

  /**
   * Idea create
   */
  export type IdeaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Idea
     */
    select?: IdeaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdeaInclude<ExtArgs> | null
    /**
     * The data needed to create a Idea.
     */
    data: XOR<IdeaCreateInput, IdeaUncheckedCreateInput>
  }

  /**
   * Idea createMany
   */
  export type IdeaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ideas.
     */
    data: IdeaCreateManyInput | IdeaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Idea createManyAndReturn
   */
  export type IdeaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Idea
     */
    select?: IdeaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Ideas.
     */
    data: IdeaCreateManyInput | IdeaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdeaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Idea update
   */
  export type IdeaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Idea
     */
    select?: IdeaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdeaInclude<ExtArgs> | null
    /**
     * The data needed to update a Idea.
     */
    data: XOR<IdeaUpdateInput, IdeaUncheckedUpdateInput>
    /**
     * Choose, which Idea to update.
     */
    where: IdeaWhereUniqueInput
  }

  /**
   * Idea updateMany
   */
  export type IdeaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ideas.
     */
    data: XOR<IdeaUpdateManyMutationInput, IdeaUncheckedUpdateManyInput>
    /**
     * Filter which Ideas to update
     */
    where?: IdeaWhereInput
  }

  /**
   * Idea upsert
   */
  export type IdeaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Idea
     */
    select?: IdeaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdeaInclude<ExtArgs> | null
    /**
     * The filter to search for the Idea to update in case it exists.
     */
    where: IdeaWhereUniqueInput
    /**
     * In case the Idea found by the `where` argument doesn't exist, create a new Idea with this data.
     */
    create: XOR<IdeaCreateInput, IdeaUncheckedCreateInput>
    /**
     * In case the Idea was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IdeaUpdateInput, IdeaUncheckedUpdateInput>
  }

  /**
   * Idea delete
   */
  export type IdeaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Idea
     */
    select?: IdeaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdeaInclude<ExtArgs> | null
    /**
     * Filter which Idea to delete.
     */
    where: IdeaWhereUniqueInput
  }

  /**
   * Idea deleteMany
   */
  export type IdeaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ideas to delete
     */
    where?: IdeaWhereInput
  }

  /**
   * Idea.tasks
   */
  export type Idea$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Idea.nodes
   */
  export type Idea$nodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasNode
     */
    select?: CanvasNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasNodeInclude<ExtArgs> | null
    where?: CanvasNodeWhereInput
    orderBy?: CanvasNodeOrderByWithRelationInput | CanvasNodeOrderByWithRelationInput[]
    cursor?: CanvasNodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CanvasNodeScalarFieldEnum | CanvasNodeScalarFieldEnum[]
  }

  /**
   * Idea without action
   */
  export type IdeaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Idea
     */
    select?: IdeaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdeaInclude<ExtArgs> | null
  }


  /**
   * Model Task
   */

  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    status: $Enums.TaskStatus | null
    category: string | null
    dueDate: Date | null
    ideaId: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type TaskMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    status: $Enums.TaskStatus | null
    category: string | null
    dueDate: Date | null
    ideaId: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    title: number
    description: number
    status: number
    category: number
    dueDate: number
    ideaId: number
    userId: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type TaskMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    category?: true
    dueDate?: true
    ideaId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    category?: true
    dueDate?: true
    ideaId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    category?: true
    dueDate?: true
    ideaId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type TaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Task to aggregate.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type TaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithAggregationInput | TaskOrderByWithAggregationInput[]
    by: TaskScalarFieldEnum[] | TaskScalarFieldEnum
    having?: TaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }

  export type TaskGroupByOutputType = {
    id: string
    title: string
    description: string | null
    status: $Enums.TaskStatus
    category: string | null
    dueDate: Date | null
    ideaId: string | null
    userId: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: TaskCountAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type TaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    category?: boolean
    dueDate?: boolean
    ideaId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    idea?: boolean | Task$ideaArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    category?: boolean
    dueDate?: boolean
    ideaId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    idea?: boolean | Task$ideaArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    category?: boolean
    dueDate?: boolean
    ideaId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type TaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    idea?: boolean | Task$ideaArgs<ExtArgs>
  }
  export type TaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    idea?: boolean | Task$ideaArgs<ExtArgs>
  }

  export type $TaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Task"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      idea: Prisma.$IdeaPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      status: $Enums.TaskStatus
      category: string | null
      dueDate: Date | null
      ideaId: string | null
      userId: string
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["task"]>
    composites: {}
  }

  type TaskGetPayload<S extends boolean | null | undefined | TaskDefaultArgs> = $Result.GetResult<Prisma.$TaskPayload, S>

  type TaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TaskFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface TaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Task'], meta: { name: 'Task' } }
    /**
     * Find zero or one Task that matches the filter.
     * @param {TaskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskFindUniqueArgs>(args: SelectSubset<T, TaskFindUniqueArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Task that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TaskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskFindFirstArgs>(args?: SelectSubset<T, TaskFindFirstArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Task that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskFindManyArgs>(args?: SelectSubset<T, TaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Task.
     * @param {TaskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
     */
    create<T extends TaskCreateArgs>(args: SelectSubset<T, TaskCreateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Tasks.
     * @param {TaskCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskCreateManyArgs>(args?: SelectSubset<T, TaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tasks and returns the data saved in the database.
     * @param {TaskCreateManyAndReturnArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Task.
     * @param {TaskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
     */
    delete<T extends TaskDeleteArgs>(args: SelectSubset<T, TaskDeleteArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Task.
     * @param {TaskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskUpdateArgs>(args: SelectSubset<T, TaskUpdateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Tasks.
     * @param {TaskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskDeleteManyArgs>(args?: SelectSubset<T, TaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskUpdateManyArgs>(args: SelectSubset<T, TaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Task.
     * @param {TaskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
     */
    upsert<T extends TaskUpsertArgs>(args: SelectSubset<T, TaskUpsertArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends TaskCountArgs>(
      args?: Subset<T, TaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskGroupByArgs['orderBy'] }
        : { orderBy?: TaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Task model
   */
  readonly fields: TaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    idea<T extends Task$ideaArgs<ExtArgs> = {}>(args?: Subset<T, Task$ideaArgs<ExtArgs>>): Prisma__IdeaClient<$Result.GetResult<Prisma.$IdeaPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Task model
   */ 
  interface TaskFieldRefs {
    readonly id: FieldRef<"Task", 'String'>
    readonly title: FieldRef<"Task", 'String'>
    readonly description: FieldRef<"Task", 'String'>
    readonly status: FieldRef<"Task", 'TaskStatus'>
    readonly category: FieldRef<"Task", 'String'>
    readonly dueDate: FieldRef<"Task", 'DateTime'>
    readonly ideaId: FieldRef<"Task", 'String'>
    readonly userId: FieldRef<"Task", 'String'>
    readonly createdAt: FieldRef<"Task", 'DateTime'>
    readonly updatedAt: FieldRef<"Task", 'DateTime'>
    readonly deletedAt: FieldRef<"Task", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Task findUnique
   */
  export type TaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findUniqueOrThrow
   */
  export type TaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findFirst
   */
  export type TaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findFirstOrThrow
   */
  export type TaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findMany
   */
  export type TaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Tasks to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task create
   */
  export type TaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to create a Task.
     */
    data: XOR<TaskCreateInput, TaskUncheckedCreateInput>
  }

  /**
   * Task createMany
   */
  export type TaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Task createManyAndReturn
   */
  export type TaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task update
   */
  export type TaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to update a Task.
     */
    data: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
    /**
     * Choose, which Task to update.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task updateMany
   */
  export type TaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
  }

  /**
   * Task upsert
   */
  export type TaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The filter to search for the Task to update in case it exists.
     */
    where: TaskWhereUniqueInput
    /**
     * In case the Task found by the `where` argument doesn't exist, create a new Task with this data.
     */
    create: XOR<TaskCreateInput, TaskUncheckedCreateInput>
    /**
     * In case the Task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
  }

  /**
   * Task delete
   */
  export type TaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter which Task to delete.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task deleteMany
   */
  export type TaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tasks to delete
     */
    where?: TaskWhereInput
  }

  /**
   * Task.idea
   */
  export type Task$ideaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Idea
     */
    select?: IdeaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdeaInclude<ExtArgs> | null
    where?: IdeaWhereInput
  }

  /**
   * Task without action
   */
  export type TaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
  }


  /**
   * Model Canvas
   */

  export type AggregateCanvas = {
    _count: CanvasCountAggregateOutputType | null
    _min: CanvasMinAggregateOutputType | null
    _max: CanvasMaxAggregateOutputType | null
  }

  export type CanvasMinAggregateOutputType = {
    id: string | null
    name: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type CanvasMaxAggregateOutputType = {
    id: string | null
    name: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type CanvasCountAggregateOutputType = {
    id: number
    name: number
    userId: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type CanvasMinAggregateInputType = {
    id?: true
    name?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type CanvasMaxAggregateInputType = {
    id?: true
    name?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type CanvasCountAggregateInputType = {
    id?: true
    name?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type CanvasAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Canvas to aggregate.
     */
    where?: CanvasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Canvas to fetch.
     */
    orderBy?: CanvasOrderByWithRelationInput | CanvasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CanvasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Canvas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Canvas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Canvas
    **/
    _count?: true | CanvasCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CanvasMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CanvasMaxAggregateInputType
  }

  export type GetCanvasAggregateType<T extends CanvasAggregateArgs> = {
        [P in keyof T & keyof AggregateCanvas]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCanvas[P]>
      : GetScalarType<T[P], AggregateCanvas[P]>
  }




  export type CanvasGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanvasWhereInput
    orderBy?: CanvasOrderByWithAggregationInput | CanvasOrderByWithAggregationInput[]
    by: CanvasScalarFieldEnum[] | CanvasScalarFieldEnum
    having?: CanvasScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CanvasCountAggregateInputType | true
    _min?: CanvasMinAggregateInputType
    _max?: CanvasMaxAggregateInputType
  }

  export type CanvasGroupByOutputType = {
    id: string
    name: string
    userId: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: CanvasCountAggregateOutputType | null
    _min: CanvasMinAggregateOutputType | null
    _max: CanvasMaxAggregateOutputType | null
  }

  type GetCanvasGroupByPayload<T extends CanvasGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CanvasGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CanvasGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CanvasGroupByOutputType[P]>
            : GetScalarType<T[P], CanvasGroupByOutputType[P]>
        }
      >
    >


  export type CanvasSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    nodes?: boolean | Canvas$nodesArgs<ExtArgs>
    connections?: boolean | Canvas$connectionsArgs<ExtArgs>
    _count?: boolean | CanvasCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["canvas"]>

  export type CanvasSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["canvas"]>

  export type CanvasSelectScalar = {
    id?: boolean
    name?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type CanvasInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    nodes?: boolean | Canvas$nodesArgs<ExtArgs>
    connections?: boolean | Canvas$connectionsArgs<ExtArgs>
    _count?: boolean | CanvasCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CanvasIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CanvasPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Canvas"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      nodes: Prisma.$CanvasNodePayload<ExtArgs>[]
      connections: Prisma.$CanvasConnectionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      userId: string
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["canvas"]>
    composites: {}
  }

  type CanvasGetPayload<S extends boolean | null | undefined | CanvasDefaultArgs> = $Result.GetResult<Prisma.$CanvasPayload, S>

  type CanvasCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CanvasFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CanvasCountAggregateInputType | true
    }

  export interface CanvasDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Canvas'], meta: { name: 'Canvas' } }
    /**
     * Find zero or one Canvas that matches the filter.
     * @param {CanvasFindUniqueArgs} args - Arguments to find a Canvas
     * @example
     * // Get one Canvas
     * const canvas = await prisma.canvas.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CanvasFindUniqueArgs>(args: SelectSubset<T, CanvasFindUniqueArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Canvas that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CanvasFindUniqueOrThrowArgs} args - Arguments to find a Canvas
     * @example
     * // Get one Canvas
     * const canvas = await prisma.canvas.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CanvasFindUniqueOrThrowArgs>(args: SelectSubset<T, CanvasFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Canvas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasFindFirstArgs} args - Arguments to find a Canvas
     * @example
     * // Get one Canvas
     * const canvas = await prisma.canvas.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CanvasFindFirstArgs>(args?: SelectSubset<T, CanvasFindFirstArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Canvas that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasFindFirstOrThrowArgs} args - Arguments to find a Canvas
     * @example
     * // Get one Canvas
     * const canvas = await prisma.canvas.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CanvasFindFirstOrThrowArgs>(args?: SelectSubset<T, CanvasFindFirstOrThrowArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Canvas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Canvas
     * const canvas = await prisma.canvas.findMany()
     * 
     * // Get first 10 Canvas
     * const canvas = await prisma.canvas.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const canvasWithIdOnly = await prisma.canvas.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CanvasFindManyArgs>(args?: SelectSubset<T, CanvasFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Canvas.
     * @param {CanvasCreateArgs} args - Arguments to create a Canvas.
     * @example
     * // Create one Canvas
     * const Canvas = await prisma.canvas.create({
     *   data: {
     *     // ... data to create a Canvas
     *   }
     * })
     * 
     */
    create<T extends CanvasCreateArgs>(args: SelectSubset<T, CanvasCreateArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Canvas.
     * @param {CanvasCreateManyArgs} args - Arguments to create many Canvas.
     * @example
     * // Create many Canvas
     * const canvas = await prisma.canvas.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CanvasCreateManyArgs>(args?: SelectSubset<T, CanvasCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Canvas and returns the data saved in the database.
     * @param {CanvasCreateManyAndReturnArgs} args - Arguments to create many Canvas.
     * @example
     * // Create many Canvas
     * const canvas = await prisma.canvas.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Canvas and only return the `id`
     * const canvasWithIdOnly = await prisma.canvas.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CanvasCreateManyAndReturnArgs>(args?: SelectSubset<T, CanvasCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Canvas.
     * @param {CanvasDeleteArgs} args - Arguments to delete one Canvas.
     * @example
     * // Delete one Canvas
     * const Canvas = await prisma.canvas.delete({
     *   where: {
     *     // ... filter to delete one Canvas
     *   }
     * })
     * 
     */
    delete<T extends CanvasDeleteArgs>(args: SelectSubset<T, CanvasDeleteArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Canvas.
     * @param {CanvasUpdateArgs} args - Arguments to update one Canvas.
     * @example
     * // Update one Canvas
     * const canvas = await prisma.canvas.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CanvasUpdateArgs>(args: SelectSubset<T, CanvasUpdateArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Canvas.
     * @param {CanvasDeleteManyArgs} args - Arguments to filter Canvas to delete.
     * @example
     * // Delete a few Canvas
     * const { count } = await prisma.canvas.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CanvasDeleteManyArgs>(args?: SelectSubset<T, CanvasDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Canvas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Canvas
     * const canvas = await prisma.canvas.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CanvasUpdateManyArgs>(args: SelectSubset<T, CanvasUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Canvas.
     * @param {CanvasUpsertArgs} args - Arguments to update or create a Canvas.
     * @example
     * // Update or create a Canvas
     * const canvas = await prisma.canvas.upsert({
     *   create: {
     *     // ... data to create a Canvas
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Canvas we want to update
     *   }
     * })
     */
    upsert<T extends CanvasUpsertArgs>(args: SelectSubset<T, CanvasUpsertArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Canvas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasCountArgs} args - Arguments to filter Canvas to count.
     * @example
     * // Count the number of Canvas
     * const count = await prisma.canvas.count({
     *   where: {
     *     // ... the filter for the Canvas we want to count
     *   }
     * })
    **/
    count<T extends CanvasCountArgs>(
      args?: Subset<T, CanvasCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CanvasCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Canvas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CanvasAggregateArgs>(args: Subset<T, CanvasAggregateArgs>): Prisma.PrismaPromise<GetCanvasAggregateType<T>>

    /**
     * Group by Canvas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CanvasGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CanvasGroupByArgs['orderBy'] }
        : { orderBy?: CanvasGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CanvasGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCanvasGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Canvas model
   */
  readonly fields: CanvasFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Canvas.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CanvasClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    nodes<T extends Canvas$nodesArgs<ExtArgs> = {}>(args?: Subset<T, Canvas$nodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasNodePayload<ExtArgs>, T, "findMany"> | Null>
    connections<T extends Canvas$connectionsArgs<ExtArgs> = {}>(args?: Subset<T, Canvas$connectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasConnectionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Canvas model
   */ 
  interface CanvasFieldRefs {
    readonly id: FieldRef<"Canvas", 'String'>
    readonly name: FieldRef<"Canvas", 'String'>
    readonly userId: FieldRef<"Canvas", 'String'>
    readonly createdAt: FieldRef<"Canvas", 'DateTime'>
    readonly updatedAt: FieldRef<"Canvas", 'DateTime'>
    readonly deletedAt: FieldRef<"Canvas", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Canvas findUnique
   */
  export type CanvasFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * Filter, which Canvas to fetch.
     */
    where: CanvasWhereUniqueInput
  }

  /**
   * Canvas findUniqueOrThrow
   */
  export type CanvasFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * Filter, which Canvas to fetch.
     */
    where: CanvasWhereUniqueInput
  }

  /**
   * Canvas findFirst
   */
  export type CanvasFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * Filter, which Canvas to fetch.
     */
    where?: CanvasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Canvas to fetch.
     */
    orderBy?: CanvasOrderByWithRelationInput | CanvasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Canvas.
     */
    cursor?: CanvasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Canvas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Canvas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Canvas.
     */
    distinct?: CanvasScalarFieldEnum | CanvasScalarFieldEnum[]
  }

  /**
   * Canvas findFirstOrThrow
   */
  export type CanvasFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * Filter, which Canvas to fetch.
     */
    where?: CanvasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Canvas to fetch.
     */
    orderBy?: CanvasOrderByWithRelationInput | CanvasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Canvas.
     */
    cursor?: CanvasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Canvas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Canvas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Canvas.
     */
    distinct?: CanvasScalarFieldEnum | CanvasScalarFieldEnum[]
  }

  /**
   * Canvas findMany
   */
  export type CanvasFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * Filter, which Canvas to fetch.
     */
    where?: CanvasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Canvas to fetch.
     */
    orderBy?: CanvasOrderByWithRelationInput | CanvasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Canvas.
     */
    cursor?: CanvasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Canvas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Canvas.
     */
    skip?: number
    distinct?: CanvasScalarFieldEnum | CanvasScalarFieldEnum[]
  }

  /**
   * Canvas create
   */
  export type CanvasCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * The data needed to create a Canvas.
     */
    data: XOR<CanvasCreateInput, CanvasUncheckedCreateInput>
  }

  /**
   * Canvas createMany
   */
  export type CanvasCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Canvas.
     */
    data: CanvasCreateManyInput | CanvasCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Canvas createManyAndReturn
   */
  export type CanvasCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Canvas.
     */
    data: CanvasCreateManyInput | CanvasCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Canvas update
   */
  export type CanvasUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * The data needed to update a Canvas.
     */
    data: XOR<CanvasUpdateInput, CanvasUncheckedUpdateInput>
    /**
     * Choose, which Canvas to update.
     */
    where: CanvasWhereUniqueInput
  }

  /**
   * Canvas updateMany
   */
  export type CanvasUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Canvas.
     */
    data: XOR<CanvasUpdateManyMutationInput, CanvasUncheckedUpdateManyInput>
    /**
     * Filter which Canvas to update
     */
    where?: CanvasWhereInput
  }

  /**
   * Canvas upsert
   */
  export type CanvasUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * The filter to search for the Canvas to update in case it exists.
     */
    where: CanvasWhereUniqueInput
    /**
     * In case the Canvas found by the `where` argument doesn't exist, create a new Canvas with this data.
     */
    create: XOR<CanvasCreateInput, CanvasUncheckedCreateInput>
    /**
     * In case the Canvas was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CanvasUpdateInput, CanvasUncheckedUpdateInput>
  }

  /**
   * Canvas delete
   */
  export type CanvasDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
    /**
     * Filter which Canvas to delete.
     */
    where: CanvasWhereUniqueInput
  }

  /**
   * Canvas deleteMany
   */
  export type CanvasDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Canvas to delete
     */
    where?: CanvasWhereInput
  }

  /**
   * Canvas.nodes
   */
  export type Canvas$nodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasNode
     */
    select?: CanvasNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasNodeInclude<ExtArgs> | null
    where?: CanvasNodeWhereInput
    orderBy?: CanvasNodeOrderByWithRelationInput | CanvasNodeOrderByWithRelationInput[]
    cursor?: CanvasNodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CanvasNodeScalarFieldEnum | CanvasNodeScalarFieldEnum[]
  }

  /**
   * Canvas.connections
   */
  export type Canvas$connectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasConnection
     */
    select?: CanvasConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasConnectionInclude<ExtArgs> | null
    where?: CanvasConnectionWhereInput
    orderBy?: CanvasConnectionOrderByWithRelationInput | CanvasConnectionOrderByWithRelationInput[]
    cursor?: CanvasConnectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CanvasConnectionScalarFieldEnum | CanvasConnectionScalarFieldEnum[]
  }

  /**
   * Canvas without action
   */
  export type CanvasDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Canvas
     */
    select?: CanvasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasInclude<ExtArgs> | null
  }


  /**
   * Model CanvasNode
   */

  export type AggregateCanvasNode = {
    _count: CanvasNodeCountAggregateOutputType | null
    _avg: CanvasNodeAvgAggregateOutputType | null
    _sum: CanvasNodeSumAggregateOutputType | null
    _min: CanvasNodeMinAggregateOutputType | null
    _max: CanvasNodeMaxAggregateOutputType | null
  }

  export type CanvasNodeAvgAggregateOutputType = {
    x: number | null
    y: number | null
    width: number | null
    height: number | null
  }

  export type CanvasNodeSumAggregateOutputType = {
    x: number | null
    y: number | null
    width: number | null
    height: number | null
  }

  export type CanvasNodeMinAggregateOutputType = {
    id: string | null
    canvasId: string | null
    ideaId: string | null
    x: number | null
    y: number | null
    width: number | null
    height: number | null
    content: string | null
  }

  export type CanvasNodeMaxAggregateOutputType = {
    id: string | null
    canvasId: string | null
    ideaId: string | null
    x: number | null
    y: number | null
    width: number | null
    height: number | null
    content: string | null
  }

  export type CanvasNodeCountAggregateOutputType = {
    id: number
    canvasId: number
    ideaId: number
    x: number
    y: number
    width: number
    height: number
    content: number
    _all: number
  }


  export type CanvasNodeAvgAggregateInputType = {
    x?: true
    y?: true
    width?: true
    height?: true
  }

  export type CanvasNodeSumAggregateInputType = {
    x?: true
    y?: true
    width?: true
    height?: true
  }

  export type CanvasNodeMinAggregateInputType = {
    id?: true
    canvasId?: true
    ideaId?: true
    x?: true
    y?: true
    width?: true
    height?: true
    content?: true
  }

  export type CanvasNodeMaxAggregateInputType = {
    id?: true
    canvasId?: true
    ideaId?: true
    x?: true
    y?: true
    width?: true
    height?: true
    content?: true
  }

  export type CanvasNodeCountAggregateInputType = {
    id?: true
    canvasId?: true
    ideaId?: true
    x?: true
    y?: true
    width?: true
    height?: true
    content?: true
    _all?: true
  }

  export type CanvasNodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CanvasNode to aggregate.
     */
    where?: CanvasNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanvasNodes to fetch.
     */
    orderBy?: CanvasNodeOrderByWithRelationInput | CanvasNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CanvasNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanvasNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanvasNodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CanvasNodes
    **/
    _count?: true | CanvasNodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CanvasNodeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CanvasNodeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CanvasNodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CanvasNodeMaxAggregateInputType
  }

  export type GetCanvasNodeAggregateType<T extends CanvasNodeAggregateArgs> = {
        [P in keyof T & keyof AggregateCanvasNode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCanvasNode[P]>
      : GetScalarType<T[P], AggregateCanvasNode[P]>
  }




  export type CanvasNodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanvasNodeWhereInput
    orderBy?: CanvasNodeOrderByWithAggregationInput | CanvasNodeOrderByWithAggregationInput[]
    by: CanvasNodeScalarFieldEnum[] | CanvasNodeScalarFieldEnum
    having?: CanvasNodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CanvasNodeCountAggregateInputType | true
    _avg?: CanvasNodeAvgAggregateInputType
    _sum?: CanvasNodeSumAggregateInputType
    _min?: CanvasNodeMinAggregateInputType
    _max?: CanvasNodeMaxAggregateInputType
  }

  export type CanvasNodeGroupByOutputType = {
    id: string
    canvasId: string
    ideaId: string | null
    x: number
    y: number
    width: number
    height: number
    content: string | null
    _count: CanvasNodeCountAggregateOutputType | null
    _avg: CanvasNodeAvgAggregateOutputType | null
    _sum: CanvasNodeSumAggregateOutputType | null
    _min: CanvasNodeMinAggregateOutputType | null
    _max: CanvasNodeMaxAggregateOutputType | null
  }

  type GetCanvasNodeGroupByPayload<T extends CanvasNodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CanvasNodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CanvasNodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CanvasNodeGroupByOutputType[P]>
            : GetScalarType<T[P], CanvasNodeGroupByOutputType[P]>
        }
      >
    >


  export type CanvasNodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    canvasId?: boolean
    ideaId?: boolean
    x?: boolean
    y?: boolean
    width?: boolean
    height?: boolean
    content?: boolean
    canvas?: boolean | CanvasDefaultArgs<ExtArgs>
    idea?: boolean | CanvasNode$ideaArgs<ExtArgs>
    fromConnections?: boolean | CanvasNode$fromConnectionsArgs<ExtArgs>
    toConnections?: boolean | CanvasNode$toConnectionsArgs<ExtArgs>
    _count?: boolean | CanvasNodeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["canvasNode"]>

  export type CanvasNodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    canvasId?: boolean
    ideaId?: boolean
    x?: boolean
    y?: boolean
    width?: boolean
    height?: boolean
    content?: boolean
    canvas?: boolean | CanvasDefaultArgs<ExtArgs>
    idea?: boolean | CanvasNode$ideaArgs<ExtArgs>
  }, ExtArgs["result"]["canvasNode"]>

  export type CanvasNodeSelectScalar = {
    id?: boolean
    canvasId?: boolean
    ideaId?: boolean
    x?: boolean
    y?: boolean
    width?: boolean
    height?: boolean
    content?: boolean
  }

  export type CanvasNodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    canvas?: boolean | CanvasDefaultArgs<ExtArgs>
    idea?: boolean | CanvasNode$ideaArgs<ExtArgs>
    fromConnections?: boolean | CanvasNode$fromConnectionsArgs<ExtArgs>
    toConnections?: boolean | CanvasNode$toConnectionsArgs<ExtArgs>
    _count?: boolean | CanvasNodeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CanvasNodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    canvas?: boolean | CanvasDefaultArgs<ExtArgs>
    idea?: boolean | CanvasNode$ideaArgs<ExtArgs>
  }

  export type $CanvasNodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CanvasNode"
    objects: {
      canvas: Prisma.$CanvasPayload<ExtArgs>
      idea: Prisma.$IdeaPayload<ExtArgs> | null
      fromConnections: Prisma.$CanvasConnectionPayload<ExtArgs>[]
      toConnections: Prisma.$CanvasConnectionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      canvasId: string
      ideaId: string | null
      x: number
      y: number
      width: number
      height: number
      content: string | null
    }, ExtArgs["result"]["canvasNode"]>
    composites: {}
  }

  type CanvasNodeGetPayload<S extends boolean | null | undefined | CanvasNodeDefaultArgs> = $Result.GetResult<Prisma.$CanvasNodePayload, S>

  type CanvasNodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CanvasNodeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CanvasNodeCountAggregateInputType | true
    }

  export interface CanvasNodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CanvasNode'], meta: { name: 'CanvasNode' } }
    /**
     * Find zero or one CanvasNode that matches the filter.
     * @param {CanvasNodeFindUniqueArgs} args - Arguments to find a CanvasNode
     * @example
     * // Get one CanvasNode
     * const canvasNode = await prisma.canvasNode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CanvasNodeFindUniqueArgs>(args: SelectSubset<T, CanvasNodeFindUniqueArgs<ExtArgs>>): Prisma__CanvasNodeClient<$Result.GetResult<Prisma.$CanvasNodePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CanvasNode that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CanvasNodeFindUniqueOrThrowArgs} args - Arguments to find a CanvasNode
     * @example
     * // Get one CanvasNode
     * const canvasNode = await prisma.canvasNode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CanvasNodeFindUniqueOrThrowArgs>(args: SelectSubset<T, CanvasNodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CanvasNodeClient<$Result.GetResult<Prisma.$CanvasNodePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CanvasNode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasNodeFindFirstArgs} args - Arguments to find a CanvasNode
     * @example
     * // Get one CanvasNode
     * const canvasNode = await prisma.canvasNode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CanvasNodeFindFirstArgs>(args?: SelectSubset<T, CanvasNodeFindFirstArgs<ExtArgs>>): Prisma__CanvasNodeClient<$Result.GetResult<Prisma.$CanvasNodePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CanvasNode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasNodeFindFirstOrThrowArgs} args - Arguments to find a CanvasNode
     * @example
     * // Get one CanvasNode
     * const canvasNode = await prisma.canvasNode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CanvasNodeFindFirstOrThrowArgs>(args?: SelectSubset<T, CanvasNodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__CanvasNodeClient<$Result.GetResult<Prisma.$CanvasNodePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CanvasNodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasNodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CanvasNodes
     * const canvasNodes = await prisma.canvasNode.findMany()
     * 
     * // Get first 10 CanvasNodes
     * const canvasNodes = await prisma.canvasNode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const canvasNodeWithIdOnly = await prisma.canvasNode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CanvasNodeFindManyArgs>(args?: SelectSubset<T, CanvasNodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasNodePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CanvasNode.
     * @param {CanvasNodeCreateArgs} args - Arguments to create a CanvasNode.
     * @example
     * // Create one CanvasNode
     * const CanvasNode = await prisma.canvasNode.create({
     *   data: {
     *     // ... data to create a CanvasNode
     *   }
     * })
     * 
     */
    create<T extends CanvasNodeCreateArgs>(args: SelectSubset<T, CanvasNodeCreateArgs<ExtArgs>>): Prisma__CanvasNodeClient<$Result.GetResult<Prisma.$CanvasNodePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CanvasNodes.
     * @param {CanvasNodeCreateManyArgs} args - Arguments to create many CanvasNodes.
     * @example
     * // Create many CanvasNodes
     * const canvasNode = await prisma.canvasNode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CanvasNodeCreateManyArgs>(args?: SelectSubset<T, CanvasNodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CanvasNodes and returns the data saved in the database.
     * @param {CanvasNodeCreateManyAndReturnArgs} args - Arguments to create many CanvasNodes.
     * @example
     * // Create many CanvasNodes
     * const canvasNode = await prisma.canvasNode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CanvasNodes and only return the `id`
     * const canvasNodeWithIdOnly = await prisma.canvasNode.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CanvasNodeCreateManyAndReturnArgs>(args?: SelectSubset<T, CanvasNodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasNodePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CanvasNode.
     * @param {CanvasNodeDeleteArgs} args - Arguments to delete one CanvasNode.
     * @example
     * // Delete one CanvasNode
     * const CanvasNode = await prisma.canvasNode.delete({
     *   where: {
     *     // ... filter to delete one CanvasNode
     *   }
     * })
     * 
     */
    delete<T extends CanvasNodeDeleteArgs>(args: SelectSubset<T, CanvasNodeDeleteArgs<ExtArgs>>): Prisma__CanvasNodeClient<$Result.GetResult<Prisma.$CanvasNodePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CanvasNode.
     * @param {CanvasNodeUpdateArgs} args - Arguments to update one CanvasNode.
     * @example
     * // Update one CanvasNode
     * const canvasNode = await prisma.canvasNode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CanvasNodeUpdateArgs>(args: SelectSubset<T, CanvasNodeUpdateArgs<ExtArgs>>): Prisma__CanvasNodeClient<$Result.GetResult<Prisma.$CanvasNodePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CanvasNodes.
     * @param {CanvasNodeDeleteManyArgs} args - Arguments to filter CanvasNodes to delete.
     * @example
     * // Delete a few CanvasNodes
     * const { count } = await prisma.canvasNode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CanvasNodeDeleteManyArgs>(args?: SelectSubset<T, CanvasNodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CanvasNodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasNodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CanvasNodes
     * const canvasNode = await prisma.canvasNode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CanvasNodeUpdateManyArgs>(args: SelectSubset<T, CanvasNodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CanvasNode.
     * @param {CanvasNodeUpsertArgs} args - Arguments to update or create a CanvasNode.
     * @example
     * // Update or create a CanvasNode
     * const canvasNode = await prisma.canvasNode.upsert({
     *   create: {
     *     // ... data to create a CanvasNode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CanvasNode we want to update
     *   }
     * })
     */
    upsert<T extends CanvasNodeUpsertArgs>(args: SelectSubset<T, CanvasNodeUpsertArgs<ExtArgs>>): Prisma__CanvasNodeClient<$Result.GetResult<Prisma.$CanvasNodePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CanvasNodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasNodeCountArgs} args - Arguments to filter CanvasNodes to count.
     * @example
     * // Count the number of CanvasNodes
     * const count = await prisma.canvasNode.count({
     *   where: {
     *     // ... the filter for the CanvasNodes we want to count
     *   }
     * })
    **/
    count<T extends CanvasNodeCountArgs>(
      args?: Subset<T, CanvasNodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CanvasNodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CanvasNode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasNodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CanvasNodeAggregateArgs>(args: Subset<T, CanvasNodeAggregateArgs>): Prisma.PrismaPromise<GetCanvasNodeAggregateType<T>>

    /**
     * Group by CanvasNode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasNodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CanvasNodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CanvasNodeGroupByArgs['orderBy'] }
        : { orderBy?: CanvasNodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CanvasNodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCanvasNodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CanvasNode model
   */
  readonly fields: CanvasNodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CanvasNode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CanvasNodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    canvas<T extends CanvasDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CanvasDefaultArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    idea<T extends CanvasNode$ideaArgs<ExtArgs> = {}>(args?: Subset<T, CanvasNode$ideaArgs<ExtArgs>>): Prisma__IdeaClient<$Result.GetResult<Prisma.$IdeaPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    fromConnections<T extends CanvasNode$fromConnectionsArgs<ExtArgs> = {}>(args?: Subset<T, CanvasNode$fromConnectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasConnectionPayload<ExtArgs>, T, "findMany"> | Null>
    toConnections<T extends CanvasNode$toConnectionsArgs<ExtArgs> = {}>(args?: Subset<T, CanvasNode$toConnectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasConnectionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CanvasNode model
   */ 
  interface CanvasNodeFieldRefs {
    readonly id: FieldRef<"CanvasNode", 'String'>
    readonly canvasId: FieldRef<"CanvasNode", 'String'>
    readonly ideaId: FieldRef<"CanvasNode", 'String'>
    readonly x: FieldRef<"CanvasNode", 'Float'>
    readonly y: FieldRef<"CanvasNode", 'Float'>
    readonly width: FieldRef<"CanvasNode", 'Float'>
    readonly height: FieldRef<"CanvasNode", 'Float'>
    readonly content: FieldRef<"CanvasNode", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CanvasNode findUnique
   */
  export type CanvasNodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasNode
     */
    select?: CanvasNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasNodeInclude<ExtArgs> | null
    /**
     * Filter, which CanvasNode to fetch.
     */
    where: CanvasNodeWhereUniqueInput
  }

  /**
   * CanvasNode findUniqueOrThrow
   */
  export type CanvasNodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasNode
     */
    select?: CanvasNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasNodeInclude<ExtArgs> | null
    /**
     * Filter, which CanvasNode to fetch.
     */
    where: CanvasNodeWhereUniqueInput
  }

  /**
   * CanvasNode findFirst
   */
  export type CanvasNodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasNode
     */
    select?: CanvasNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasNodeInclude<ExtArgs> | null
    /**
     * Filter, which CanvasNode to fetch.
     */
    where?: CanvasNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanvasNodes to fetch.
     */
    orderBy?: CanvasNodeOrderByWithRelationInput | CanvasNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CanvasNodes.
     */
    cursor?: CanvasNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanvasNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanvasNodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CanvasNodes.
     */
    distinct?: CanvasNodeScalarFieldEnum | CanvasNodeScalarFieldEnum[]
  }

  /**
   * CanvasNode findFirstOrThrow
   */
  export type CanvasNodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasNode
     */
    select?: CanvasNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasNodeInclude<ExtArgs> | null
    /**
     * Filter, which CanvasNode to fetch.
     */
    where?: CanvasNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanvasNodes to fetch.
     */
    orderBy?: CanvasNodeOrderByWithRelationInput | CanvasNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CanvasNodes.
     */
    cursor?: CanvasNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanvasNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanvasNodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CanvasNodes.
     */
    distinct?: CanvasNodeScalarFieldEnum | CanvasNodeScalarFieldEnum[]
  }

  /**
   * CanvasNode findMany
   */
  export type CanvasNodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasNode
     */
    select?: CanvasNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasNodeInclude<ExtArgs> | null
    /**
     * Filter, which CanvasNodes to fetch.
     */
    where?: CanvasNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanvasNodes to fetch.
     */
    orderBy?: CanvasNodeOrderByWithRelationInput | CanvasNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CanvasNodes.
     */
    cursor?: CanvasNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanvasNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanvasNodes.
     */
    skip?: number
    distinct?: CanvasNodeScalarFieldEnum | CanvasNodeScalarFieldEnum[]
  }

  /**
   * CanvasNode create
   */
  export type CanvasNodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasNode
     */
    select?: CanvasNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasNodeInclude<ExtArgs> | null
    /**
     * The data needed to create a CanvasNode.
     */
    data: XOR<CanvasNodeCreateInput, CanvasNodeUncheckedCreateInput>
  }

  /**
   * CanvasNode createMany
   */
  export type CanvasNodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CanvasNodes.
     */
    data: CanvasNodeCreateManyInput | CanvasNodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CanvasNode createManyAndReturn
   */
  export type CanvasNodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasNode
     */
    select?: CanvasNodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CanvasNodes.
     */
    data: CanvasNodeCreateManyInput | CanvasNodeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasNodeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CanvasNode update
   */
  export type CanvasNodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasNode
     */
    select?: CanvasNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasNodeInclude<ExtArgs> | null
    /**
     * The data needed to update a CanvasNode.
     */
    data: XOR<CanvasNodeUpdateInput, CanvasNodeUncheckedUpdateInput>
    /**
     * Choose, which CanvasNode to update.
     */
    where: CanvasNodeWhereUniqueInput
  }

  /**
   * CanvasNode updateMany
   */
  export type CanvasNodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CanvasNodes.
     */
    data: XOR<CanvasNodeUpdateManyMutationInput, CanvasNodeUncheckedUpdateManyInput>
    /**
     * Filter which CanvasNodes to update
     */
    where?: CanvasNodeWhereInput
  }

  /**
   * CanvasNode upsert
   */
  export type CanvasNodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasNode
     */
    select?: CanvasNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasNodeInclude<ExtArgs> | null
    /**
     * The filter to search for the CanvasNode to update in case it exists.
     */
    where: CanvasNodeWhereUniqueInput
    /**
     * In case the CanvasNode found by the `where` argument doesn't exist, create a new CanvasNode with this data.
     */
    create: XOR<CanvasNodeCreateInput, CanvasNodeUncheckedCreateInput>
    /**
     * In case the CanvasNode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CanvasNodeUpdateInput, CanvasNodeUncheckedUpdateInput>
  }

  /**
   * CanvasNode delete
   */
  export type CanvasNodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasNode
     */
    select?: CanvasNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasNodeInclude<ExtArgs> | null
    /**
     * Filter which CanvasNode to delete.
     */
    where: CanvasNodeWhereUniqueInput
  }

  /**
   * CanvasNode deleteMany
   */
  export type CanvasNodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CanvasNodes to delete
     */
    where?: CanvasNodeWhereInput
  }

  /**
   * CanvasNode.idea
   */
  export type CanvasNode$ideaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Idea
     */
    select?: IdeaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdeaInclude<ExtArgs> | null
    where?: IdeaWhereInput
  }

  /**
   * CanvasNode.fromConnections
   */
  export type CanvasNode$fromConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasConnection
     */
    select?: CanvasConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasConnectionInclude<ExtArgs> | null
    where?: CanvasConnectionWhereInput
    orderBy?: CanvasConnectionOrderByWithRelationInput | CanvasConnectionOrderByWithRelationInput[]
    cursor?: CanvasConnectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CanvasConnectionScalarFieldEnum | CanvasConnectionScalarFieldEnum[]
  }

  /**
   * CanvasNode.toConnections
   */
  export type CanvasNode$toConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasConnection
     */
    select?: CanvasConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasConnectionInclude<ExtArgs> | null
    where?: CanvasConnectionWhereInput
    orderBy?: CanvasConnectionOrderByWithRelationInput | CanvasConnectionOrderByWithRelationInput[]
    cursor?: CanvasConnectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CanvasConnectionScalarFieldEnum | CanvasConnectionScalarFieldEnum[]
  }

  /**
   * CanvasNode without action
   */
  export type CanvasNodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasNode
     */
    select?: CanvasNodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasNodeInclude<ExtArgs> | null
  }


  /**
   * Model CanvasConnection
   */

  export type AggregateCanvasConnection = {
    _count: CanvasConnectionCountAggregateOutputType | null
    _min: CanvasConnectionMinAggregateOutputType | null
    _max: CanvasConnectionMaxAggregateOutputType | null
  }

  export type CanvasConnectionMinAggregateOutputType = {
    id: string | null
    canvasId: string | null
    fromNodeId: string | null
    toNodeId: string | null
    label: string | null
  }

  export type CanvasConnectionMaxAggregateOutputType = {
    id: string | null
    canvasId: string | null
    fromNodeId: string | null
    toNodeId: string | null
    label: string | null
  }

  export type CanvasConnectionCountAggregateOutputType = {
    id: number
    canvasId: number
    fromNodeId: number
    toNodeId: number
    label: number
    _all: number
  }


  export type CanvasConnectionMinAggregateInputType = {
    id?: true
    canvasId?: true
    fromNodeId?: true
    toNodeId?: true
    label?: true
  }

  export type CanvasConnectionMaxAggregateInputType = {
    id?: true
    canvasId?: true
    fromNodeId?: true
    toNodeId?: true
    label?: true
  }

  export type CanvasConnectionCountAggregateInputType = {
    id?: true
    canvasId?: true
    fromNodeId?: true
    toNodeId?: true
    label?: true
    _all?: true
  }

  export type CanvasConnectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CanvasConnection to aggregate.
     */
    where?: CanvasConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanvasConnections to fetch.
     */
    orderBy?: CanvasConnectionOrderByWithRelationInput | CanvasConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CanvasConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanvasConnections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanvasConnections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CanvasConnections
    **/
    _count?: true | CanvasConnectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CanvasConnectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CanvasConnectionMaxAggregateInputType
  }

  export type GetCanvasConnectionAggregateType<T extends CanvasConnectionAggregateArgs> = {
        [P in keyof T & keyof AggregateCanvasConnection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCanvasConnection[P]>
      : GetScalarType<T[P], AggregateCanvasConnection[P]>
  }




  export type CanvasConnectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanvasConnectionWhereInput
    orderBy?: CanvasConnectionOrderByWithAggregationInput | CanvasConnectionOrderByWithAggregationInput[]
    by: CanvasConnectionScalarFieldEnum[] | CanvasConnectionScalarFieldEnum
    having?: CanvasConnectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CanvasConnectionCountAggregateInputType | true
    _min?: CanvasConnectionMinAggregateInputType
    _max?: CanvasConnectionMaxAggregateInputType
  }

  export type CanvasConnectionGroupByOutputType = {
    id: string
    canvasId: string
    fromNodeId: string
    toNodeId: string
    label: string | null
    _count: CanvasConnectionCountAggregateOutputType | null
    _min: CanvasConnectionMinAggregateOutputType | null
    _max: CanvasConnectionMaxAggregateOutputType | null
  }

  type GetCanvasConnectionGroupByPayload<T extends CanvasConnectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CanvasConnectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CanvasConnectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CanvasConnectionGroupByOutputType[P]>
            : GetScalarType<T[P], CanvasConnectionGroupByOutputType[P]>
        }
      >
    >


  export type CanvasConnectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    canvasId?: boolean
    fromNodeId?: boolean
    toNodeId?: boolean
    label?: boolean
    canvas?: boolean | CanvasDefaultArgs<ExtArgs>
    fromNode?: boolean | CanvasNodeDefaultArgs<ExtArgs>
    toNode?: boolean | CanvasNodeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["canvasConnection"]>

  export type CanvasConnectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    canvasId?: boolean
    fromNodeId?: boolean
    toNodeId?: boolean
    label?: boolean
    canvas?: boolean | CanvasDefaultArgs<ExtArgs>
    fromNode?: boolean | CanvasNodeDefaultArgs<ExtArgs>
    toNode?: boolean | CanvasNodeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["canvasConnection"]>

  export type CanvasConnectionSelectScalar = {
    id?: boolean
    canvasId?: boolean
    fromNodeId?: boolean
    toNodeId?: boolean
    label?: boolean
  }

  export type CanvasConnectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    canvas?: boolean | CanvasDefaultArgs<ExtArgs>
    fromNode?: boolean | CanvasNodeDefaultArgs<ExtArgs>
    toNode?: boolean | CanvasNodeDefaultArgs<ExtArgs>
  }
  export type CanvasConnectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    canvas?: boolean | CanvasDefaultArgs<ExtArgs>
    fromNode?: boolean | CanvasNodeDefaultArgs<ExtArgs>
    toNode?: boolean | CanvasNodeDefaultArgs<ExtArgs>
  }

  export type $CanvasConnectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CanvasConnection"
    objects: {
      canvas: Prisma.$CanvasPayload<ExtArgs>
      fromNode: Prisma.$CanvasNodePayload<ExtArgs>
      toNode: Prisma.$CanvasNodePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      canvasId: string
      fromNodeId: string
      toNodeId: string
      label: string | null
    }, ExtArgs["result"]["canvasConnection"]>
    composites: {}
  }

  type CanvasConnectionGetPayload<S extends boolean | null | undefined | CanvasConnectionDefaultArgs> = $Result.GetResult<Prisma.$CanvasConnectionPayload, S>

  type CanvasConnectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CanvasConnectionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CanvasConnectionCountAggregateInputType | true
    }

  export interface CanvasConnectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CanvasConnection'], meta: { name: 'CanvasConnection' } }
    /**
     * Find zero or one CanvasConnection that matches the filter.
     * @param {CanvasConnectionFindUniqueArgs} args - Arguments to find a CanvasConnection
     * @example
     * // Get one CanvasConnection
     * const canvasConnection = await prisma.canvasConnection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CanvasConnectionFindUniqueArgs>(args: SelectSubset<T, CanvasConnectionFindUniqueArgs<ExtArgs>>): Prisma__CanvasConnectionClient<$Result.GetResult<Prisma.$CanvasConnectionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CanvasConnection that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CanvasConnectionFindUniqueOrThrowArgs} args - Arguments to find a CanvasConnection
     * @example
     * // Get one CanvasConnection
     * const canvasConnection = await prisma.canvasConnection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CanvasConnectionFindUniqueOrThrowArgs>(args: SelectSubset<T, CanvasConnectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CanvasConnectionClient<$Result.GetResult<Prisma.$CanvasConnectionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CanvasConnection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasConnectionFindFirstArgs} args - Arguments to find a CanvasConnection
     * @example
     * // Get one CanvasConnection
     * const canvasConnection = await prisma.canvasConnection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CanvasConnectionFindFirstArgs>(args?: SelectSubset<T, CanvasConnectionFindFirstArgs<ExtArgs>>): Prisma__CanvasConnectionClient<$Result.GetResult<Prisma.$CanvasConnectionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CanvasConnection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasConnectionFindFirstOrThrowArgs} args - Arguments to find a CanvasConnection
     * @example
     * // Get one CanvasConnection
     * const canvasConnection = await prisma.canvasConnection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CanvasConnectionFindFirstOrThrowArgs>(args?: SelectSubset<T, CanvasConnectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CanvasConnectionClient<$Result.GetResult<Prisma.$CanvasConnectionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CanvasConnections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasConnectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CanvasConnections
     * const canvasConnections = await prisma.canvasConnection.findMany()
     * 
     * // Get first 10 CanvasConnections
     * const canvasConnections = await prisma.canvasConnection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const canvasConnectionWithIdOnly = await prisma.canvasConnection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CanvasConnectionFindManyArgs>(args?: SelectSubset<T, CanvasConnectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasConnectionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CanvasConnection.
     * @param {CanvasConnectionCreateArgs} args - Arguments to create a CanvasConnection.
     * @example
     * // Create one CanvasConnection
     * const CanvasConnection = await prisma.canvasConnection.create({
     *   data: {
     *     // ... data to create a CanvasConnection
     *   }
     * })
     * 
     */
    create<T extends CanvasConnectionCreateArgs>(args: SelectSubset<T, CanvasConnectionCreateArgs<ExtArgs>>): Prisma__CanvasConnectionClient<$Result.GetResult<Prisma.$CanvasConnectionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CanvasConnections.
     * @param {CanvasConnectionCreateManyArgs} args - Arguments to create many CanvasConnections.
     * @example
     * // Create many CanvasConnections
     * const canvasConnection = await prisma.canvasConnection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CanvasConnectionCreateManyArgs>(args?: SelectSubset<T, CanvasConnectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CanvasConnections and returns the data saved in the database.
     * @param {CanvasConnectionCreateManyAndReturnArgs} args - Arguments to create many CanvasConnections.
     * @example
     * // Create many CanvasConnections
     * const canvasConnection = await prisma.canvasConnection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CanvasConnections and only return the `id`
     * const canvasConnectionWithIdOnly = await prisma.canvasConnection.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CanvasConnectionCreateManyAndReturnArgs>(args?: SelectSubset<T, CanvasConnectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanvasConnectionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CanvasConnection.
     * @param {CanvasConnectionDeleteArgs} args - Arguments to delete one CanvasConnection.
     * @example
     * // Delete one CanvasConnection
     * const CanvasConnection = await prisma.canvasConnection.delete({
     *   where: {
     *     // ... filter to delete one CanvasConnection
     *   }
     * })
     * 
     */
    delete<T extends CanvasConnectionDeleteArgs>(args: SelectSubset<T, CanvasConnectionDeleteArgs<ExtArgs>>): Prisma__CanvasConnectionClient<$Result.GetResult<Prisma.$CanvasConnectionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CanvasConnection.
     * @param {CanvasConnectionUpdateArgs} args - Arguments to update one CanvasConnection.
     * @example
     * // Update one CanvasConnection
     * const canvasConnection = await prisma.canvasConnection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CanvasConnectionUpdateArgs>(args: SelectSubset<T, CanvasConnectionUpdateArgs<ExtArgs>>): Prisma__CanvasConnectionClient<$Result.GetResult<Prisma.$CanvasConnectionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CanvasConnections.
     * @param {CanvasConnectionDeleteManyArgs} args - Arguments to filter CanvasConnections to delete.
     * @example
     * // Delete a few CanvasConnections
     * const { count } = await prisma.canvasConnection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CanvasConnectionDeleteManyArgs>(args?: SelectSubset<T, CanvasConnectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CanvasConnections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasConnectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CanvasConnections
     * const canvasConnection = await prisma.canvasConnection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CanvasConnectionUpdateManyArgs>(args: SelectSubset<T, CanvasConnectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CanvasConnection.
     * @param {CanvasConnectionUpsertArgs} args - Arguments to update or create a CanvasConnection.
     * @example
     * // Update or create a CanvasConnection
     * const canvasConnection = await prisma.canvasConnection.upsert({
     *   create: {
     *     // ... data to create a CanvasConnection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CanvasConnection we want to update
     *   }
     * })
     */
    upsert<T extends CanvasConnectionUpsertArgs>(args: SelectSubset<T, CanvasConnectionUpsertArgs<ExtArgs>>): Prisma__CanvasConnectionClient<$Result.GetResult<Prisma.$CanvasConnectionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CanvasConnections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasConnectionCountArgs} args - Arguments to filter CanvasConnections to count.
     * @example
     * // Count the number of CanvasConnections
     * const count = await prisma.canvasConnection.count({
     *   where: {
     *     // ... the filter for the CanvasConnections we want to count
     *   }
     * })
    **/
    count<T extends CanvasConnectionCountArgs>(
      args?: Subset<T, CanvasConnectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CanvasConnectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CanvasConnection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasConnectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CanvasConnectionAggregateArgs>(args: Subset<T, CanvasConnectionAggregateArgs>): Prisma.PrismaPromise<GetCanvasConnectionAggregateType<T>>

    /**
     * Group by CanvasConnection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanvasConnectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CanvasConnectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CanvasConnectionGroupByArgs['orderBy'] }
        : { orderBy?: CanvasConnectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CanvasConnectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCanvasConnectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CanvasConnection model
   */
  readonly fields: CanvasConnectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CanvasConnection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CanvasConnectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    canvas<T extends CanvasDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CanvasDefaultArgs<ExtArgs>>): Prisma__CanvasClient<$Result.GetResult<Prisma.$CanvasPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    fromNode<T extends CanvasNodeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CanvasNodeDefaultArgs<ExtArgs>>): Prisma__CanvasNodeClient<$Result.GetResult<Prisma.$CanvasNodePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    toNode<T extends CanvasNodeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CanvasNodeDefaultArgs<ExtArgs>>): Prisma__CanvasNodeClient<$Result.GetResult<Prisma.$CanvasNodePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CanvasConnection model
   */ 
  interface CanvasConnectionFieldRefs {
    readonly id: FieldRef<"CanvasConnection", 'String'>
    readonly canvasId: FieldRef<"CanvasConnection", 'String'>
    readonly fromNodeId: FieldRef<"CanvasConnection", 'String'>
    readonly toNodeId: FieldRef<"CanvasConnection", 'String'>
    readonly label: FieldRef<"CanvasConnection", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CanvasConnection findUnique
   */
  export type CanvasConnectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasConnection
     */
    select?: CanvasConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasConnectionInclude<ExtArgs> | null
    /**
     * Filter, which CanvasConnection to fetch.
     */
    where: CanvasConnectionWhereUniqueInput
  }

  /**
   * CanvasConnection findUniqueOrThrow
   */
  export type CanvasConnectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasConnection
     */
    select?: CanvasConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasConnectionInclude<ExtArgs> | null
    /**
     * Filter, which CanvasConnection to fetch.
     */
    where: CanvasConnectionWhereUniqueInput
  }

  /**
   * CanvasConnection findFirst
   */
  export type CanvasConnectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasConnection
     */
    select?: CanvasConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasConnectionInclude<ExtArgs> | null
    /**
     * Filter, which CanvasConnection to fetch.
     */
    where?: CanvasConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanvasConnections to fetch.
     */
    orderBy?: CanvasConnectionOrderByWithRelationInput | CanvasConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CanvasConnections.
     */
    cursor?: CanvasConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanvasConnections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanvasConnections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CanvasConnections.
     */
    distinct?: CanvasConnectionScalarFieldEnum | CanvasConnectionScalarFieldEnum[]
  }

  /**
   * CanvasConnection findFirstOrThrow
   */
  export type CanvasConnectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasConnection
     */
    select?: CanvasConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasConnectionInclude<ExtArgs> | null
    /**
     * Filter, which CanvasConnection to fetch.
     */
    where?: CanvasConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanvasConnections to fetch.
     */
    orderBy?: CanvasConnectionOrderByWithRelationInput | CanvasConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CanvasConnections.
     */
    cursor?: CanvasConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanvasConnections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanvasConnections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CanvasConnections.
     */
    distinct?: CanvasConnectionScalarFieldEnum | CanvasConnectionScalarFieldEnum[]
  }

  /**
   * CanvasConnection findMany
   */
  export type CanvasConnectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasConnection
     */
    select?: CanvasConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasConnectionInclude<ExtArgs> | null
    /**
     * Filter, which CanvasConnections to fetch.
     */
    where?: CanvasConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanvasConnections to fetch.
     */
    orderBy?: CanvasConnectionOrderByWithRelationInput | CanvasConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CanvasConnections.
     */
    cursor?: CanvasConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanvasConnections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanvasConnections.
     */
    skip?: number
    distinct?: CanvasConnectionScalarFieldEnum | CanvasConnectionScalarFieldEnum[]
  }

  /**
   * CanvasConnection create
   */
  export type CanvasConnectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasConnection
     */
    select?: CanvasConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasConnectionInclude<ExtArgs> | null
    /**
     * The data needed to create a CanvasConnection.
     */
    data: XOR<CanvasConnectionCreateInput, CanvasConnectionUncheckedCreateInput>
  }

  /**
   * CanvasConnection createMany
   */
  export type CanvasConnectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CanvasConnections.
     */
    data: CanvasConnectionCreateManyInput | CanvasConnectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CanvasConnection createManyAndReturn
   */
  export type CanvasConnectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasConnection
     */
    select?: CanvasConnectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CanvasConnections.
     */
    data: CanvasConnectionCreateManyInput | CanvasConnectionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasConnectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CanvasConnection update
   */
  export type CanvasConnectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasConnection
     */
    select?: CanvasConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasConnectionInclude<ExtArgs> | null
    /**
     * The data needed to update a CanvasConnection.
     */
    data: XOR<CanvasConnectionUpdateInput, CanvasConnectionUncheckedUpdateInput>
    /**
     * Choose, which CanvasConnection to update.
     */
    where: CanvasConnectionWhereUniqueInput
  }

  /**
   * CanvasConnection updateMany
   */
  export type CanvasConnectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CanvasConnections.
     */
    data: XOR<CanvasConnectionUpdateManyMutationInput, CanvasConnectionUncheckedUpdateManyInput>
    /**
     * Filter which CanvasConnections to update
     */
    where?: CanvasConnectionWhereInput
  }

  /**
   * CanvasConnection upsert
   */
  export type CanvasConnectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasConnection
     */
    select?: CanvasConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasConnectionInclude<ExtArgs> | null
    /**
     * The filter to search for the CanvasConnection to update in case it exists.
     */
    where: CanvasConnectionWhereUniqueInput
    /**
     * In case the CanvasConnection found by the `where` argument doesn't exist, create a new CanvasConnection with this data.
     */
    create: XOR<CanvasConnectionCreateInput, CanvasConnectionUncheckedCreateInput>
    /**
     * In case the CanvasConnection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CanvasConnectionUpdateInput, CanvasConnectionUncheckedUpdateInput>
  }

  /**
   * CanvasConnection delete
   */
  export type CanvasConnectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasConnection
     */
    select?: CanvasConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasConnectionInclude<ExtArgs> | null
    /**
     * Filter which CanvasConnection to delete.
     */
    where: CanvasConnectionWhereUniqueInput
  }

  /**
   * CanvasConnection deleteMany
   */
  export type CanvasConnectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CanvasConnections to delete
     */
    where?: CanvasConnectionWhereInput
  }

  /**
   * CanvasConnection without action
   */
  export type CanvasConnectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanvasConnection
     */
    select?: CanvasConnectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanvasConnectionInclude<ExtArgs> | null
  }


  /**
   * Model AnalyticsEvent
   */

  export type AggregateAnalyticsEvent = {
    _count: AnalyticsEventCountAggregateOutputType | null
    _min: AnalyticsEventMinAggregateOutputType | null
    _max: AnalyticsEventMaxAggregateOutputType | null
  }

  export type AnalyticsEventMinAggregateOutputType = {
    id: string | null
    eventName: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type AnalyticsEventMaxAggregateOutputType = {
    id: string | null
    eventName: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type AnalyticsEventCountAggregateOutputType = {
    id: number
    eventName: number
    userId: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type AnalyticsEventMinAggregateInputType = {
    id?: true
    eventName?: true
    userId?: true
    createdAt?: true
  }

  export type AnalyticsEventMaxAggregateInputType = {
    id?: true
    eventName?: true
    userId?: true
    createdAt?: true
  }

  export type AnalyticsEventCountAggregateInputType = {
    id?: true
    eventName?: true
    userId?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type AnalyticsEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalyticsEvent to aggregate.
     */
    where?: AnalyticsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalyticsEvents to fetch.
     */
    orderBy?: AnalyticsEventOrderByWithRelationInput | AnalyticsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalyticsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalyticsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalyticsEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnalyticsEvents
    **/
    _count?: true | AnalyticsEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalyticsEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalyticsEventMaxAggregateInputType
  }

  export type GetAnalyticsEventAggregateType<T extends AnalyticsEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalyticsEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalyticsEvent[P]>
      : GetScalarType<T[P], AggregateAnalyticsEvent[P]>
  }




  export type AnalyticsEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalyticsEventWhereInput
    orderBy?: AnalyticsEventOrderByWithAggregationInput | AnalyticsEventOrderByWithAggregationInput[]
    by: AnalyticsEventScalarFieldEnum[] | AnalyticsEventScalarFieldEnum
    having?: AnalyticsEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalyticsEventCountAggregateInputType | true
    _min?: AnalyticsEventMinAggregateInputType
    _max?: AnalyticsEventMaxAggregateInputType
  }

  export type AnalyticsEventGroupByOutputType = {
    id: string
    eventName: string
    userId: string | null
    metadata: JsonValue | null
    createdAt: Date
    _count: AnalyticsEventCountAggregateOutputType | null
    _min: AnalyticsEventMinAggregateOutputType | null
    _max: AnalyticsEventMaxAggregateOutputType | null
  }

  type GetAnalyticsEventGroupByPayload<T extends AnalyticsEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalyticsEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalyticsEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalyticsEventGroupByOutputType[P]>
            : GetScalarType<T[P], AnalyticsEventGroupByOutputType[P]>
        }
      >
    >


  export type AnalyticsEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventName?: boolean
    userId?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | AnalyticsEvent$userArgs<ExtArgs>
  }, ExtArgs["result"]["analyticsEvent"]>

  export type AnalyticsEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventName?: boolean
    userId?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | AnalyticsEvent$userArgs<ExtArgs>
  }, ExtArgs["result"]["analyticsEvent"]>

  export type AnalyticsEventSelectScalar = {
    id?: boolean
    eventName?: boolean
    userId?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type AnalyticsEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AnalyticsEvent$userArgs<ExtArgs>
  }
  export type AnalyticsEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AnalyticsEvent$userArgs<ExtArgs>
  }

  export type $AnalyticsEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnalyticsEvent"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventName: string
      userId: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["analyticsEvent"]>
    composites: {}
  }

  type AnalyticsEventGetPayload<S extends boolean | null | undefined | AnalyticsEventDefaultArgs> = $Result.GetResult<Prisma.$AnalyticsEventPayload, S>

  type AnalyticsEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AnalyticsEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AnalyticsEventCountAggregateInputType | true
    }

  export interface AnalyticsEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnalyticsEvent'], meta: { name: 'AnalyticsEvent' } }
    /**
     * Find zero or one AnalyticsEvent that matches the filter.
     * @param {AnalyticsEventFindUniqueArgs} args - Arguments to find a AnalyticsEvent
     * @example
     * // Get one AnalyticsEvent
     * const analyticsEvent = await prisma.analyticsEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalyticsEventFindUniqueArgs>(args: SelectSubset<T, AnalyticsEventFindUniqueArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AnalyticsEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AnalyticsEventFindUniqueOrThrowArgs} args - Arguments to find a AnalyticsEvent
     * @example
     * // Get one AnalyticsEvent
     * const analyticsEvent = await prisma.analyticsEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalyticsEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalyticsEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AnalyticsEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsEventFindFirstArgs} args - Arguments to find a AnalyticsEvent
     * @example
     * // Get one AnalyticsEvent
     * const analyticsEvent = await prisma.analyticsEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalyticsEventFindFirstArgs>(args?: SelectSubset<T, AnalyticsEventFindFirstArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AnalyticsEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsEventFindFirstOrThrowArgs} args - Arguments to find a AnalyticsEvent
     * @example
     * // Get one AnalyticsEvent
     * const analyticsEvent = await prisma.analyticsEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalyticsEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalyticsEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AnalyticsEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnalyticsEvents
     * const analyticsEvents = await prisma.analyticsEvent.findMany()
     * 
     * // Get first 10 AnalyticsEvents
     * const analyticsEvents = await prisma.analyticsEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analyticsEventWithIdOnly = await prisma.analyticsEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalyticsEventFindManyArgs>(args?: SelectSubset<T, AnalyticsEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AnalyticsEvent.
     * @param {AnalyticsEventCreateArgs} args - Arguments to create a AnalyticsEvent.
     * @example
     * // Create one AnalyticsEvent
     * const AnalyticsEvent = await prisma.analyticsEvent.create({
     *   data: {
     *     // ... data to create a AnalyticsEvent
     *   }
     * })
     * 
     */
    create<T extends AnalyticsEventCreateArgs>(args: SelectSubset<T, AnalyticsEventCreateArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AnalyticsEvents.
     * @param {AnalyticsEventCreateManyArgs} args - Arguments to create many AnalyticsEvents.
     * @example
     * // Create many AnalyticsEvents
     * const analyticsEvent = await prisma.analyticsEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalyticsEventCreateManyArgs>(args?: SelectSubset<T, AnalyticsEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnalyticsEvents and returns the data saved in the database.
     * @param {AnalyticsEventCreateManyAndReturnArgs} args - Arguments to create many AnalyticsEvents.
     * @example
     * // Create many AnalyticsEvents
     * const analyticsEvent = await prisma.analyticsEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnalyticsEvents and only return the `id`
     * const analyticsEventWithIdOnly = await prisma.analyticsEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnalyticsEventCreateManyAndReturnArgs>(args?: SelectSubset<T, AnalyticsEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AnalyticsEvent.
     * @param {AnalyticsEventDeleteArgs} args - Arguments to delete one AnalyticsEvent.
     * @example
     * // Delete one AnalyticsEvent
     * const AnalyticsEvent = await prisma.analyticsEvent.delete({
     *   where: {
     *     // ... filter to delete one AnalyticsEvent
     *   }
     * })
     * 
     */
    delete<T extends AnalyticsEventDeleteArgs>(args: SelectSubset<T, AnalyticsEventDeleteArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AnalyticsEvent.
     * @param {AnalyticsEventUpdateArgs} args - Arguments to update one AnalyticsEvent.
     * @example
     * // Update one AnalyticsEvent
     * const analyticsEvent = await prisma.analyticsEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalyticsEventUpdateArgs>(args: SelectSubset<T, AnalyticsEventUpdateArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AnalyticsEvents.
     * @param {AnalyticsEventDeleteManyArgs} args - Arguments to filter AnalyticsEvents to delete.
     * @example
     * // Delete a few AnalyticsEvents
     * const { count } = await prisma.analyticsEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalyticsEventDeleteManyArgs>(args?: SelectSubset<T, AnalyticsEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalyticsEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnalyticsEvents
     * const analyticsEvent = await prisma.analyticsEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalyticsEventUpdateManyArgs>(args: SelectSubset<T, AnalyticsEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AnalyticsEvent.
     * @param {AnalyticsEventUpsertArgs} args - Arguments to update or create a AnalyticsEvent.
     * @example
     * // Update or create a AnalyticsEvent
     * const analyticsEvent = await prisma.analyticsEvent.upsert({
     *   create: {
     *     // ... data to create a AnalyticsEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnalyticsEvent we want to update
     *   }
     * })
     */
    upsert<T extends AnalyticsEventUpsertArgs>(args: SelectSubset<T, AnalyticsEventUpsertArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AnalyticsEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsEventCountArgs} args - Arguments to filter AnalyticsEvents to count.
     * @example
     * // Count the number of AnalyticsEvents
     * const count = await prisma.analyticsEvent.count({
     *   where: {
     *     // ... the filter for the AnalyticsEvents we want to count
     *   }
     * })
    **/
    count<T extends AnalyticsEventCountArgs>(
      args?: Subset<T, AnalyticsEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalyticsEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnalyticsEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalyticsEventAggregateArgs>(args: Subset<T, AnalyticsEventAggregateArgs>): Prisma.PrismaPromise<GetAnalyticsEventAggregateType<T>>

    /**
     * Group by AnalyticsEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnalyticsEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalyticsEventGroupByArgs['orderBy'] }
        : { orderBy?: AnalyticsEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnalyticsEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalyticsEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnalyticsEvent model
   */
  readonly fields: AnalyticsEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnalyticsEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalyticsEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends AnalyticsEvent$userArgs<ExtArgs> = {}>(args?: Subset<T, AnalyticsEvent$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnalyticsEvent model
   */ 
  interface AnalyticsEventFieldRefs {
    readonly id: FieldRef<"AnalyticsEvent", 'String'>
    readonly eventName: FieldRef<"AnalyticsEvent", 'String'>
    readonly userId: FieldRef<"AnalyticsEvent", 'String'>
    readonly metadata: FieldRef<"AnalyticsEvent", 'Json'>
    readonly createdAt: FieldRef<"AnalyticsEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AnalyticsEvent findUnique
   */
  export type AnalyticsEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalyticsEvent to fetch.
     */
    where: AnalyticsEventWhereUniqueInput
  }

  /**
   * AnalyticsEvent findUniqueOrThrow
   */
  export type AnalyticsEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalyticsEvent to fetch.
     */
    where: AnalyticsEventWhereUniqueInput
  }

  /**
   * AnalyticsEvent findFirst
   */
  export type AnalyticsEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalyticsEvent to fetch.
     */
    where?: AnalyticsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalyticsEvents to fetch.
     */
    orderBy?: AnalyticsEventOrderByWithRelationInput | AnalyticsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalyticsEvents.
     */
    cursor?: AnalyticsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalyticsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalyticsEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalyticsEvents.
     */
    distinct?: AnalyticsEventScalarFieldEnum | AnalyticsEventScalarFieldEnum[]
  }

  /**
   * AnalyticsEvent findFirstOrThrow
   */
  export type AnalyticsEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalyticsEvent to fetch.
     */
    where?: AnalyticsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalyticsEvents to fetch.
     */
    orderBy?: AnalyticsEventOrderByWithRelationInput | AnalyticsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalyticsEvents.
     */
    cursor?: AnalyticsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalyticsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalyticsEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalyticsEvents.
     */
    distinct?: AnalyticsEventScalarFieldEnum | AnalyticsEventScalarFieldEnum[]
  }

  /**
   * AnalyticsEvent findMany
   */
  export type AnalyticsEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalyticsEvents to fetch.
     */
    where?: AnalyticsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalyticsEvents to fetch.
     */
    orderBy?: AnalyticsEventOrderByWithRelationInput | AnalyticsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnalyticsEvents.
     */
    cursor?: AnalyticsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalyticsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalyticsEvents.
     */
    skip?: number
    distinct?: AnalyticsEventScalarFieldEnum | AnalyticsEventScalarFieldEnum[]
  }

  /**
   * AnalyticsEvent create
   */
  export type AnalyticsEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * The data needed to create a AnalyticsEvent.
     */
    data: XOR<AnalyticsEventCreateInput, AnalyticsEventUncheckedCreateInput>
  }

  /**
   * AnalyticsEvent createMany
   */
  export type AnalyticsEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnalyticsEvents.
     */
    data: AnalyticsEventCreateManyInput | AnalyticsEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AnalyticsEvent createManyAndReturn
   */
  export type AnalyticsEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AnalyticsEvents.
     */
    data: AnalyticsEventCreateManyInput | AnalyticsEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnalyticsEvent update
   */
  export type AnalyticsEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * The data needed to update a AnalyticsEvent.
     */
    data: XOR<AnalyticsEventUpdateInput, AnalyticsEventUncheckedUpdateInput>
    /**
     * Choose, which AnalyticsEvent to update.
     */
    where: AnalyticsEventWhereUniqueInput
  }

  /**
   * AnalyticsEvent updateMany
   */
  export type AnalyticsEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnalyticsEvents.
     */
    data: XOR<AnalyticsEventUpdateManyMutationInput, AnalyticsEventUncheckedUpdateManyInput>
    /**
     * Filter which AnalyticsEvents to update
     */
    where?: AnalyticsEventWhereInput
  }

  /**
   * AnalyticsEvent upsert
   */
  export type AnalyticsEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * The filter to search for the AnalyticsEvent to update in case it exists.
     */
    where: AnalyticsEventWhereUniqueInput
    /**
     * In case the AnalyticsEvent found by the `where` argument doesn't exist, create a new AnalyticsEvent with this data.
     */
    create: XOR<AnalyticsEventCreateInput, AnalyticsEventUncheckedCreateInput>
    /**
     * In case the AnalyticsEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalyticsEventUpdateInput, AnalyticsEventUncheckedUpdateInput>
  }

  /**
   * AnalyticsEvent delete
   */
  export type AnalyticsEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * Filter which AnalyticsEvent to delete.
     */
    where: AnalyticsEventWhereUniqueInput
  }

  /**
   * AnalyticsEvent deleteMany
   */
  export type AnalyticsEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalyticsEvents to delete
     */
    where?: AnalyticsEventWhereInput
  }

  /**
   * AnalyticsEvent.user
   */
  export type AnalyticsEvent$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AnalyticsEvent without action
   */
  export type AnalyticsEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    phone: 'phone',
    password: 'password',
    nickname: 'nickname',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const IdeaScalarFieldEnum: {
    id: 'id',
    content: 'content',
    source: 'source',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type IdeaScalarFieldEnum = (typeof IdeaScalarFieldEnum)[keyof typeof IdeaScalarFieldEnum]


  export const TaskScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    status: 'status',
    category: 'category',
    dueDate: 'dueDate',
    ideaId: 'ideaId',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const CanvasScalarFieldEnum: {
    id: 'id',
    name: 'name',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type CanvasScalarFieldEnum = (typeof CanvasScalarFieldEnum)[keyof typeof CanvasScalarFieldEnum]


  export const CanvasNodeScalarFieldEnum: {
    id: 'id',
    canvasId: 'canvasId',
    ideaId: 'ideaId',
    x: 'x',
    y: 'y',
    width: 'width',
    height: 'height',
    content: 'content'
  };

  export type CanvasNodeScalarFieldEnum = (typeof CanvasNodeScalarFieldEnum)[keyof typeof CanvasNodeScalarFieldEnum]


  export const CanvasConnectionScalarFieldEnum: {
    id: 'id',
    canvasId: 'canvasId',
    fromNodeId: 'fromNodeId',
    toNodeId: 'toNodeId',
    label: 'label'
  };

  export type CanvasConnectionScalarFieldEnum = (typeof CanvasConnectionScalarFieldEnum)[keyof typeof CanvasConnectionScalarFieldEnum]


  export const AnalyticsEventScalarFieldEnum: {
    id: 'id',
    eventName: 'eventName',
    userId: 'userId',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type AnalyticsEventScalarFieldEnum = (typeof AnalyticsEventScalarFieldEnum)[keyof typeof AnalyticsEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'TaskStatus'
   */
  export type EnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus'>
    


  /**
   * Reference to a field of type 'TaskStatus[]'
   */
  export type ListEnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    nickname?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    ideas?: IdeaListRelationFilter
    tasks?: TaskListRelationFilter
    canvases?: CanvasListRelationFilter
    analyticsEvents?: AnalyticsEventListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    phone?: SortOrderInput | SortOrder
    password?: SortOrder
    nickname?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ideas?: IdeaOrderByRelationAggregateInput
    tasks?: TaskOrderByRelationAggregateInput
    canvases?: CanvasOrderByRelationAggregateInput
    analyticsEvents?: AnalyticsEventOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    phone?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    nickname?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    ideas?: IdeaListRelationFilter
    tasks?: TaskListRelationFilter
    canvases?: CanvasListRelationFilter
    analyticsEvents?: AnalyticsEventListRelationFilter
  }, "id" | "username" | "phone">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    phone?: SortOrderInput | SortOrder
    password?: SortOrder
    nickname?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    nickname?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type IdeaWhereInput = {
    AND?: IdeaWhereInput | IdeaWhereInput[]
    OR?: IdeaWhereInput[]
    NOT?: IdeaWhereInput | IdeaWhereInput[]
    id?: StringFilter<"Idea"> | string
    content?: StringFilter<"Idea"> | string
    source?: JsonNullableFilter<"Idea">
    userId?: StringFilter<"Idea"> | string
    createdAt?: DateTimeFilter<"Idea"> | Date | string
    updatedAt?: DateTimeFilter<"Idea"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Idea"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    tasks?: TaskListRelationFilter
    nodes?: CanvasNodeListRelationFilter
  }

  export type IdeaOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    source?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    tasks?: TaskOrderByRelationAggregateInput
    nodes?: CanvasNodeOrderByRelationAggregateInput
  }

  export type IdeaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: IdeaWhereInput | IdeaWhereInput[]
    OR?: IdeaWhereInput[]
    NOT?: IdeaWhereInput | IdeaWhereInput[]
    content?: StringFilter<"Idea"> | string
    source?: JsonNullableFilter<"Idea">
    userId?: StringFilter<"Idea"> | string
    createdAt?: DateTimeFilter<"Idea"> | Date | string
    updatedAt?: DateTimeFilter<"Idea"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Idea"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    tasks?: TaskListRelationFilter
    nodes?: CanvasNodeListRelationFilter
  }, "id">

  export type IdeaOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    source?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: IdeaCountOrderByAggregateInput
    _max?: IdeaMaxOrderByAggregateInput
    _min?: IdeaMinOrderByAggregateInput
  }

  export type IdeaScalarWhereWithAggregatesInput = {
    AND?: IdeaScalarWhereWithAggregatesInput | IdeaScalarWhereWithAggregatesInput[]
    OR?: IdeaScalarWhereWithAggregatesInput[]
    NOT?: IdeaScalarWhereWithAggregatesInput | IdeaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Idea"> | string
    content?: StringWithAggregatesFilter<"Idea"> | string
    source?: JsonNullableWithAggregatesFilter<"Idea">
    userId?: StringWithAggregatesFilter<"Idea"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Idea"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Idea"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Idea"> | Date | string | null
  }

  export type TaskWhereInput = {
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    id?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    category?: StringNullableFilter<"Task"> | string | null
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    ideaId?: StringNullableFilter<"Task"> | string | null
    userId?: StringFilter<"Task"> | string
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    idea?: XOR<IdeaNullableRelationFilter, IdeaWhereInput> | null
  }

  export type TaskOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    category?: SortOrderInput | SortOrder
    dueDate?: SortOrderInput | SortOrder
    ideaId?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    idea?: IdeaOrderByWithRelationInput
  }

  export type TaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    category?: StringNullableFilter<"Task"> | string | null
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    ideaId?: StringNullableFilter<"Task"> | string | null
    userId?: StringFilter<"Task"> | string
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    idea?: XOR<IdeaNullableRelationFilter, IdeaWhereInput> | null
  }, "id">

  export type TaskOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    category?: SortOrderInput | SortOrder
    dueDate?: SortOrderInput | SortOrder
    ideaId?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: TaskCountOrderByAggregateInput
    _max?: TaskMaxOrderByAggregateInput
    _min?: TaskMinOrderByAggregateInput
  }

  export type TaskScalarWhereWithAggregatesInput = {
    AND?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    OR?: TaskScalarWhereWithAggregatesInput[]
    NOT?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Task"> | string
    title?: StringWithAggregatesFilter<"Task"> | string
    description?: StringNullableWithAggregatesFilter<"Task"> | string | null
    status?: EnumTaskStatusWithAggregatesFilter<"Task"> | $Enums.TaskStatus
    category?: StringNullableWithAggregatesFilter<"Task"> | string | null
    dueDate?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    ideaId?: StringNullableWithAggregatesFilter<"Task"> | string | null
    userId?: StringWithAggregatesFilter<"Task"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
  }

  export type CanvasWhereInput = {
    AND?: CanvasWhereInput | CanvasWhereInput[]
    OR?: CanvasWhereInput[]
    NOT?: CanvasWhereInput | CanvasWhereInput[]
    id?: StringFilter<"Canvas"> | string
    name?: StringFilter<"Canvas"> | string
    userId?: StringFilter<"Canvas"> | string
    createdAt?: DateTimeFilter<"Canvas"> | Date | string
    updatedAt?: DateTimeFilter<"Canvas"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Canvas"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    nodes?: CanvasNodeListRelationFilter
    connections?: CanvasConnectionListRelationFilter
  }

  export type CanvasOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    nodes?: CanvasNodeOrderByRelationAggregateInput
    connections?: CanvasConnectionOrderByRelationAggregateInput
  }

  export type CanvasWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CanvasWhereInput | CanvasWhereInput[]
    OR?: CanvasWhereInput[]
    NOT?: CanvasWhereInput | CanvasWhereInput[]
    name?: StringFilter<"Canvas"> | string
    userId?: StringFilter<"Canvas"> | string
    createdAt?: DateTimeFilter<"Canvas"> | Date | string
    updatedAt?: DateTimeFilter<"Canvas"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Canvas"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    nodes?: CanvasNodeListRelationFilter
    connections?: CanvasConnectionListRelationFilter
  }, "id">

  export type CanvasOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: CanvasCountOrderByAggregateInput
    _max?: CanvasMaxOrderByAggregateInput
    _min?: CanvasMinOrderByAggregateInput
  }

  export type CanvasScalarWhereWithAggregatesInput = {
    AND?: CanvasScalarWhereWithAggregatesInput | CanvasScalarWhereWithAggregatesInput[]
    OR?: CanvasScalarWhereWithAggregatesInput[]
    NOT?: CanvasScalarWhereWithAggregatesInput | CanvasScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Canvas"> | string
    name?: StringWithAggregatesFilter<"Canvas"> | string
    userId?: StringWithAggregatesFilter<"Canvas"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Canvas"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Canvas"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Canvas"> | Date | string | null
  }

  export type CanvasNodeWhereInput = {
    AND?: CanvasNodeWhereInput | CanvasNodeWhereInput[]
    OR?: CanvasNodeWhereInput[]
    NOT?: CanvasNodeWhereInput | CanvasNodeWhereInput[]
    id?: StringFilter<"CanvasNode"> | string
    canvasId?: StringFilter<"CanvasNode"> | string
    ideaId?: StringNullableFilter<"CanvasNode"> | string | null
    x?: FloatFilter<"CanvasNode"> | number
    y?: FloatFilter<"CanvasNode"> | number
    width?: FloatFilter<"CanvasNode"> | number
    height?: FloatFilter<"CanvasNode"> | number
    content?: StringNullableFilter<"CanvasNode"> | string | null
    canvas?: XOR<CanvasRelationFilter, CanvasWhereInput>
    idea?: XOR<IdeaNullableRelationFilter, IdeaWhereInput> | null
    fromConnections?: CanvasConnectionListRelationFilter
    toConnections?: CanvasConnectionListRelationFilter
  }

  export type CanvasNodeOrderByWithRelationInput = {
    id?: SortOrder
    canvasId?: SortOrder
    ideaId?: SortOrderInput | SortOrder
    x?: SortOrder
    y?: SortOrder
    width?: SortOrder
    height?: SortOrder
    content?: SortOrderInput | SortOrder
    canvas?: CanvasOrderByWithRelationInput
    idea?: IdeaOrderByWithRelationInput
    fromConnections?: CanvasConnectionOrderByRelationAggregateInput
    toConnections?: CanvasConnectionOrderByRelationAggregateInput
  }

  export type CanvasNodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CanvasNodeWhereInput | CanvasNodeWhereInput[]
    OR?: CanvasNodeWhereInput[]
    NOT?: CanvasNodeWhereInput | CanvasNodeWhereInput[]
    canvasId?: StringFilter<"CanvasNode"> | string
    ideaId?: StringNullableFilter<"CanvasNode"> | string | null
    x?: FloatFilter<"CanvasNode"> | number
    y?: FloatFilter<"CanvasNode"> | number
    width?: FloatFilter<"CanvasNode"> | number
    height?: FloatFilter<"CanvasNode"> | number
    content?: StringNullableFilter<"CanvasNode"> | string | null
    canvas?: XOR<CanvasRelationFilter, CanvasWhereInput>
    idea?: XOR<IdeaNullableRelationFilter, IdeaWhereInput> | null
    fromConnections?: CanvasConnectionListRelationFilter
    toConnections?: CanvasConnectionListRelationFilter
  }, "id">

  export type CanvasNodeOrderByWithAggregationInput = {
    id?: SortOrder
    canvasId?: SortOrder
    ideaId?: SortOrderInput | SortOrder
    x?: SortOrder
    y?: SortOrder
    width?: SortOrder
    height?: SortOrder
    content?: SortOrderInput | SortOrder
    _count?: CanvasNodeCountOrderByAggregateInput
    _avg?: CanvasNodeAvgOrderByAggregateInput
    _max?: CanvasNodeMaxOrderByAggregateInput
    _min?: CanvasNodeMinOrderByAggregateInput
    _sum?: CanvasNodeSumOrderByAggregateInput
  }

  export type CanvasNodeScalarWhereWithAggregatesInput = {
    AND?: CanvasNodeScalarWhereWithAggregatesInput | CanvasNodeScalarWhereWithAggregatesInput[]
    OR?: CanvasNodeScalarWhereWithAggregatesInput[]
    NOT?: CanvasNodeScalarWhereWithAggregatesInput | CanvasNodeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CanvasNode"> | string
    canvasId?: StringWithAggregatesFilter<"CanvasNode"> | string
    ideaId?: StringNullableWithAggregatesFilter<"CanvasNode"> | string | null
    x?: FloatWithAggregatesFilter<"CanvasNode"> | number
    y?: FloatWithAggregatesFilter<"CanvasNode"> | number
    width?: FloatWithAggregatesFilter<"CanvasNode"> | number
    height?: FloatWithAggregatesFilter<"CanvasNode"> | number
    content?: StringNullableWithAggregatesFilter<"CanvasNode"> | string | null
  }

  export type CanvasConnectionWhereInput = {
    AND?: CanvasConnectionWhereInput | CanvasConnectionWhereInput[]
    OR?: CanvasConnectionWhereInput[]
    NOT?: CanvasConnectionWhereInput | CanvasConnectionWhereInput[]
    id?: StringFilter<"CanvasConnection"> | string
    canvasId?: StringFilter<"CanvasConnection"> | string
    fromNodeId?: StringFilter<"CanvasConnection"> | string
    toNodeId?: StringFilter<"CanvasConnection"> | string
    label?: StringNullableFilter<"CanvasConnection"> | string | null
    canvas?: XOR<CanvasRelationFilter, CanvasWhereInput>
    fromNode?: XOR<CanvasNodeRelationFilter, CanvasNodeWhereInput>
    toNode?: XOR<CanvasNodeRelationFilter, CanvasNodeWhereInput>
  }

  export type CanvasConnectionOrderByWithRelationInput = {
    id?: SortOrder
    canvasId?: SortOrder
    fromNodeId?: SortOrder
    toNodeId?: SortOrder
    label?: SortOrderInput | SortOrder
    canvas?: CanvasOrderByWithRelationInput
    fromNode?: CanvasNodeOrderByWithRelationInput
    toNode?: CanvasNodeOrderByWithRelationInput
  }

  export type CanvasConnectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CanvasConnectionWhereInput | CanvasConnectionWhereInput[]
    OR?: CanvasConnectionWhereInput[]
    NOT?: CanvasConnectionWhereInput | CanvasConnectionWhereInput[]
    canvasId?: StringFilter<"CanvasConnection"> | string
    fromNodeId?: StringFilter<"CanvasConnection"> | string
    toNodeId?: StringFilter<"CanvasConnection"> | string
    label?: StringNullableFilter<"CanvasConnection"> | string | null
    canvas?: XOR<CanvasRelationFilter, CanvasWhereInput>
    fromNode?: XOR<CanvasNodeRelationFilter, CanvasNodeWhereInput>
    toNode?: XOR<CanvasNodeRelationFilter, CanvasNodeWhereInput>
  }, "id">

  export type CanvasConnectionOrderByWithAggregationInput = {
    id?: SortOrder
    canvasId?: SortOrder
    fromNodeId?: SortOrder
    toNodeId?: SortOrder
    label?: SortOrderInput | SortOrder
    _count?: CanvasConnectionCountOrderByAggregateInput
    _max?: CanvasConnectionMaxOrderByAggregateInput
    _min?: CanvasConnectionMinOrderByAggregateInput
  }

  export type CanvasConnectionScalarWhereWithAggregatesInput = {
    AND?: CanvasConnectionScalarWhereWithAggregatesInput | CanvasConnectionScalarWhereWithAggregatesInput[]
    OR?: CanvasConnectionScalarWhereWithAggregatesInput[]
    NOT?: CanvasConnectionScalarWhereWithAggregatesInput | CanvasConnectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CanvasConnection"> | string
    canvasId?: StringWithAggregatesFilter<"CanvasConnection"> | string
    fromNodeId?: StringWithAggregatesFilter<"CanvasConnection"> | string
    toNodeId?: StringWithAggregatesFilter<"CanvasConnection"> | string
    label?: StringNullableWithAggregatesFilter<"CanvasConnection"> | string | null
  }

  export type AnalyticsEventWhereInput = {
    AND?: AnalyticsEventWhereInput | AnalyticsEventWhereInput[]
    OR?: AnalyticsEventWhereInput[]
    NOT?: AnalyticsEventWhereInput | AnalyticsEventWhereInput[]
    id?: StringFilter<"AnalyticsEvent"> | string
    eventName?: StringFilter<"AnalyticsEvent"> | string
    userId?: StringNullableFilter<"AnalyticsEvent"> | string | null
    metadata?: JsonNullableFilter<"AnalyticsEvent">
    createdAt?: DateTimeFilter<"AnalyticsEvent"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type AnalyticsEventOrderByWithRelationInput = {
    id?: SortOrder
    eventName?: SortOrder
    userId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AnalyticsEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AnalyticsEventWhereInput | AnalyticsEventWhereInput[]
    OR?: AnalyticsEventWhereInput[]
    NOT?: AnalyticsEventWhereInput | AnalyticsEventWhereInput[]
    eventName?: StringFilter<"AnalyticsEvent"> | string
    userId?: StringNullableFilter<"AnalyticsEvent"> | string | null
    metadata?: JsonNullableFilter<"AnalyticsEvent">
    createdAt?: DateTimeFilter<"AnalyticsEvent"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id">

  export type AnalyticsEventOrderByWithAggregationInput = {
    id?: SortOrder
    eventName?: SortOrder
    userId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AnalyticsEventCountOrderByAggregateInput
    _max?: AnalyticsEventMaxOrderByAggregateInput
    _min?: AnalyticsEventMinOrderByAggregateInput
  }

  export type AnalyticsEventScalarWhereWithAggregatesInput = {
    AND?: AnalyticsEventScalarWhereWithAggregatesInput | AnalyticsEventScalarWhereWithAggregatesInput[]
    OR?: AnalyticsEventScalarWhereWithAggregatesInput[]
    NOT?: AnalyticsEventScalarWhereWithAggregatesInput | AnalyticsEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnalyticsEvent"> | string
    eventName?: StringWithAggregatesFilter<"AnalyticsEvent"> | string
    userId?: StringNullableWithAggregatesFilter<"AnalyticsEvent"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"AnalyticsEvent">
    createdAt?: DateTimeWithAggregatesFilter<"AnalyticsEvent"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    username: string
    phone?: string | null
    password: string
    nickname?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ideas?: IdeaCreateNestedManyWithoutUserInput
    tasks?: TaskCreateNestedManyWithoutUserInput
    canvases?: CanvasCreateNestedManyWithoutUserInput
    analyticsEvents?: AnalyticsEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    phone?: string | null
    password: string
    nickname?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ideas?: IdeaUncheckedCreateNestedManyWithoutUserInput
    tasks?: TaskUncheckedCreateNestedManyWithoutUserInput
    canvases?: CanvasUncheckedCreateNestedManyWithoutUserInput
    analyticsEvents?: AnalyticsEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ideas?: IdeaUpdateManyWithoutUserNestedInput
    tasks?: TaskUpdateManyWithoutUserNestedInput
    canvases?: CanvasUpdateManyWithoutUserNestedInput
    analyticsEvents?: AnalyticsEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ideas?: IdeaUncheckedUpdateManyWithoutUserNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutUserNestedInput
    canvases?: CanvasUncheckedUpdateManyWithoutUserNestedInput
    analyticsEvents?: AnalyticsEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    phone?: string | null
    password: string
    nickname?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdeaCreateInput = {
    id?: string
    content: string
    source?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutIdeasInput
    tasks?: TaskCreateNestedManyWithoutIdeaInput
    nodes?: CanvasNodeCreateNestedManyWithoutIdeaInput
  }

  export type IdeaUncheckedCreateInput = {
    id?: string
    content: string
    source?: NullableJsonNullValueInput | InputJsonValue
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tasks?: TaskUncheckedCreateNestedManyWithoutIdeaInput
    nodes?: CanvasNodeUncheckedCreateNestedManyWithoutIdeaInput
  }

  export type IdeaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutIdeasNestedInput
    tasks?: TaskUpdateManyWithoutIdeaNestedInput
    nodes?: CanvasNodeUpdateManyWithoutIdeaNestedInput
  }

  export type IdeaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableJsonNullValueInput | InputJsonValue
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tasks?: TaskUncheckedUpdateManyWithoutIdeaNestedInput
    nodes?: CanvasNodeUncheckedUpdateManyWithoutIdeaNestedInput
  }

  export type IdeaCreateManyInput = {
    id?: string
    content: string
    source?: NullableJsonNullValueInput | InputJsonValue
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type IdeaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IdeaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableJsonNullValueInput | InputJsonValue
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskCreateInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    category?: string | null
    dueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutTasksInput
    idea?: IdeaCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    category?: string | null
    dueDate?: Date | string | null
    ideaId?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type TaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    category?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutTasksNestedInput
    idea?: IdeaUpdateOneWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    category?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ideaId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    category?: string | null
    dueDate?: Date | string | null
    ideaId?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type TaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    category?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    category?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ideaId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CanvasCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutCanvasesInput
    nodes?: CanvasNodeCreateNestedManyWithoutCanvasInput
    connections?: CanvasConnectionCreateNestedManyWithoutCanvasInput
  }

  export type CanvasUncheckedCreateInput = {
    id?: string
    name: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    nodes?: CanvasNodeUncheckedCreateNestedManyWithoutCanvasInput
    connections?: CanvasConnectionUncheckedCreateNestedManyWithoutCanvasInput
  }

  export type CanvasUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutCanvasesNestedInput
    nodes?: CanvasNodeUpdateManyWithoutCanvasNestedInput
    connections?: CanvasConnectionUpdateManyWithoutCanvasNestedInput
  }

  export type CanvasUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nodes?: CanvasNodeUncheckedUpdateManyWithoutCanvasNestedInput
    connections?: CanvasConnectionUncheckedUpdateManyWithoutCanvasNestedInput
  }

  export type CanvasCreateManyInput = {
    id?: string
    name: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type CanvasUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CanvasUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CanvasNodeCreateInput = {
    id?: string
    x: number
    y: number
    width?: number
    height?: number
    content?: string | null
    canvas: CanvasCreateNestedOneWithoutNodesInput
    idea?: IdeaCreateNestedOneWithoutNodesInput
    fromConnections?: CanvasConnectionCreateNestedManyWithoutFromNodeInput
    toConnections?: CanvasConnectionCreateNestedManyWithoutToNodeInput
  }

  export type CanvasNodeUncheckedCreateInput = {
    id?: string
    canvasId: string
    ideaId?: string | null
    x: number
    y: number
    width?: number
    height?: number
    content?: string | null
    fromConnections?: CanvasConnectionUncheckedCreateNestedManyWithoutFromNodeInput
    toConnections?: CanvasConnectionUncheckedCreateNestedManyWithoutToNodeInput
  }

  export type CanvasNodeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
    canvas?: CanvasUpdateOneRequiredWithoutNodesNestedInput
    idea?: IdeaUpdateOneWithoutNodesNestedInput
    fromConnections?: CanvasConnectionUpdateManyWithoutFromNodeNestedInput
    toConnections?: CanvasConnectionUpdateManyWithoutToNodeNestedInput
  }

  export type CanvasNodeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    canvasId?: StringFieldUpdateOperationsInput | string
    ideaId?: NullableStringFieldUpdateOperationsInput | string | null
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
    fromConnections?: CanvasConnectionUncheckedUpdateManyWithoutFromNodeNestedInput
    toConnections?: CanvasConnectionUncheckedUpdateManyWithoutToNodeNestedInput
  }

  export type CanvasNodeCreateManyInput = {
    id?: string
    canvasId: string
    ideaId?: string | null
    x: number
    y: number
    width?: number
    height?: number
    content?: string | null
  }

  export type CanvasNodeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CanvasNodeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    canvasId?: StringFieldUpdateOperationsInput | string
    ideaId?: NullableStringFieldUpdateOperationsInput | string | null
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CanvasConnectionCreateInput = {
    id?: string
    label?: string | null
    canvas: CanvasCreateNestedOneWithoutConnectionsInput
    fromNode: CanvasNodeCreateNestedOneWithoutFromConnectionsInput
    toNode: CanvasNodeCreateNestedOneWithoutToConnectionsInput
  }

  export type CanvasConnectionUncheckedCreateInput = {
    id?: string
    canvasId: string
    fromNodeId: string
    toNodeId: string
    label?: string | null
  }

  export type CanvasConnectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    canvas?: CanvasUpdateOneRequiredWithoutConnectionsNestedInput
    fromNode?: CanvasNodeUpdateOneRequiredWithoutFromConnectionsNestedInput
    toNode?: CanvasNodeUpdateOneRequiredWithoutToConnectionsNestedInput
  }

  export type CanvasConnectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    canvasId?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CanvasConnectionCreateManyInput = {
    id?: string
    canvasId: string
    fromNodeId: string
    toNodeId: string
    label?: string | null
  }

  export type CanvasConnectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CanvasConnectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    canvasId?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnalyticsEventCreateInput = {
    id?: string
    eventName: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutAnalyticsEventsInput
  }

  export type AnalyticsEventUncheckedCreateInput = {
    id?: string
    eventName: string
    userId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AnalyticsEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutAnalyticsEventsNestedInput
  }

  export type AnalyticsEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsEventCreateManyInput = {
    id?: string
    eventName: string
    userId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AnalyticsEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IdeaListRelationFilter = {
    every?: IdeaWhereInput
    some?: IdeaWhereInput
    none?: IdeaWhereInput
  }

  export type TaskListRelationFilter = {
    every?: TaskWhereInput
    some?: TaskWhereInput
    none?: TaskWhereInput
  }

  export type CanvasListRelationFilter = {
    every?: CanvasWhereInput
    some?: CanvasWhereInput
    none?: CanvasWhereInput
  }

  export type AnalyticsEventListRelationFilter = {
    every?: AnalyticsEventWhereInput
    some?: AnalyticsEventWhereInput
    none?: AnalyticsEventWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type IdeaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CanvasOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnalyticsEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    nickname?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    nickname?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    nickname?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CanvasNodeListRelationFilter = {
    every?: CanvasNodeWhereInput
    some?: CanvasNodeWhereInput
    none?: CanvasNodeWhereInput
  }

  export type CanvasNodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type IdeaCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    source?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type IdeaMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type IdeaMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type IdeaNullableRelationFilter = {
    is?: IdeaWhereInput | null
    isNot?: IdeaWhereInput | null
  }

  export type TaskCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    category?: SortOrder
    dueDate?: SortOrder
    ideaId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type TaskMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    category?: SortOrder
    dueDate?: SortOrder
    ideaId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type TaskMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    category?: SortOrder
    dueDate?: SortOrder
    ideaId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type EnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type CanvasConnectionListRelationFilter = {
    every?: CanvasConnectionWhereInput
    some?: CanvasConnectionWhereInput
    none?: CanvasConnectionWhereInput
  }

  export type CanvasConnectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CanvasCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type CanvasMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type CanvasMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type CanvasRelationFilter = {
    is?: CanvasWhereInput
    isNot?: CanvasWhereInput
  }

  export type CanvasNodeCountOrderByAggregateInput = {
    id?: SortOrder
    canvasId?: SortOrder
    ideaId?: SortOrder
    x?: SortOrder
    y?: SortOrder
    width?: SortOrder
    height?: SortOrder
    content?: SortOrder
  }

  export type CanvasNodeAvgOrderByAggregateInput = {
    x?: SortOrder
    y?: SortOrder
    width?: SortOrder
    height?: SortOrder
  }

  export type CanvasNodeMaxOrderByAggregateInput = {
    id?: SortOrder
    canvasId?: SortOrder
    ideaId?: SortOrder
    x?: SortOrder
    y?: SortOrder
    width?: SortOrder
    height?: SortOrder
    content?: SortOrder
  }

  export type CanvasNodeMinOrderByAggregateInput = {
    id?: SortOrder
    canvasId?: SortOrder
    ideaId?: SortOrder
    x?: SortOrder
    y?: SortOrder
    width?: SortOrder
    height?: SortOrder
    content?: SortOrder
  }

  export type CanvasNodeSumOrderByAggregateInput = {
    x?: SortOrder
    y?: SortOrder
    width?: SortOrder
    height?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type CanvasNodeRelationFilter = {
    is?: CanvasNodeWhereInput
    isNot?: CanvasNodeWhereInput
  }

  export type CanvasConnectionCountOrderByAggregateInput = {
    id?: SortOrder
    canvasId?: SortOrder
    fromNodeId?: SortOrder
    toNodeId?: SortOrder
    label?: SortOrder
  }

  export type CanvasConnectionMaxOrderByAggregateInput = {
    id?: SortOrder
    canvasId?: SortOrder
    fromNodeId?: SortOrder
    toNodeId?: SortOrder
    label?: SortOrder
  }

  export type CanvasConnectionMinOrderByAggregateInput = {
    id?: SortOrder
    canvasId?: SortOrder
    fromNodeId?: SortOrder
    toNodeId?: SortOrder
    label?: SortOrder
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type AnalyticsEventCountOrderByAggregateInput = {
    id?: SortOrder
    eventName?: SortOrder
    userId?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalyticsEventMaxOrderByAggregateInput = {
    id?: SortOrder
    eventName?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalyticsEventMinOrderByAggregateInput = {
    id?: SortOrder
    eventName?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type IdeaCreateNestedManyWithoutUserInput = {
    create?: XOR<IdeaCreateWithoutUserInput, IdeaUncheckedCreateWithoutUserInput> | IdeaCreateWithoutUserInput[] | IdeaUncheckedCreateWithoutUserInput[]
    connectOrCreate?: IdeaCreateOrConnectWithoutUserInput | IdeaCreateOrConnectWithoutUserInput[]
    createMany?: IdeaCreateManyUserInputEnvelope
    connect?: IdeaWhereUniqueInput | IdeaWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutUserInput = {
    create?: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput> | TaskCreateWithoutUserInput[] | TaskUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutUserInput | TaskCreateOrConnectWithoutUserInput[]
    createMany?: TaskCreateManyUserInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type CanvasCreateNestedManyWithoutUserInput = {
    create?: XOR<CanvasCreateWithoutUserInput, CanvasUncheckedCreateWithoutUserInput> | CanvasCreateWithoutUserInput[] | CanvasUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CanvasCreateOrConnectWithoutUserInput | CanvasCreateOrConnectWithoutUserInput[]
    createMany?: CanvasCreateManyUserInputEnvelope
    connect?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
  }

  export type AnalyticsEventCreateNestedManyWithoutUserInput = {
    create?: XOR<AnalyticsEventCreateWithoutUserInput, AnalyticsEventUncheckedCreateWithoutUserInput> | AnalyticsEventCreateWithoutUserInput[] | AnalyticsEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalyticsEventCreateOrConnectWithoutUserInput | AnalyticsEventCreateOrConnectWithoutUserInput[]
    createMany?: AnalyticsEventCreateManyUserInputEnvelope
    connect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
  }

  export type IdeaUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<IdeaCreateWithoutUserInput, IdeaUncheckedCreateWithoutUserInput> | IdeaCreateWithoutUserInput[] | IdeaUncheckedCreateWithoutUserInput[]
    connectOrCreate?: IdeaCreateOrConnectWithoutUserInput | IdeaCreateOrConnectWithoutUserInput[]
    createMany?: IdeaCreateManyUserInputEnvelope
    connect?: IdeaWhereUniqueInput | IdeaWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput> | TaskCreateWithoutUserInput[] | TaskUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutUserInput | TaskCreateOrConnectWithoutUserInput[]
    createMany?: TaskCreateManyUserInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type CanvasUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CanvasCreateWithoutUserInput, CanvasUncheckedCreateWithoutUserInput> | CanvasCreateWithoutUserInput[] | CanvasUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CanvasCreateOrConnectWithoutUserInput | CanvasCreateOrConnectWithoutUserInput[]
    createMany?: CanvasCreateManyUserInputEnvelope
    connect?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
  }

  export type AnalyticsEventUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AnalyticsEventCreateWithoutUserInput, AnalyticsEventUncheckedCreateWithoutUserInput> | AnalyticsEventCreateWithoutUserInput[] | AnalyticsEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalyticsEventCreateOrConnectWithoutUserInput | AnalyticsEventCreateOrConnectWithoutUserInput[]
    createMany?: AnalyticsEventCreateManyUserInputEnvelope
    connect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IdeaUpdateManyWithoutUserNestedInput = {
    create?: XOR<IdeaCreateWithoutUserInput, IdeaUncheckedCreateWithoutUserInput> | IdeaCreateWithoutUserInput[] | IdeaUncheckedCreateWithoutUserInput[]
    connectOrCreate?: IdeaCreateOrConnectWithoutUserInput | IdeaCreateOrConnectWithoutUserInput[]
    upsert?: IdeaUpsertWithWhereUniqueWithoutUserInput | IdeaUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: IdeaCreateManyUserInputEnvelope
    set?: IdeaWhereUniqueInput | IdeaWhereUniqueInput[]
    disconnect?: IdeaWhereUniqueInput | IdeaWhereUniqueInput[]
    delete?: IdeaWhereUniqueInput | IdeaWhereUniqueInput[]
    connect?: IdeaWhereUniqueInput | IdeaWhereUniqueInput[]
    update?: IdeaUpdateWithWhereUniqueWithoutUserInput | IdeaUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: IdeaUpdateManyWithWhereWithoutUserInput | IdeaUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: IdeaScalarWhereInput | IdeaScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutUserNestedInput = {
    create?: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput> | TaskCreateWithoutUserInput[] | TaskUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutUserInput | TaskCreateOrConnectWithoutUserInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutUserInput | TaskUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TaskCreateManyUserInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutUserInput | TaskUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutUserInput | TaskUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type CanvasUpdateManyWithoutUserNestedInput = {
    create?: XOR<CanvasCreateWithoutUserInput, CanvasUncheckedCreateWithoutUserInput> | CanvasCreateWithoutUserInput[] | CanvasUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CanvasCreateOrConnectWithoutUserInput | CanvasCreateOrConnectWithoutUserInput[]
    upsert?: CanvasUpsertWithWhereUniqueWithoutUserInput | CanvasUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CanvasCreateManyUserInputEnvelope
    set?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    disconnect?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    delete?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    connect?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    update?: CanvasUpdateWithWhereUniqueWithoutUserInput | CanvasUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CanvasUpdateManyWithWhereWithoutUserInput | CanvasUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CanvasScalarWhereInput | CanvasScalarWhereInput[]
  }

  export type AnalyticsEventUpdateManyWithoutUserNestedInput = {
    create?: XOR<AnalyticsEventCreateWithoutUserInput, AnalyticsEventUncheckedCreateWithoutUserInput> | AnalyticsEventCreateWithoutUserInput[] | AnalyticsEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalyticsEventCreateOrConnectWithoutUserInput | AnalyticsEventCreateOrConnectWithoutUserInput[]
    upsert?: AnalyticsEventUpsertWithWhereUniqueWithoutUserInput | AnalyticsEventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AnalyticsEventCreateManyUserInputEnvelope
    set?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    disconnect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    delete?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    connect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    update?: AnalyticsEventUpdateWithWhereUniqueWithoutUserInput | AnalyticsEventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AnalyticsEventUpdateManyWithWhereWithoutUserInput | AnalyticsEventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AnalyticsEventScalarWhereInput | AnalyticsEventScalarWhereInput[]
  }

  export type IdeaUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<IdeaCreateWithoutUserInput, IdeaUncheckedCreateWithoutUserInput> | IdeaCreateWithoutUserInput[] | IdeaUncheckedCreateWithoutUserInput[]
    connectOrCreate?: IdeaCreateOrConnectWithoutUserInput | IdeaCreateOrConnectWithoutUserInput[]
    upsert?: IdeaUpsertWithWhereUniqueWithoutUserInput | IdeaUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: IdeaCreateManyUserInputEnvelope
    set?: IdeaWhereUniqueInput | IdeaWhereUniqueInput[]
    disconnect?: IdeaWhereUniqueInput | IdeaWhereUniqueInput[]
    delete?: IdeaWhereUniqueInput | IdeaWhereUniqueInput[]
    connect?: IdeaWhereUniqueInput | IdeaWhereUniqueInput[]
    update?: IdeaUpdateWithWhereUniqueWithoutUserInput | IdeaUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: IdeaUpdateManyWithWhereWithoutUserInput | IdeaUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: IdeaScalarWhereInput | IdeaScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput> | TaskCreateWithoutUserInput[] | TaskUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutUserInput | TaskCreateOrConnectWithoutUserInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutUserInput | TaskUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TaskCreateManyUserInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutUserInput | TaskUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutUserInput | TaskUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type CanvasUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CanvasCreateWithoutUserInput, CanvasUncheckedCreateWithoutUserInput> | CanvasCreateWithoutUserInput[] | CanvasUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CanvasCreateOrConnectWithoutUserInput | CanvasCreateOrConnectWithoutUserInput[]
    upsert?: CanvasUpsertWithWhereUniqueWithoutUserInput | CanvasUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CanvasCreateManyUserInputEnvelope
    set?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    disconnect?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    delete?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    connect?: CanvasWhereUniqueInput | CanvasWhereUniqueInput[]
    update?: CanvasUpdateWithWhereUniqueWithoutUserInput | CanvasUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CanvasUpdateManyWithWhereWithoutUserInput | CanvasUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CanvasScalarWhereInput | CanvasScalarWhereInput[]
  }

  export type AnalyticsEventUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AnalyticsEventCreateWithoutUserInput, AnalyticsEventUncheckedCreateWithoutUserInput> | AnalyticsEventCreateWithoutUserInput[] | AnalyticsEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalyticsEventCreateOrConnectWithoutUserInput | AnalyticsEventCreateOrConnectWithoutUserInput[]
    upsert?: AnalyticsEventUpsertWithWhereUniqueWithoutUserInput | AnalyticsEventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AnalyticsEventCreateManyUserInputEnvelope
    set?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    disconnect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    delete?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    connect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    update?: AnalyticsEventUpdateWithWhereUniqueWithoutUserInput | AnalyticsEventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AnalyticsEventUpdateManyWithWhereWithoutUserInput | AnalyticsEventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AnalyticsEventScalarWhereInput | AnalyticsEventScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutIdeasInput = {
    create?: XOR<UserCreateWithoutIdeasInput, UserUncheckedCreateWithoutIdeasInput>
    connectOrCreate?: UserCreateOrConnectWithoutIdeasInput
    connect?: UserWhereUniqueInput
  }

  export type TaskCreateNestedManyWithoutIdeaInput = {
    create?: XOR<TaskCreateWithoutIdeaInput, TaskUncheckedCreateWithoutIdeaInput> | TaskCreateWithoutIdeaInput[] | TaskUncheckedCreateWithoutIdeaInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutIdeaInput | TaskCreateOrConnectWithoutIdeaInput[]
    createMany?: TaskCreateManyIdeaInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type CanvasNodeCreateNestedManyWithoutIdeaInput = {
    create?: XOR<CanvasNodeCreateWithoutIdeaInput, CanvasNodeUncheckedCreateWithoutIdeaInput> | CanvasNodeCreateWithoutIdeaInput[] | CanvasNodeUncheckedCreateWithoutIdeaInput[]
    connectOrCreate?: CanvasNodeCreateOrConnectWithoutIdeaInput | CanvasNodeCreateOrConnectWithoutIdeaInput[]
    createMany?: CanvasNodeCreateManyIdeaInputEnvelope
    connect?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutIdeaInput = {
    create?: XOR<TaskCreateWithoutIdeaInput, TaskUncheckedCreateWithoutIdeaInput> | TaskCreateWithoutIdeaInput[] | TaskUncheckedCreateWithoutIdeaInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutIdeaInput | TaskCreateOrConnectWithoutIdeaInput[]
    createMany?: TaskCreateManyIdeaInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type CanvasNodeUncheckedCreateNestedManyWithoutIdeaInput = {
    create?: XOR<CanvasNodeCreateWithoutIdeaInput, CanvasNodeUncheckedCreateWithoutIdeaInput> | CanvasNodeCreateWithoutIdeaInput[] | CanvasNodeUncheckedCreateWithoutIdeaInput[]
    connectOrCreate?: CanvasNodeCreateOrConnectWithoutIdeaInput | CanvasNodeCreateOrConnectWithoutIdeaInput[]
    createMany?: CanvasNodeCreateManyIdeaInputEnvelope
    connect?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutIdeasNestedInput = {
    create?: XOR<UserCreateWithoutIdeasInput, UserUncheckedCreateWithoutIdeasInput>
    connectOrCreate?: UserCreateOrConnectWithoutIdeasInput
    upsert?: UserUpsertWithoutIdeasInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutIdeasInput, UserUpdateWithoutIdeasInput>, UserUncheckedUpdateWithoutIdeasInput>
  }

  export type TaskUpdateManyWithoutIdeaNestedInput = {
    create?: XOR<TaskCreateWithoutIdeaInput, TaskUncheckedCreateWithoutIdeaInput> | TaskCreateWithoutIdeaInput[] | TaskUncheckedCreateWithoutIdeaInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutIdeaInput | TaskCreateOrConnectWithoutIdeaInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutIdeaInput | TaskUpsertWithWhereUniqueWithoutIdeaInput[]
    createMany?: TaskCreateManyIdeaInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutIdeaInput | TaskUpdateWithWhereUniqueWithoutIdeaInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutIdeaInput | TaskUpdateManyWithWhereWithoutIdeaInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type CanvasNodeUpdateManyWithoutIdeaNestedInput = {
    create?: XOR<CanvasNodeCreateWithoutIdeaInput, CanvasNodeUncheckedCreateWithoutIdeaInput> | CanvasNodeCreateWithoutIdeaInput[] | CanvasNodeUncheckedCreateWithoutIdeaInput[]
    connectOrCreate?: CanvasNodeCreateOrConnectWithoutIdeaInput | CanvasNodeCreateOrConnectWithoutIdeaInput[]
    upsert?: CanvasNodeUpsertWithWhereUniqueWithoutIdeaInput | CanvasNodeUpsertWithWhereUniqueWithoutIdeaInput[]
    createMany?: CanvasNodeCreateManyIdeaInputEnvelope
    set?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    disconnect?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    delete?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    connect?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    update?: CanvasNodeUpdateWithWhereUniqueWithoutIdeaInput | CanvasNodeUpdateWithWhereUniqueWithoutIdeaInput[]
    updateMany?: CanvasNodeUpdateManyWithWhereWithoutIdeaInput | CanvasNodeUpdateManyWithWhereWithoutIdeaInput[]
    deleteMany?: CanvasNodeScalarWhereInput | CanvasNodeScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutIdeaNestedInput = {
    create?: XOR<TaskCreateWithoutIdeaInput, TaskUncheckedCreateWithoutIdeaInput> | TaskCreateWithoutIdeaInput[] | TaskUncheckedCreateWithoutIdeaInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutIdeaInput | TaskCreateOrConnectWithoutIdeaInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutIdeaInput | TaskUpsertWithWhereUniqueWithoutIdeaInput[]
    createMany?: TaskCreateManyIdeaInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutIdeaInput | TaskUpdateWithWhereUniqueWithoutIdeaInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutIdeaInput | TaskUpdateManyWithWhereWithoutIdeaInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type CanvasNodeUncheckedUpdateManyWithoutIdeaNestedInput = {
    create?: XOR<CanvasNodeCreateWithoutIdeaInput, CanvasNodeUncheckedCreateWithoutIdeaInput> | CanvasNodeCreateWithoutIdeaInput[] | CanvasNodeUncheckedCreateWithoutIdeaInput[]
    connectOrCreate?: CanvasNodeCreateOrConnectWithoutIdeaInput | CanvasNodeCreateOrConnectWithoutIdeaInput[]
    upsert?: CanvasNodeUpsertWithWhereUniqueWithoutIdeaInput | CanvasNodeUpsertWithWhereUniqueWithoutIdeaInput[]
    createMany?: CanvasNodeCreateManyIdeaInputEnvelope
    set?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    disconnect?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    delete?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    connect?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    update?: CanvasNodeUpdateWithWhereUniqueWithoutIdeaInput | CanvasNodeUpdateWithWhereUniqueWithoutIdeaInput[]
    updateMany?: CanvasNodeUpdateManyWithWhereWithoutIdeaInput | CanvasNodeUpdateManyWithWhereWithoutIdeaInput[]
    deleteMany?: CanvasNodeScalarWhereInput | CanvasNodeScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTasksInput = {
    create?: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutTasksInput
    connect?: UserWhereUniqueInput
  }

  export type IdeaCreateNestedOneWithoutTasksInput = {
    create?: XOR<IdeaCreateWithoutTasksInput, IdeaUncheckedCreateWithoutTasksInput>
    connectOrCreate?: IdeaCreateOrConnectWithoutTasksInput
    connect?: IdeaWhereUniqueInput
  }

  export type EnumTaskStatusFieldUpdateOperationsInput = {
    set?: $Enums.TaskStatus
  }

  export type UserUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutTasksInput
    upsert?: UserUpsertWithoutTasksInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTasksInput, UserUpdateWithoutTasksInput>, UserUncheckedUpdateWithoutTasksInput>
  }

  export type IdeaUpdateOneWithoutTasksNestedInput = {
    create?: XOR<IdeaCreateWithoutTasksInput, IdeaUncheckedCreateWithoutTasksInput>
    connectOrCreate?: IdeaCreateOrConnectWithoutTasksInput
    upsert?: IdeaUpsertWithoutTasksInput
    disconnect?: IdeaWhereInput | boolean
    delete?: IdeaWhereInput | boolean
    connect?: IdeaWhereUniqueInput
    update?: XOR<XOR<IdeaUpdateToOneWithWhereWithoutTasksInput, IdeaUpdateWithoutTasksInput>, IdeaUncheckedUpdateWithoutTasksInput>
  }

  export type UserCreateNestedOneWithoutCanvasesInput = {
    create?: XOR<UserCreateWithoutCanvasesInput, UserUncheckedCreateWithoutCanvasesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCanvasesInput
    connect?: UserWhereUniqueInput
  }

  export type CanvasNodeCreateNestedManyWithoutCanvasInput = {
    create?: XOR<CanvasNodeCreateWithoutCanvasInput, CanvasNodeUncheckedCreateWithoutCanvasInput> | CanvasNodeCreateWithoutCanvasInput[] | CanvasNodeUncheckedCreateWithoutCanvasInput[]
    connectOrCreate?: CanvasNodeCreateOrConnectWithoutCanvasInput | CanvasNodeCreateOrConnectWithoutCanvasInput[]
    createMany?: CanvasNodeCreateManyCanvasInputEnvelope
    connect?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
  }

  export type CanvasConnectionCreateNestedManyWithoutCanvasInput = {
    create?: XOR<CanvasConnectionCreateWithoutCanvasInput, CanvasConnectionUncheckedCreateWithoutCanvasInput> | CanvasConnectionCreateWithoutCanvasInput[] | CanvasConnectionUncheckedCreateWithoutCanvasInput[]
    connectOrCreate?: CanvasConnectionCreateOrConnectWithoutCanvasInput | CanvasConnectionCreateOrConnectWithoutCanvasInput[]
    createMany?: CanvasConnectionCreateManyCanvasInputEnvelope
    connect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
  }

  export type CanvasNodeUncheckedCreateNestedManyWithoutCanvasInput = {
    create?: XOR<CanvasNodeCreateWithoutCanvasInput, CanvasNodeUncheckedCreateWithoutCanvasInput> | CanvasNodeCreateWithoutCanvasInput[] | CanvasNodeUncheckedCreateWithoutCanvasInput[]
    connectOrCreate?: CanvasNodeCreateOrConnectWithoutCanvasInput | CanvasNodeCreateOrConnectWithoutCanvasInput[]
    createMany?: CanvasNodeCreateManyCanvasInputEnvelope
    connect?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
  }

  export type CanvasConnectionUncheckedCreateNestedManyWithoutCanvasInput = {
    create?: XOR<CanvasConnectionCreateWithoutCanvasInput, CanvasConnectionUncheckedCreateWithoutCanvasInput> | CanvasConnectionCreateWithoutCanvasInput[] | CanvasConnectionUncheckedCreateWithoutCanvasInput[]
    connectOrCreate?: CanvasConnectionCreateOrConnectWithoutCanvasInput | CanvasConnectionCreateOrConnectWithoutCanvasInput[]
    createMany?: CanvasConnectionCreateManyCanvasInputEnvelope
    connect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutCanvasesNestedInput = {
    create?: XOR<UserCreateWithoutCanvasesInput, UserUncheckedCreateWithoutCanvasesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCanvasesInput
    upsert?: UserUpsertWithoutCanvasesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCanvasesInput, UserUpdateWithoutCanvasesInput>, UserUncheckedUpdateWithoutCanvasesInput>
  }

  export type CanvasNodeUpdateManyWithoutCanvasNestedInput = {
    create?: XOR<CanvasNodeCreateWithoutCanvasInput, CanvasNodeUncheckedCreateWithoutCanvasInput> | CanvasNodeCreateWithoutCanvasInput[] | CanvasNodeUncheckedCreateWithoutCanvasInput[]
    connectOrCreate?: CanvasNodeCreateOrConnectWithoutCanvasInput | CanvasNodeCreateOrConnectWithoutCanvasInput[]
    upsert?: CanvasNodeUpsertWithWhereUniqueWithoutCanvasInput | CanvasNodeUpsertWithWhereUniqueWithoutCanvasInput[]
    createMany?: CanvasNodeCreateManyCanvasInputEnvelope
    set?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    disconnect?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    delete?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    connect?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    update?: CanvasNodeUpdateWithWhereUniqueWithoutCanvasInput | CanvasNodeUpdateWithWhereUniqueWithoutCanvasInput[]
    updateMany?: CanvasNodeUpdateManyWithWhereWithoutCanvasInput | CanvasNodeUpdateManyWithWhereWithoutCanvasInput[]
    deleteMany?: CanvasNodeScalarWhereInput | CanvasNodeScalarWhereInput[]
  }

  export type CanvasConnectionUpdateManyWithoutCanvasNestedInput = {
    create?: XOR<CanvasConnectionCreateWithoutCanvasInput, CanvasConnectionUncheckedCreateWithoutCanvasInput> | CanvasConnectionCreateWithoutCanvasInput[] | CanvasConnectionUncheckedCreateWithoutCanvasInput[]
    connectOrCreate?: CanvasConnectionCreateOrConnectWithoutCanvasInput | CanvasConnectionCreateOrConnectWithoutCanvasInput[]
    upsert?: CanvasConnectionUpsertWithWhereUniqueWithoutCanvasInput | CanvasConnectionUpsertWithWhereUniqueWithoutCanvasInput[]
    createMany?: CanvasConnectionCreateManyCanvasInputEnvelope
    set?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    disconnect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    delete?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    connect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    update?: CanvasConnectionUpdateWithWhereUniqueWithoutCanvasInput | CanvasConnectionUpdateWithWhereUniqueWithoutCanvasInput[]
    updateMany?: CanvasConnectionUpdateManyWithWhereWithoutCanvasInput | CanvasConnectionUpdateManyWithWhereWithoutCanvasInput[]
    deleteMany?: CanvasConnectionScalarWhereInput | CanvasConnectionScalarWhereInput[]
  }

  export type CanvasNodeUncheckedUpdateManyWithoutCanvasNestedInput = {
    create?: XOR<CanvasNodeCreateWithoutCanvasInput, CanvasNodeUncheckedCreateWithoutCanvasInput> | CanvasNodeCreateWithoutCanvasInput[] | CanvasNodeUncheckedCreateWithoutCanvasInput[]
    connectOrCreate?: CanvasNodeCreateOrConnectWithoutCanvasInput | CanvasNodeCreateOrConnectWithoutCanvasInput[]
    upsert?: CanvasNodeUpsertWithWhereUniqueWithoutCanvasInput | CanvasNodeUpsertWithWhereUniqueWithoutCanvasInput[]
    createMany?: CanvasNodeCreateManyCanvasInputEnvelope
    set?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    disconnect?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    delete?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    connect?: CanvasNodeWhereUniqueInput | CanvasNodeWhereUniqueInput[]
    update?: CanvasNodeUpdateWithWhereUniqueWithoutCanvasInput | CanvasNodeUpdateWithWhereUniqueWithoutCanvasInput[]
    updateMany?: CanvasNodeUpdateManyWithWhereWithoutCanvasInput | CanvasNodeUpdateManyWithWhereWithoutCanvasInput[]
    deleteMany?: CanvasNodeScalarWhereInput | CanvasNodeScalarWhereInput[]
  }

  export type CanvasConnectionUncheckedUpdateManyWithoutCanvasNestedInput = {
    create?: XOR<CanvasConnectionCreateWithoutCanvasInput, CanvasConnectionUncheckedCreateWithoutCanvasInput> | CanvasConnectionCreateWithoutCanvasInput[] | CanvasConnectionUncheckedCreateWithoutCanvasInput[]
    connectOrCreate?: CanvasConnectionCreateOrConnectWithoutCanvasInput | CanvasConnectionCreateOrConnectWithoutCanvasInput[]
    upsert?: CanvasConnectionUpsertWithWhereUniqueWithoutCanvasInput | CanvasConnectionUpsertWithWhereUniqueWithoutCanvasInput[]
    createMany?: CanvasConnectionCreateManyCanvasInputEnvelope
    set?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    disconnect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    delete?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    connect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    update?: CanvasConnectionUpdateWithWhereUniqueWithoutCanvasInput | CanvasConnectionUpdateWithWhereUniqueWithoutCanvasInput[]
    updateMany?: CanvasConnectionUpdateManyWithWhereWithoutCanvasInput | CanvasConnectionUpdateManyWithWhereWithoutCanvasInput[]
    deleteMany?: CanvasConnectionScalarWhereInput | CanvasConnectionScalarWhereInput[]
  }

  export type CanvasCreateNestedOneWithoutNodesInput = {
    create?: XOR<CanvasCreateWithoutNodesInput, CanvasUncheckedCreateWithoutNodesInput>
    connectOrCreate?: CanvasCreateOrConnectWithoutNodesInput
    connect?: CanvasWhereUniqueInput
  }

  export type IdeaCreateNestedOneWithoutNodesInput = {
    create?: XOR<IdeaCreateWithoutNodesInput, IdeaUncheckedCreateWithoutNodesInput>
    connectOrCreate?: IdeaCreateOrConnectWithoutNodesInput
    connect?: IdeaWhereUniqueInput
  }

  export type CanvasConnectionCreateNestedManyWithoutFromNodeInput = {
    create?: XOR<CanvasConnectionCreateWithoutFromNodeInput, CanvasConnectionUncheckedCreateWithoutFromNodeInput> | CanvasConnectionCreateWithoutFromNodeInput[] | CanvasConnectionUncheckedCreateWithoutFromNodeInput[]
    connectOrCreate?: CanvasConnectionCreateOrConnectWithoutFromNodeInput | CanvasConnectionCreateOrConnectWithoutFromNodeInput[]
    createMany?: CanvasConnectionCreateManyFromNodeInputEnvelope
    connect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
  }

  export type CanvasConnectionCreateNestedManyWithoutToNodeInput = {
    create?: XOR<CanvasConnectionCreateWithoutToNodeInput, CanvasConnectionUncheckedCreateWithoutToNodeInput> | CanvasConnectionCreateWithoutToNodeInput[] | CanvasConnectionUncheckedCreateWithoutToNodeInput[]
    connectOrCreate?: CanvasConnectionCreateOrConnectWithoutToNodeInput | CanvasConnectionCreateOrConnectWithoutToNodeInput[]
    createMany?: CanvasConnectionCreateManyToNodeInputEnvelope
    connect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
  }

  export type CanvasConnectionUncheckedCreateNestedManyWithoutFromNodeInput = {
    create?: XOR<CanvasConnectionCreateWithoutFromNodeInput, CanvasConnectionUncheckedCreateWithoutFromNodeInput> | CanvasConnectionCreateWithoutFromNodeInput[] | CanvasConnectionUncheckedCreateWithoutFromNodeInput[]
    connectOrCreate?: CanvasConnectionCreateOrConnectWithoutFromNodeInput | CanvasConnectionCreateOrConnectWithoutFromNodeInput[]
    createMany?: CanvasConnectionCreateManyFromNodeInputEnvelope
    connect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
  }

  export type CanvasConnectionUncheckedCreateNestedManyWithoutToNodeInput = {
    create?: XOR<CanvasConnectionCreateWithoutToNodeInput, CanvasConnectionUncheckedCreateWithoutToNodeInput> | CanvasConnectionCreateWithoutToNodeInput[] | CanvasConnectionUncheckedCreateWithoutToNodeInput[]
    connectOrCreate?: CanvasConnectionCreateOrConnectWithoutToNodeInput | CanvasConnectionCreateOrConnectWithoutToNodeInput[]
    createMany?: CanvasConnectionCreateManyToNodeInputEnvelope
    connect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CanvasUpdateOneRequiredWithoutNodesNestedInput = {
    create?: XOR<CanvasCreateWithoutNodesInput, CanvasUncheckedCreateWithoutNodesInput>
    connectOrCreate?: CanvasCreateOrConnectWithoutNodesInput
    upsert?: CanvasUpsertWithoutNodesInput
    connect?: CanvasWhereUniqueInput
    update?: XOR<XOR<CanvasUpdateToOneWithWhereWithoutNodesInput, CanvasUpdateWithoutNodesInput>, CanvasUncheckedUpdateWithoutNodesInput>
  }

  export type IdeaUpdateOneWithoutNodesNestedInput = {
    create?: XOR<IdeaCreateWithoutNodesInput, IdeaUncheckedCreateWithoutNodesInput>
    connectOrCreate?: IdeaCreateOrConnectWithoutNodesInput
    upsert?: IdeaUpsertWithoutNodesInput
    disconnect?: IdeaWhereInput | boolean
    delete?: IdeaWhereInput | boolean
    connect?: IdeaWhereUniqueInput
    update?: XOR<XOR<IdeaUpdateToOneWithWhereWithoutNodesInput, IdeaUpdateWithoutNodesInput>, IdeaUncheckedUpdateWithoutNodesInput>
  }

  export type CanvasConnectionUpdateManyWithoutFromNodeNestedInput = {
    create?: XOR<CanvasConnectionCreateWithoutFromNodeInput, CanvasConnectionUncheckedCreateWithoutFromNodeInput> | CanvasConnectionCreateWithoutFromNodeInput[] | CanvasConnectionUncheckedCreateWithoutFromNodeInput[]
    connectOrCreate?: CanvasConnectionCreateOrConnectWithoutFromNodeInput | CanvasConnectionCreateOrConnectWithoutFromNodeInput[]
    upsert?: CanvasConnectionUpsertWithWhereUniqueWithoutFromNodeInput | CanvasConnectionUpsertWithWhereUniqueWithoutFromNodeInput[]
    createMany?: CanvasConnectionCreateManyFromNodeInputEnvelope
    set?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    disconnect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    delete?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    connect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    update?: CanvasConnectionUpdateWithWhereUniqueWithoutFromNodeInput | CanvasConnectionUpdateWithWhereUniqueWithoutFromNodeInput[]
    updateMany?: CanvasConnectionUpdateManyWithWhereWithoutFromNodeInput | CanvasConnectionUpdateManyWithWhereWithoutFromNodeInput[]
    deleteMany?: CanvasConnectionScalarWhereInput | CanvasConnectionScalarWhereInput[]
  }

  export type CanvasConnectionUpdateManyWithoutToNodeNestedInput = {
    create?: XOR<CanvasConnectionCreateWithoutToNodeInput, CanvasConnectionUncheckedCreateWithoutToNodeInput> | CanvasConnectionCreateWithoutToNodeInput[] | CanvasConnectionUncheckedCreateWithoutToNodeInput[]
    connectOrCreate?: CanvasConnectionCreateOrConnectWithoutToNodeInput | CanvasConnectionCreateOrConnectWithoutToNodeInput[]
    upsert?: CanvasConnectionUpsertWithWhereUniqueWithoutToNodeInput | CanvasConnectionUpsertWithWhereUniqueWithoutToNodeInput[]
    createMany?: CanvasConnectionCreateManyToNodeInputEnvelope
    set?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    disconnect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    delete?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    connect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    update?: CanvasConnectionUpdateWithWhereUniqueWithoutToNodeInput | CanvasConnectionUpdateWithWhereUniqueWithoutToNodeInput[]
    updateMany?: CanvasConnectionUpdateManyWithWhereWithoutToNodeInput | CanvasConnectionUpdateManyWithWhereWithoutToNodeInput[]
    deleteMany?: CanvasConnectionScalarWhereInput | CanvasConnectionScalarWhereInput[]
  }

  export type CanvasConnectionUncheckedUpdateManyWithoutFromNodeNestedInput = {
    create?: XOR<CanvasConnectionCreateWithoutFromNodeInput, CanvasConnectionUncheckedCreateWithoutFromNodeInput> | CanvasConnectionCreateWithoutFromNodeInput[] | CanvasConnectionUncheckedCreateWithoutFromNodeInput[]
    connectOrCreate?: CanvasConnectionCreateOrConnectWithoutFromNodeInput | CanvasConnectionCreateOrConnectWithoutFromNodeInput[]
    upsert?: CanvasConnectionUpsertWithWhereUniqueWithoutFromNodeInput | CanvasConnectionUpsertWithWhereUniqueWithoutFromNodeInput[]
    createMany?: CanvasConnectionCreateManyFromNodeInputEnvelope
    set?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    disconnect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    delete?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    connect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    update?: CanvasConnectionUpdateWithWhereUniqueWithoutFromNodeInput | CanvasConnectionUpdateWithWhereUniqueWithoutFromNodeInput[]
    updateMany?: CanvasConnectionUpdateManyWithWhereWithoutFromNodeInput | CanvasConnectionUpdateManyWithWhereWithoutFromNodeInput[]
    deleteMany?: CanvasConnectionScalarWhereInput | CanvasConnectionScalarWhereInput[]
  }

  export type CanvasConnectionUncheckedUpdateManyWithoutToNodeNestedInput = {
    create?: XOR<CanvasConnectionCreateWithoutToNodeInput, CanvasConnectionUncheckedCreateWithoutToNodeInput> | CanvasConnectionCreateWithoutToNodeInput[] | CanvasConnectionUncheckedCreateWithoutToNodeInput[]
    connectOrCreate?: CanvasConnectionCreateOrConnectWithoutToNodeInput | CanvasConnectionCreateOrConnectWithoutToNodeInput[]
    upsert?: CanvasConnectionUpsertWithWhereUniqueWithoutToNodeInput | CanvasConnectionUpsertWithWhereUniqueWithoutToNodeInput[]
    createMany?: CanvasConnectionCreateManyToNodeInputEnvelope
    set?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    disconnect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    delete?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    connect?: CanvasConnectionWhereUniqueInput | CanvasConnectionWhereUniqueInput[]
    update?: CanvasConnectionUpdateWithWhereUniqueWithoutToNodeInput | CanvasConnectionUpdateWithWhereUniqueWithoutToNodeInput[]
    updateMany?: CanvasConnectionUpdateManyWithWhereWithoutToNodeInput | CanvasConnectionUpdateManyWithWhereWithoutToNodeInput[]
    deleteMany?: CanvasConnectionScalarWhereInput | CanvasConnectionScalarWhereInput[]
  }

  export type CanvasCreateNestedOneWithoutConnectionsInput = {
    create?: XOR<CanvasCreateWithoutConnectionsInput, CanvasUncheckedCreateWithoutConnectionsInput>
    connectOrCreate?: CanvasCreateOrConnectWithoutConnectionsInput
    connect?: CanvasWhereUniqueInput
  }

  export type CanvasNodeCreateNestedOneWithoutFromConnectionsInput = {
    create?: XOR<CanvasNodeCreateWithoutFromConnectionsInput, CanvasNodeUncheckedCreateWithoutFromConnectionsInput>
    connectOrCreate?: CanvasNodeCreateOrConnectWithoutFromConnectionsInput
    connect?: CanvasNodeWhereUniqueInput
  }

  export type CanvasNodeCreateNestedOneWithoutToConnectionsInput = {
    create?: XOR<CanvasNodeCreateWithoutToConnectionsInput, CanvasNodeUncheckedCreateWithoutToConnectionsInput>
    connectOrCreate?: CanvasNodeCreateOrConnectWithoutToConnectionsInput
    connect?: CanvasNodeWhereUniqueInput
  }

  export type CanvasUpdateOneRequiredWithoutConnectionsNestedInput = {
    create?: XOR<CanvasCreateWithoutConnectionsInput, CanvasUncheckedCreateWithoutConnectionsInput>
    connectOrCreate?: CanvasCreateOrConnectWithoutConnectionsInput
    upsert?: CanvasUpsertWithoutConnectionsInput
    connect?: CanvasWhereUniqueInput
    update?: XOR<XOR<CanvasUpdateToOneWithWhereWithoutConnectionsInput, CanvasUpdateWithoutConnectionsInput>, CanvasUncheckedUpdateWithoutConnectionsInput>
  }

  export type CanvasNodeUpdateOneRequiredWithoutFromConnectionsNestedInput = {
    create?: XOR<CanvasNodeCreateWithoutFromConnectionsInput, CanvasNodeUncheckedCreateWithoutFromConnectionsInput>
    connectOrCreate?: CanvasNodeCreateOrConnectWithoutFromConnectionsInput
    upsert?: CanvasNodeUpsertWithoutFromConnectionsInput
    connect?: CanvasNodeWhereUniqueInput
    update?: XOR<XOR<CanvasNodeUpdateToOneWithWhereWithoutFromConnectionsInput, CanvasNodeUpdateWithoutFromConnectionsInput>, CanvasNodeUncheckedUpdateWithoutFromConnectionsInput>
  }

  export type CanvasNodeUpdateOneRequiredWithoutToConnectionsNestedInput = {
    create?: XOR<CanvasNodeCreateWithoutToConnectionsInput, CanvasNodeUncheckedCreateWithoutToConnectionsInput>
    connectOrCreate?: CanvasNodeCreateOrConnectWithoutToConnectionsInput
    upsert?: CanvasNodeUpsertWithoutToConnectionsInput
    connect?: CanvasNodeWhereUniqueInput
    update?: XOR<XOR<CanvasNodeUpdateToOneWithWhereWithoutToConnectionsInput, CanvasNodeUpdateWithoutToConnectionsInput>, CanvasNodeUncheckedUpdateWithoutToConnectionsInput>
  }

  export type UserCreateNestedOneWithoutAnalyticsEventsInput = {
    create?: XOR<UserCreateWithoutAnalyticsEventsInput, UserUncheckedCreateWithoutAnalyticsEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAnalyticsEventsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutAnalyticsEventsNestedInput = {
    create?: XOR<UserCreateWithoutAnalyticsEventsInput, UserUncheckedCreateWithoutAnalyticsEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAnalyticsEventsInput
    upsert?: UserUpsertWithoutAnalyticsEventsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAnalyticsEventsInput, UserUpdateWithoutAnalyticsEventsInput>, UserUncheckedUpdateWithoutAnalyticsEventsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IdeaCreateWithoutUserInput = {
    id?: string
    content: string
    source?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tasks?: TaskCreateNestedManyWithoutIdeaInput
    nodes?: CanvasNodeCreateNestedManyWithoutIdeaInput
  }

  export type IdeaUncheckedCreateWithoutUserInput = {
    id?: string
    content: string
    source?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tasks?: TaskUncheckedCreateNestedManyWithoutIdeaInput
    nodes?: CanvasNodeUncheckedCreateNestedManyWithoutIdeaInput
  }

  export type IdeaCreateOrConnectWithoutUserInput = {
    where: IdeaWhereUniqueInput
    create: XOR<IdeaCreateWithoutUserInput, IdeaUncheckedCreateWithoutUserInput>
  }

  export type IdeaCreateManyUserInputEnvelope = {
    data: IdeaCreateManyUserInput | IdeaCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutUserInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    category?: string | null
    dueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    idea?: IdeaCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    category?: string | null
    dueDate?: Date | string | null
    ideaId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type TaskCreateOrConnectWithoutUserInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput>
  }

  export type TaskCreateManyUserInputEnvelope = {
    data: TaskCreateManyUserInput | TaskCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CanvasCreateWithoutUserInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    nodes?: CanvasNodeCreateNestedManyWithoutCanvasInput
    connections?: CanvasConnectionCreateNestedManyWithoutCanvasInput
  }

  export type CanvasUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    nodes?: CanvasNodeUncheckedCreateNestedManyWithoutCanvasInput
    connections?: CanvasConnectionUncheckedCreateNestedManyWithoutCanvasInput
  }

  export type CanvasCreateOrConnectWithoutUserInput = {
    where: CanvasWhereUniqueInput
    create: XOR<CanvasCreateWithoutUserInput, CanvasUncheckedCreateWithoutUserInput>
  }

  export type CanvasCreateManyUserInputEnvelope = {
    data: CanvasCreateManyUserInput | CanvasCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AnalyticsEventCreateWithoutUserInput = {
    id?: string
    eventName: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AnalyticsEventUncheckedCreateWithoutUserInput = {
    id?: string
    eventName: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AnalyticsEventCreateOrConnectWithoutUserInput = {
    where: AnalyticsEventWhereUniqueInput
    create: XOR<AnalyticsEventCreateWithoutUserInput, AnalyticsEventUncheckedCreateWithoutUserInput>
  }

  export type AnalyticsEventCreateManyUserInputEnvelope = {
    data: AnalyticsEventCreateManyUserInput | AnalyticsEventCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type IdeaUpsertWithWhereUniqueWithoutUserInput = {
    where: IdeaWhereUniqueInput
    update: XOR<IdeaUpdateWithoutUserInput, IdeaUncheckedUpdateWithoutUserInput>
    create: XOR<IdeaCreateWithoutUserInput, IdeaUncheckedCreateWithoutUserInput>
  }

  export type IdeaUpdateWithWhereUniqueWithoutUserInput = {
    where: IdeaWhereUniqueInput
    data: XOR<IdeaUpdateWithoutUserInput, IdeaUncheckedUpdateWithoutUserInput>
  }

  export type IdeaUpdateManyWithWhereWithoutUserInput = {
    where: IdeaScalarWhereInput
    data: XOR<IdeaUpdateManyMutationInput, IdeaUncheckedUpdateManyWithoutUserInput>
  }

  export type IdeaScalarWhereInput = {
    AND?: IdeaScalarWhereInput | IdeaScalarWhereInput[]
    OR?: IdeaScalarWhereInput[]
    NOT?: IdeaScalarWhereInput | IdeaScalarWhereInput[]
    id?: StringFilter<"Idea"> | string
    content?: StringFilter<"Idea"> | string
    source?: JsonNullableFilter<"Idea">
    userId?: StringFilter<"Idea"> | string
    createdAt?: DateTimeFilter<"Idea"> | Date | string
    updatedAt?: DateTimeFilter<"Idea"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Idea"> | Date | string | null
  }

  export type TaskUpsertWithWhereUniqueWithoutUserInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutUserInput, TaskUncheckedUpdateWithoutUserInput>
    create: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutUserInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutUserInput, TaskUncheckedUpdateWithoutUserInput>
  }

  export type TaskUpdateManyWithWhereWithoutUserInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutUserInput>
  }

  export type TaskScalarWhereInput = {
    AND?: TaskScalarWhereInput | TaskScalarWhereInput[]
    OR?: TaskScalarWhereInput[]
    NOT?: TaskScalarWhereInput | TaskScalarWhereInput[]
    id?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    category?: StringNullableFilter<"Task"> | string | null
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    ideaId?: StringNullableFilter<"Task"> | string | null
    userId?: StringFilter<"Task"> | string
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
  }

  export type CanvasUpsertWithWhereUniqueWithoutUserInput = {
    where: CanvasWhereUniqueInput
    update: XOR<CanvasUpdateWithoutUserInput, CanvasUncheckedUpdateWithoutUserInput>
    create: XOR<CanvasCreateWithoutUserInput, CanvasUncheckedCreateWithoutUserInput>
  }

  export type CanvasUpdateWithWhereUniqueWithoutUserInput = {
    where: CanvasWhereUniqueInput
    data: XOR<CanvasUpdateWithoutUserInput, CanvasUncheckedUpdateWithoutUserInput>
  }

  export type CanvasUpdateManyWithWhereWithoutUserInput = {
    where: CanvasScalarWhereInput
    data: XOR<CanvasUpdateManyMutationInput, CanvasUncheckedUpdateManyWithoutUserInput>
  }

  export type CanvasScalarWhereInput = {
    AND?: CanvasScalarWhereInput | CanvasScalarWhereInput[]
    OR?: CanvasScalarWhereInput[]
    NOT?: CanvasScalarWhereInput | CanvasScalarWhereInput[]
    id?: StringFilter<"Canvas"> | string
    name?: StringFilter<"Canvas"> | string
    userId?: StringFilter<"Canvas"> | string
    createdAt?: DateTimeFilter<"Canvas"> | Date | string
    updatedAt?: DateTimeFilter<"Canvas"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Canvas"> | Date | string | null
  }

  export type AnalyticsEventUpsertWithWhereUniqueWithoutUserInput = {
    where: AnalyticsEventWhereUniqueInput
    update: XOR<AnalyticsEventUpdateWithoutUserInput, AnalyticsEventUncheckedUpdateWithoutUserInput>
    create: XOR<AnalyticsEventCreateWithoutUserInput, AnalyticsEventUncheckedCreateWithoutUserInput>
  }

  export type AnalyticsEventUpdateWithWhereUniqueWithoutUserInput = {
    where: AnalyticsEventWhereUniqueInput
    data: XOR<AnalyticsEventUpdateWithoutUserInput, AnalyticsEventUncheckedUpdateWithoutUserInput>
  }

  export type AnalyticsEventUpdateManyWithWhereWithoutUserInput = {
    where: AnalyticsEventScalarWhereInput
    data: XOR<AnalyticsEventUpdateManyMutationInput, AnalyticsEventUncheckedUpdateManyWithoutUserInput>
  }

  export type AnalyticsEventScalarWhereInput = {
    AND?: AnalyticsEventScalarWhereInput | AnalyticsEventScalarWhereInput[]
    OR?: AnalyticsEventScalarWhereInput[]
    NOT?: AnalyticsEventScalarWhereInput | AnalyticsEventScalarWhereInput[]
    id?: StringFilter<"AnalyticsEvent"> | string
    eventName?: StringFilter<"AnalyticsEvent"> | string
    userId?: StringNullableFilter<"AnalyticsEvent"> | string | null
    metadata?: JsonNullableFilter<"AnalyticsEvent">
    createdAt?: DateTimeFilter<"AnalyticsEvent"> | Date | string
  }

  export type UserCreateWithoutIdeasInput = {
    id?: string
    username: string
    phone?: string | null
    password: string
    nickname?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: TaskCreateNestedManyWithoutUserInput
    canvases?: CanvasCreateNestedManyWithoutUserInput
    analyticsEvents?: AnalyticsEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutIdeasInput = {
    id?: string
    username: string
    phone?: string | null
    password: string
    nickname?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: TaskUncheckedCreateNestedManyWithoutUserInput
    canvases?: CanvasUncheckedCreateNestedManyWithoutUserInput
    analyticsEvents?: AnalyticsEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutIdeasInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutIdeasInput, UserUncheckedCreateWithoutIdeasInput>
  }

  export type TaskCreateWithoutIdeaInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    category?: string | null
    dueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateWithoutIdeaInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    category?: string | null
    dueDate?: Date | string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type TaskCreateOrConnectWithoutIdeaInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutIdeaInput, TaskUncheckedCreateWithoutIdeaInput>
  }

  export type TaskCreateManyIdeaInputEnvelope = {
    data: TaskCreateManyIdeaInput | TaskCreateManyIdeaInput[]
    skipDuplicates?: boolean
  }

  export type CanvasNodeCreateWithoutIdeaInput = {
    id?: string
    x: number
    y: number
    width?: number
    height?: number
    content?: string | null
    canvas: CanvasCreateNestedOneWithoutNodesInput
    fromConnections?: CanvasConnectionCreateNestedManyWithoutFromNodeInput
    toConnections?: CanvasConnectionCreateNestedManyWithoutToNodeInput
  }

  export type CanvasNodeUncheckedCreateWithoutIdeaInput = {
    id?: string
    canvasId: string
    x: number
    y: number
    width?: number
    height?: number
    content?: string | null
    fromConnections?: CanvasConnectionUncheckedCreateNestedManyWithoutFromNodeInput
    toConnections?: CanvasConnectionUncheckedCreateNestedManyWithoutToNodeInput
  }

  export type CanvasNodeCreateOrConnectWithoutIdeaInput = {
    where: CanvasNodeWhereUniqueInput
    create: XOR<CanvasNodeCreateWithoutIdeaInput, CanvasNodeUncheckedCreateWithoutIdeaInput>
  }

  export type CanvasNodeCreateManyIdeaInputEnvelope = {
    data: CanvasNodeCreateManyIdeaInput | CanvasNodeCreateManyIdeaInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutIdeasInput = {
    update: XOR<UserUpdateWithoutIdeasInput, UserUncheckedUpdateWithoutIdeasInput>
    create: XOR<UserCreateWithoutIdeasInput, UserUncheckedCreateWithoutIdeasInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutIdeasInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutIdeasInput, UserUncheckedUpdateWithoutIdeasInput>
  }

  export type UserUpdateWithoutIdeasInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUpdateManyWithoutUserNestedInput
    canvases?: CanvasUpdateManyWithoutUserNestedInput
    analyticsEvents?: AnalyticsEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutIdeasInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUncheckedUpdateManyWithoutUserNestedInput
    canvases?: CanvasUncheckedUpdateManyWithoutUserNestedInput
    analyticsEvents?: AnalyticsEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TaskUpsertWithWhereUniqueWithoutIdeaInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutIdeaInput, TaskUncheckedUpdateWithoutIdeaInput>
    create: XOR<TaskCreateWithoutIdeaInput, TaskUncheckedCreateWithoutIdeaInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutIdeaInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutIdeaInput, TaskUncheckedUpdateWithoutIdeaInput>
  }

  export type TaskUpdateManyWithWhereWithoutIdeaInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutIdeaInput>
  }

  export type CanvasNodeUpsertWithWhereUniqueWithoutIdeaInput = {
    where: CanvasNodeWhereUniqueInput
    update: XOR<CanvasNodeUpdateWithoutIdeaInput, CanvasNodeUncheckedUpdateWithoutIdeaInput>
    create: XOR<CanvasNodeCreateWithoutIdeaInput, CanvasNodeUncheckedCreateWithoutIdeaInput>
  }

  export type CanvasNodeUpdateWithWhereUniqueWithoutIdeaInput = {
    where: CanvasNodeWhereUniqueInput
    data: XOR<CanvasNodeUpdateWithoutIdeaInput, CanvasNodeUncheckedUpdateWithoutIdeaInput>
  }

  export type CanvasNodeUpdateManyWithWhereWithoutIdeaInput = {
    where: CanvasNodeScalarWhereInput
    data: XOR<CanvasNodeUpdateManyMutationInput, CanvasNodeUncheckedUpdateManyWithoutIdeaInput>
  }

  export type CanvasNodeScalarWhereInput = {
    AND?: CanvasNodeScalarWhereInput | CanvasNodeScalarWhereInput[]
    OR?: CanvasNodeScalarWhereInput[]
    NOT?: CanvasNodeScalarWhereInput | CanvasNodeScalarWhereInput[]
    id?: StringFilter<"CanvasNode"> | string
    canvasId?: StringFilter<"CanvasNode"> | string
    ideaId?: StringNullableFilter<"CanvasNode"> | string | null
    x?: FloatFilter<"CanvasNode"> | number
    y?: FloatFilter<"CanvasNode"> | number
    width?: FloatFilter<"CanvasNode"> | number
    height?: FloatFilter<"CanvasNode"> | number
    content?: StringNullableFilter<"CanvasNode"> | string | null
  }

  export type UserCreateWithoutTasksInput = {
    id?: string
    username: string
    phone?: string | null
    password: string
    nickname?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ideas?: IdeaCreateNestedManyWithoutUserInput
    canvases?: CanvasCreateNestedManyWithoutUserInput
    analyticsEvents?: AnalyticsEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTasksInput = {
    id?: string
    username: string
    phone?: string | null
    password: string
    nickname?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ideas?: IdeaUncheckedCreateNestedManyWithoutUserInput
    canvases?: CanvasUncheckedCreateNestedManyWithoutUserInput
    analyticsEvents?: AnalyticsEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTasksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
  }

  export type IdeaCreateWithoutTasksInput = {
    id?: string
    content: string
    source?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutIdeasInput
    nodes?: CanvasNodeCreateNestedManyWithoutIdeaInput
  }

  export type IdeaUncheckedCreateWithoutTasksInput = {
    id?: string
    content: string
    source?: NullableJsonNullValueInput | InputJsonValue
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    nodes?: CanvasNodeUncheckedCreateNestedManyWithoutIdeaInput
  }

  export type IdeaCreateOrConnectWithoutTasksInput = {
    where: IdeaWhereUniqueInput
    create: XOR<IdeaCreateWithoutTasksInput, IdeaUncheckedCreateWithoutTasksInput>
  }

  export type UserUpsertWithoutTasksInput = {
    update: XOR<UserUpdateWithoutTasksInput, UserUncheckedUpdateWithoutTasksInput>
    create: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTasksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTasksInput, UserUncheckedUpdateWithoutTasksInput>
  }

  export type UserUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ideas?: IdeaUpdateManyWithoutUserNestedInput
    canvases?: CanvasUpdateManyWithoutUserNestedInput
    analyticsEvents?: AnalyticsEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ideas?: IdeaUncheckedUpdateManyWithoutUserNestedInput
    canvases?: CanvasUncheckedUpdateManyWithoutUserNestedInput
    analyticsEvents?: AnalyticsEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type IdeaUpsertWithoutTasksInput = {
    update: XOR<IdeaUpdateWithoutTasksInput, IdeaUncheckedUpdateWithoutTasksInput>
    create: XOR<IdeaCreateWithoutTasksInput, IdeaUncheckedCreateWithoutTasksInput>
    where?: IdeaWhereInput
  }

  export type IdeaUpdateToOneWithWhereWithoutTasksInput = {
    where?: IdeaWhereInput
    data: XOR<IdeaUpdateWithoutTasksInput, IdeaUncheckedUpdateWithoutTasksInput>
  }

  export type IdeaUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutIdeasNestedInput
    nodes?: CanvasNodeUpdateManyWithoutIdeaNestedInput
  }

  export type IdeaUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableJsonNullValueInput | InputJsonValue
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nodes?: CanvasNodeUncheckedUpdateManyWithoutIdeaNestedInput
  }

  export type UserCreateWithoutCanvasesInput = {
    id?: string
    username: string
    phone?: string | null
    password: string
    nickname?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ideas?: IdeaCreateNestedManyWithoutUserInput
    tasks?: TaskCreateNestedManyWithoutUserInput
    analyticsEvents?: AnalyticsEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCanvasesInput = {
    id?: string
    username: string
    phone?: string | null
    password: string
    nickname?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ideas?: IdeaUncheckedCreateNestedManyWithoutUserInput
    tasks?: TaskUncheckedCreateNestedManyWithoutUserInput
    analyticsEvents?: AnalyticsEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCanvasesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCanvasesInput, UserUncheckedCreateWithoutCanvasesInput>
  }

  export type CanvasNodeCreateWithoutCanvasInput = {
    id?: string
    x: number
    y: number
    width?: number
    height?: number
    content?: string | null
    idea?: IdeaCreateNestedOneWithoutNodesInput
    fromConnections?: CanvasConnectionCreateNestedManyWithoutFromNodeInput
    toConnections?: CanvasConnectionCreateNestedManyWithoutToNodeInput
  }

  export type CanvasNodeUncheckedCreateWithoutCanvasInput = {
    id?: string
    ideaId?: string | null
    x: number
    y: number
    width?: number
    height?: number
    content?: string | null
    fromConnections?: CanvasConnectionUncheckedCreateNestedManyWithoutFromNodeInput
    toConnections?: CanvasConnectionUncheckedCreateNestedManyWithoutToNodeInput
  }

  export type CanvasNodeCreateOrConnectWithoutCanvasInput = {
    where: CanvasNodeWhereUniqueInput
    create: XOR<CanvasNodeCreateWithoutCanvasInput, CanvasNodeUncheckedCreateWithoutCanvasInput>
  }

  export type CanvasNodeCreateManyCanvasInputEnvelope = {
    data: CanvasNodeCreateManyCanvasInput | CanvasNodeCreateManyCanvasInput[]
    skipDuplicates?: boolean
  }

  export type CanvasConnectionCreateWithoutCanvasInput = {
    id?: string
    label?: string | null
    fromNode: CanvasNodeCreateNestedOneWithoutFromConnectionsInput
    toNode: CanvasNodeCreateNestedOneWithoutToConnectionsInput
  }

  export type CanvasConnectionUncheckedCreateWithoutCanvasInput = {
    id?: string
    fromNodeId: string
    toNodeId: string
    label?: string | null
  }

  export type CanvasConnectionCreateOrConnectWithoutCanvasInput = {
    where: CanvasConnectionWhereUniqueInput
    create: XOR<CanvasConnectionCreateWithoutCanvasInput, CanvasConnectionUncheckedCreateWithoutCanvasInput>
  }

  export type CanvasConnectionCreateManyCanvasInputEnvelope = {
    data: CanvasConnectionCreateManyCanvasInput | CanvasConnectionCreateManyCanvasInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCanvasesInput = {
    update: XOR<UserUpdateWithoutCanvasesInput, UserUncheckedUpdateWithoutCanvasesInput>
    create: XOR<UserCreateWithoutCanvasesInput, UserUncheckedCreateWithoutCanvasesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCanvasesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCanvasesInput, UserUncheckedUpdateWithoutCanvasesInput>
  }

  export type UserUpdateWithoutCanvasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ideas?: IdeaUpdateManyWithoutUserNestedInput
    tasks?: TaskUpdateManyWithoutUserNestedInput
    analyticsEvents?: AnalyticsEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCanvasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ideas?: IdeaUncheckedUpdateManyWithoutUserNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutUserNestedInput
    analyticsEvents?: AnalyticsEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CanvasNodeUpsertWithWhereUniqueWithoutCanvasInput = {
    where: CanvasNodeWhereUniqueInput
    update: XOR<CanvasNodeUpdateWithoutCanvasInput, CanvasNodeUncheckedUpdateWithoutCanvasInput>
    create: XOR<CanvasNodeCreateWithoutCanvasInput, CanvasNodeUncheckedCreateWithoutCanvasInput>
  }

  export type CanvasNodeUpdateWithWhereUniqueWithoutCanvasInput = {
    where: CanvasNodeWhereUniqueInput
    data: XOR<CanvasNodeUpdateWithoutCanvasInput, CanvasNodeUncheckedUpdateWithoutCanvasInput>
  }

  export type CanvasNodeUpdateManyWithWhereWithoutCanvasInput = {
    where: CanvasNodeScalarWhereInput
    data: XOR<CanvasNodeUpdateManyMutationInput, CanvasNodeUncheckedUpdateManyWithoutCanvasInput>
  }

  export type CanvasConnectionUpsertWithWhereUniqueWithoutCanvasInput = {
    where: CanvasConnectionWhereUniqueInput
    update: XOR<CanvasConnectionUpdateWithoutCanvasInput, CanvasConnectionUncheckedUpdateWithoutCanvasInput>
    create: XOR<CanvasConnectionCreateWithoutCanvasInput, CanvasConnectionUncheckedCreateWithoutCanvasInput>
  }

  export type CanvasConnectionUpdateWithWhereUniqueWithoutCanvasInput = {
    where: CanvasConnectionWhereUniqueInput
    data: XOR<CanvasConnectionUpdateWithoutCanvasInput, CanvasConnectionUncheckedUpdateWithoutCanvasInput>
  }

  export type CanvasConnectionUpdateManyWithWhereWithoutCanvasInput = {
    where: CanvasConnectionScalarWhereInput
    data: XOR<CanvasConnectionUpdateManyMutationInput, CanvasConnectionUncheckedUpdateManyWithoutCanvasInput>
  }

  export type CanvasConnectionScalarWhereInput = {
    AND?: CanvasConnectionScalarWhereInput | CanvasConnectionScalarWhereInput[]
    OR?: CanvasConnectionScalarWhereInput[]
    NOT?: CanvasConnectionScalarWhereInput | CanvasConnectionScalarWhereInput[]
    id?: StringFilter<"CanvasConnection"> | string
    canvasId?: StringFilter<"CanvasConnection"> | string
    fromNodeId?: StringFilter<"CanvasConnection"> | string
    toNodeId?: StringFilter<"CanvasConnection"> | string
    label?: StringNullableFilter<"CanvasConnection"> | string | null
  }

  export type CanvasCreateWithoutNodesInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutCanvasesInput
    connections?: CanvasConnectionCreateNestedManyWithoutCanvasInput
  }

  export type CanvasUncheckedCreateWithoutNodesInput = {
    id?: string
    name: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    connections?: CanvasConnectionUncheckedCreateNestedManyWithoutCanvasInput
  }

  export type CanvasCreateOrConnectWithoutNodesInput = {
    where: CanvasWhereUniqueInput
    create: XOR<CanvasCreateWithoutNodesInput, CanvasUncheckedCreateWithoutNodesInput>
  }

  export type IdeaCreateWithoutNodesInput = {
    id?: string
    content: string
    source?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutIdeasInput
    tasks?: TaskCreateNestedManyWithoutIdeaInput
  }

  export type IdeaUncheckedCreateWithoutNodesInput = {
    id?: string
    content: string
    source?: NullableJsonNullValueInput | InputJsonValue
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    tasks?: TaskUncheckedCreateNestedManyWithoutIdeaInput
  }

  export type IdeaCreateOrConnectWithoutNodesInput = {
    where: IdeaWhereUniqueInput
    create: XOR<IdeaCreateWithoutNodesInput, IdeaUncheckedCreateWithoutNodesInput>
  }

  export type CanvasConnectionCreateWithoutFromNodeInput = {
    id?: string
    label?: string | null
    canvas: CanvasCreateNestedOneWithoutConnectionsInput
    toNode: CanvasNodeCreateNestedOneWithoutToConnectionsInput
  }

  export type CanvasConnectionUncheckedCreateWithoutFromNodeInput = {
    id?: string
    canvasId: string
    toNodeId: string
    label?: string | null
  }

  export type CanvasConnectionCreateOrConnectWithoutFromNodeInput = {
    where: CanvasConnectionWhereUniqueInput
    create: XOR<CanvasConnectionCreateWithoutFromNodeInput, CanvasConnectionUncheckedCreateWithoutFromNodeInput>
  }

  export type CanvasConnectionCreateManyFromNodeInputEnvelope = {
    data: CanvasConnectionCreateManyFromNodeInput | CanvasConnectionCreateManyFromNodeInput[]
    skipDuplicates?: boolean
  }

  export type CanvasConnectionCreateWithoutToNodeInput = {
    id?: string
    label?: string | null
    canvas: CanvasCreateNestedOneWithoutConnectionsInput
    fromNode: CanvasNodeCreateNestedOneWithoutFromConnectionsInput
  }

  export type CanvasConnectionUncheckedCreateWithoutToNodeInput = {
    id?: string
    canvasId: string
    fromNodeId: string
    label?: string | null
  }

  export type CanvasConnectionCreateOrConnectWithoutToNodeInput = {
    where: CanvasConnectionWhereUniqueInput
    create: XOR<CanvasConnectionCreateWithoutToNodeInput, CanvasConnectionUncheckedCreateWithoutToNodeInput>
  }

  export type CanvasConnectionCreateManyToNodeInputEnvelope = {
    data: CanvasConnectionCreateManyToNodeInput | CanvasConnectionCreateManyToNodeInput[]
    skipDuplicates?: boolean
  }

  export type CanvasUpsertWithoutNodesInput = {
    update: XOR<CanvasUpdateWithoutNodesInput, CanvasUncheckedUpdateWithoutNodesInput>
    create: XOR<CanvasCreateWithoutNodesInput, CanvasUncheckedCreateWithoutNodesInput>
    where?: CanvasWhereInput
  }

  export type CanvasUpdateToOneWithWhereWithoutNodesInput = {
    where?: CanvasWhereInput
    data: XOR<CanvasUpdateWithoutNodesInput, CanvasUncheckedUpdateWithoutNodesInput>
  }

  export type CanvasUpdateWithoutNodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutCanvasesNestedInput
    connections?: CanvasConnectionUpdateManyWithoutCanvasNestedInput
  }

  export type CanvasUncheckedUpdateWithoutNodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    connections?: CanvasConnectionUncheckedUpdateManyWithoutCanvasNestedInput
  }

  export type IdeaUpsertWithoutNodesInput = {
    update: XOR<IdeaUpdateWithoutNodesInput, IdeaUncheckedUpdateWithoutNodesInput>
    create: XOR<IdeaCreateWithoutNodesInput, IdeaUncheckedCreateWithoutNodesInput>
    where?: IdeaWhereInput
  }

  export type IdeaUpdateToOneWithWhereWithoutNodesInput = {
    where?: IdeaWhereInput
    data: XOR<IdeaUpdateWithoutNodesInput, IdeaUncheckedUpdateWithoutNodesInput>
  }

  export type IdeaUpdateWithoutNodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutIdeasNestedInput
    tasks?: TaskUpdateManyWithoutIdeaNestedInput
  }

  export type IdeaUncheckedUpdateWithoutNodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableJsonNullValueInput | InputJsonValue
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tasks?: TaskUncheckedUpdateManyWithoutIdeaNestedInput
  }

  export type CanvasConnectionUpsertWithWhereUniqueWithoutFromNodeInput = {
    where: CanvasConnectionWhereUniqueInput
    update: XOR<CanvasConnectionUpdateWithoutFromNodeInput, CanvasConnectionUncheckedUpdateWithoutFromNodeInput>
    create: XOR<CanvasConnectionCreateWithoutFromNodeInput, CanvasConnectionUncheckedCreateWithoutFromNodeInput>
  }

  export type CanvasConnectionUpdateWithWhereUniqueWithoutFromNodeInput = {
    where: CanvasConnectionWhereUniqueInput
    data: XOR<CanvasConnectionUpdateWithoutFromNodeInput, CanvasConnectionUncheckedUpdateWithoutFromNodeInput>
  }

  export type CanvasConnectionUpdateManyWithWhereWithoutFromNodeInput = {
    where: CanvasConnectionScalarWhereInput
    data: XOR<CanvasConnectionUpdateManyMutationInput, CanvasConnectionUncheckedUpdateManyWithoutFromNodeInput>
  }

  export type CanvasConnectionUpsertWithWhereUniqueWithoutToNodeInput = {
    where: CanvasConnectionWhereUniqueInput
    update: XOR<CanvasConnectionUpdateWithoutToNodeInput, CanvasConnectionUncheckedUpdateWithoutToNodeInput>
    create: XOR<CanvasConnectionCreateWithoutToNodeInput, CanvasConnectionUncheckedCreateWithoutToNodeInput>
  }

  export type CanvasConnectionUpdateWithWhereUniqueWithoutToNodeInput = {
    where: CanvasConnectionWhereUniqueInput
    data: XOR<CanvasConnectionUpdateWithoutToNodeInput, CanvasConnectionUncheckedUpdateWithoutToNodeInput>
  }

  export type CanvasConnectionUpdateManyWithWhereWithoutToNodeInput = {
    where: CanvasConnectionScalarWhereInput
    data: XOR<CanvasConnectionUpdateManyMutationInput, CanvasConnectionUncheckedUpdateManyWithoutToNodeInput>
  }

  export type CanvasCreateWithoutConnectionsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutCanvasesInput
    nodes?: CanvasNodeCreateNestedManyWithoutCanvasInput
  }

  export type CanvasUncheckedCreateWithoutConnectionsInput = {
    id?: string
    name: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    nodes?: CanvasNodeUncheckedCreateNestedManyWithoutCanvasInput
  }

  export type CanvasCreateOrConnectWithoutConnectionsInput = {
    where: CanvasWhereUniqueInput
    create: XOR<CanvasCreateWithoutConnectionsInput, CanvasUncheckedCreateWithoutConnectionsInput>
  }

  export type CanvasNodeCreateWithoutFromConnectionsInput = {
    id?: string
    x: number
    y: number
    width?: number
    height?: number
    content?: string | null
    canvas: CanvasCreateNestedOneWithoutNodesInput
    idea?: IdeaCreateNestedOneWithoutNodesInput
    toConnections?: CanvasConnectionCreateNestedManyWithoutToNodeInput
  }

  export type CanvasNodeUncheckedCreateWithoutFromConnectionsInput = {
    id?: string
    canvasId: string
    ideaId?: string | null
    x: number
    y: number
    width?: number
    height?: number
    content?: string | null
    toConnections?: CanvasConnectionUncheckedCreateNestedManyWithoutToNodeInput
  }

  export type CanvasNodeCreateOrConnectWithoutFromConnectionsInput = {
    where: CanvasNodeWhereUniqueInput
    create: XOR<CanvasNodeCreateWithoutFromConnectionsInput, CanvasNodeUncheckedCreateWithoutFromConnectionsInput>
  }

  export type CanvasNodeCreateWithoutToConnectionsInput = {
    id?: string
    x: number
    y: number
    width?: number
    height?: number
    content?: string | null
    canvas: CanvasCreateNestedOneWithoutNodesInput
    idea?: IdeaCreateNestedOneWithoutNodesInput
    fromConnections?: CanvasConnectionCreateNestedManyWithoutFromNodeInput
  }

  export type CanvasNodeUncheckedCreateWithoutToConnectionsInput = {
    id?: string
    canvasId: string
    ideaId?: string | null
    x: number
    y: number
    width?: number
    height?: number
    content?: string | null
    fromConnections?: CanvasConnectionUncheckedCreateNestedManyWithoutFromNodeInput
  }

  export type CanvasNodeCreateOrConnectWithoutToConnectionsInput = {
    where: CanvasNodeWhereUniqueInput
    create: XOR<CanvasNodeCreateWithoutToConnectionsInput, CanvasNodeUncheckedCreateWithoutToConnectionsInput>
  }

  export type CanvasUpsertWithoutConnectionsInput = {
    update: XOR<CanvasUpdateWithoutConnectionsInput, CanvasUncheckedUpdateWithoutConnectionsInput>
    create: XOR<CanvasCreateWithoutConnectionsInput, CanvasUncheckedCreateWithoutConnectionsInput>
    where?: CanvasWhereInput
  }

  export type CanvasUpdateToOneWithWhereWithoutConnectionsInput = {
    where?: CanvasWhereInput
    data: XOR<CanvasUpdateWithoutConnectionsInput, CanvasUncheckedUpdateWithoutConnectionsInput>
  }

  export type CanvasUpdateWithoutConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutCanvasesNestedInput
    nodes?: CanvasNodeUpdateManyWithoutCanvasNestedInput
  }

  export type CanvasUncheckedUpdateWithoutConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nodes?: CanvasNodeUncheckedUpdateManyWithoutCanvasNestedInput
  }

  export type CanvasNodeUpsertWithoutFromConnectionsInput = {
    update: XOR<CanvasNodeUpdateWithoutFromConnectionsInput, CanvasNodeUncheckedUpdateWithoutFromConnectionsInput>
    create: XOR<CanvasNodeCreateWithoutFromConnectionsInput, CanvasNodeUncheckedCreateWithoutFromConnectionsInput>
    where?: CanvasNodeWhereInput
  }

  export type CanvasNodeUpdateToOneWithWhereWithoutFromConnectionsInput = {
    where?: CanvasNodeWhereInput
    data: XOR<CanvasNodeUpdateWithoutFromConnectionsInput, CanvasNodeUncheckedUpdateWithoutFromConnectionsInput>
  }

  export type CanvasNodeUpdateWithoutFromConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
    canvas?: CanvasUpdateOneRequiredWithoutNodesNestedInput
    idea?: IdeaUpdateOneWithoutNodesNestedInput
    toConnections?: CanvasConnectionUpdateManyWithoutToNodeNestedInput
  }

  export type CanvasNodeUncheckedUpdateWithoutFromConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    canvasId?: StringFieldUpdateOperationsInput | string
    ideaId?: NullableStringFieldUpdateOperationsInput | string | null
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
    toConnections?: CanvasConnectionUncheckedUpdateManyWithoutToNodeNestedInput
  }

  export type CanvasNodeUpsertWithoutToConnectionsInput = {
    update: XOR<CanvasNodeUpdateWithoutToConnectionsInput, CanvasNodeUncheckedUpdateWithoutToConnectionsInput>
    create: XOR<CanvasNodeCreateWithoutToConnectionsInput, CanvasNodeUncheckedCreateWithoutToConnectionsInput>
    where?: CanvasNodeWhereInput
  }

  export type CanvasNodeUpdateToOneWithWhereWithoutToConnectionsInput = {
    where?: CanvasNodeWhereInput
    data: XOR<CanvasNodeUpdateWithoutToConnectionsInput, CanvasNodeUncheckedUpdateWithoutToConnectionsInput>
  }

  export type CanvasNodeUpdateWithoutToConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
    canvas?: CanvasUpdateOneRequiredWithoutNodesNestedInput
    idea?: IdeaUpdateOneWithoutNodesNestedInput
    fromConnections?: CanvasConnectionUpdateManyWithoutFromNodeNestedInput
  }

  export type CanvasNodeUncheckedUpdateWithoutToConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    canvasId?: StringFieldUpdateOperationsInput | string
    ideaId?: NullableStringFieldUpdateOperationsInput | string | null
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
    fromConnections?: CanvasConnectionUncheckedUpdateManyWithoutFromNodeNestedInput
  }

  export type UserCreateWithoutAnalyticsEventsInput = {
    id?: string
    username: string
    phone?: string | null
    password: string
    nickname?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ideas?: IdeaCreateNestedManyWithoutUserInput
    tasks?: TaskCreateNestedManyWithoutUserInput
    canvases?: CanvasCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAnalyticsEventsInput = {
    id?: string
    username: string
    phone?: string | null
    password: string
    nickname?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ideas?: IdeaUncheckedCreateNestedManyWithoutUserInput
    tasks?: TaskUncheckedCreateNestedManyWithoutUserInput
    canvases?: CanvasUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAnalyticsEventsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAnalyticsEventsInput, UserUncheckedCreateWithoutAnalyticsEventsInput>
  }

  export type UserUpsertWithoutAnalyticsEventsInput = {
    update: XOR<UserUpdateWithoutAnalyticsEventsInput, UserUncheckedUpdateWithoutAnalyticsEventsInput>
    create: XOR<UserCreateWithoutAnalyticsEventsInput, UserUncheckedCreateWithoutAnalyticsEventsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAnalyticsEventsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAnalyticsEventsInput, UserUncheckedUpdateWithoutAnalyticsEventsInput>
  }

  export type UserUpdateWithoutAnalyticsEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ideas?: IdeaUpdateManyWithoutUserNestedInput
    tasks?: TaskUpdateManyWithoutUserNestedInput
    canvases?: CanvasUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAnalyticsEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ideas?: IdeaUncheckedUpdateManyWithoutUserNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutUserNestedInput
    canvases?: CanvasUncheckedUpdateManyWithoutUserNestedInput
  }

  export type IdeaCreateManyUserInput = {
    id?: string
    content: string
    source?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type TaskCreateManyUserInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    category?: string | null
    dueDate?: Date | string | null
    ideaId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type CanvasCreateManyUserInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type AnalyticsEventCreateManyUserInput = {
    id?: string
    eventName: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type IdeaUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tasks?: TaskUpdateManyWithoutIdeaNestedInput
    nodes?: CanvasNodeUpdateManyWithoutIdeaNestedInput
  }

  export type IdeaUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tasks?: TaskUncheckedUpdateManyWithoutIdeaNestedInput
    nodes?: CanvasNodeUncheckedUpdateManyWithoutIdeaNestedInput
  }

  export type IdeaUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    category?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idea?: IdeaUpdateOneWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    category?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ideaId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    category?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ideaId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CanvasUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nodes?: CanvasNodeUpdateManyWithoutCanvasNestedInput
    connections?: CanvasConnectionUpdateManyWithoutCanvasNestedInput
  }

  export type CanvasUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nodes?: CanvasNodeUncheckedUpdateManyWithoutCanvasNestedInput
    connections?: CanvasConnectionUncheckedUpdateManyWithoutCanvasNestedInput
  }

  export type CanvasUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AnalyticsEventUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsEventUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsEventUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCreateManyIdeaInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    category?: string | null
    dueDate?: Date | string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type CanvasNodeCreateManyIdeaInput = {
    id?: string
    canvasId: string
    x: number
    y: number
    width?: number
    height?: number
    content?: string | null
  }

  export type TaskUpdateWithoutIdeaInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    category?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutIdeaInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    category?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskUncheckedUpdateManyWithoutIdeaInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    category?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CanvasNodeUpdateWithoutIdeaInput = {
    id?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
    canvas?: CanvasUpdateOneRequiredWithoutNodesNestedInput
    fromConnections?: CanvasConnectionUpdateManyWithoutFromNodeNestedInput
    toConnections?: CanvasConnectionUpdateManyWithoutToNodeNestedInput
  }

  export type CanvasNodeUncheckedUpdateWithoutIdeaInput = {
    id?: StringFieldUpdateOperationsInput | string
    canvasId?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
    fromConnections?: CanvasConnectionUncheckedUpdateManyWithoutFromNodeNestedInput
    toConnections?: CanvasConnectionUncheckedUpdateManyWithoutToNodeNestedInput
  }

  export type CanvasNodeUncheckedUpdateManyWithoutIdeaInput = {
    id?: StringFieldUpdateOperationsInput | string
    canvasId?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CanvasNodeCreateManyCanvasInput = {
    id?: string
    ideaId?: string | null
    x: number
    y: number
    width?: number
    height?: number
    content?: string | null
  }

  export type CanvasConnectionCreateManyCanvasInput = {
    id?: string
    fromNodeId: string
    toNodeId: string
    label?: string | null
  }

  export type CanvasNodeUpdateWithoutCanvasInput = {
    id?: StringFieldUpdateOperationsInput | string
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
    idea?: IdeaUpdateOneWithoutNodesNestedInput
    fromConnections?: CanvasConnectionUpdateManyWithoutFromNodeNestedInput
    toConnections?: CanvasConnectionUpdateManyWithoutToNodeNestedInput
  }

  export type CanvasNodeUncheckedUpdateWithoutCanvasInput = {
    id?: StringFieldUpdateOperationsInput | string
    ideaId?: NullableStringFieldUpdateOperationsInput | string | null
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
    fromConnections?: CanvasConnectionUncheckedUpdateManyWithoutFromNodeNestedInput
    toConnections?: CanvasConnectionUncheckedUpdateManyWithoutToNodeNestedInput
  }

  export type CanvasNodeUncheckedUpdateManyWithoutCanvasInput = {
    id?: StringFieldUpdateOperationsInput | string
    ideaId?: NullableStringFieldUpdateOperationsInput | string | null
    x?: FloatFieldUpdateOperationsInput | number
    y?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CanvasConnectionUpdateWithoutCanvasInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    fromNode?: CanvasNodeUpdateOneRequiredWithoutFromConnectionsNestedInput
    toNode?: CanvasNodeUpdateOneRequiredWithoutToConnectionsNestedInput
  }

  export type CanvasConnectionUncheckedUpdateWithoutCanvasInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CanvasConnectionUncheckedUpdateManyWithoutCanvasInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CanvasConnectionCreateManyFromNodeInput = {
    id?: string
    canvasId: string
    toNodeId: string
    label?: string | null
  }

  export type CanvasConnectionCreateManyToNodeInput = {
    id?: string
    canvasId: string
    fromNodeId: string
    label?: string | null
  }

  export type CanvasConnectionUpdateWithoutFromNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    canvas?: CanvasUpdateOneRequiredWithoutConnectionsNestedInput
    toNode?: CanvasNodeUpdateOneRequiredWithoutToConnectionsNestedInput
  }

  export type CanvasConnectionUncheckedUpdateWithoutFromNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    canvasId?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CanvasConnectionUncheckedUpdateManyWithoutFromNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    canvasId?: StringFieldUpdateOperationsInput | string
    toNodeId?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CanvasConnectionUpdateWithoutToNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    canvas?: CanvasUpdateOneRequiredWithoutConnectionsNestedInput
    fromNode?: CanvasNodeUpdateOneRequiredWithoutFromConnectionsNestedInput
  }

  export type CanvasConnectionUncheckedUpdateWithoutToNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    canvasId?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CanvasConnectionUncheckedUpdateManyWithoutToNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    canvasId?: StringFieldUpdateOperationsInput | string
    fromNodeId?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use IdeaCountOutputTypeDefaultArgs instead
     */
    export type IdeaCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = IdeaCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CanvasCountOutputTypeDefaultArgs instead
     */
    export type CanvasCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CanvasCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CanvasNodeCountOutputTypeDefaultArgs instead
     */
    export type CanvasNodeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CanvasNodeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use IdeaDefaultArgs instead
     */
    export type IdeaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = IdeaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskDefaultArgs instead
     */
    export type TaskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CanvasDefaultArgs instead
     */
    export type CanvasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CanvasDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CanvasNodeDefaultArgs instead
     */
    export type CanvasNodeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CanvasNodeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CanvasConnectionDefaultArgs instead
     */
    export type CanvasConnectionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CanvasConnectionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AnalyticsEventDefaultArgs instead
     */
    export type AnalyticsEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AnalyticsEventDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}