---
layout: post
title: "Typescript 进阶篇"
date: 2024-01-10 21:50:04 GMT+0800
categories: typescript
tags: [typescript, handbook]
comments: true
banner_img: /images/typescript/ts-handbook-senior-banner.png
index_img: /images/typescript/ts-handbook-senior-banner.png
---

# Typescript 进阶篇

## 1. 泛型

### 1.1 泛型基础

泛型提供一种方式来使用类型变量，而不是具体的类型，这为类型的复用提供了灵活性。

```typescript
function identity<T>(arg: T): T {
  return arg;
}
let output = identity<string>("myString"); // 输出类型为 'string'
```

### 1.2 泛型约束

泛型约束允许你定义一个接口来描述约束条件，确保泛型符合预期的形状。

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // 现在我们知道它有一个 .length 属性
  return arg;
}
```

### 1.3 泛型接口

泛型接口使接口的某些部分可以是任意类型。

```typescript
interface GenericIdentityFn<T> {
  (arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

### 1.4 泛型类

泛型类具有泛型类型的类成员。

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

### 1.5 泛型工具类型

TypeScript 提供了内置的泛型工具类型，如 `Partial<T>` 使所有属性为可选，`Readonly<T>` 使所有属性为只读。

```typescript
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1: Todo = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```

## 2. 高级类型

### 2.1 交叉类型和联合类型

交叉类型是将多个类型合并为一个类型，联合类型则是一个值可以是几种类型之一。

```typescript
type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

// 交叉类型
type ElevatedEmployee = Admin & Employee;

// 联合类型
type UnknownEmployee = Admin | Employee;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log("Name: " + emp.name);
  if ("privileges" in emp) {
    console.log("Privileges: " + emp.privileges);
  }
  if ("startDate" in emp) {
    console.log("Start Date: " + emp.startDate);
  }
}
```

### 2.2 类型守卫和类型断言

类型守卫允许你根据条件检查类型，类型断言则是你明确地告诉编译器变量的类型。

```typescript
// 类型断言
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;

// 类型守卫
function isNumber(val: string | number): val is number {
  return typeof val === "number";
}

function isString(val: string | number): val is string {
  return typeof val === "string";
}
```

### 2.3 类型别名

类型别名用于创建一个新的名字来引用一个类型。

```typescript
type Point = {
  x: number;
  y: number;
};

function draw(coord: Point) {
  // ...
}
```

### 2.4 字面量类型

字面量类型用于限制变量必须是指定的值。

```typescript
type Easing = "ease-in" | "ease-out" | "ease-in-out";

class UIElement {
  animate(dx: number, dy: number, easing: Easing) {
    if (easing === "ease-in") {
      // ...
    } else if (easing === "ease-out") {
    } else if (easing === "ease-in-out") {
    } else {
      // error! 不应该传入 null 或 undefined.
    }
  }
}
```

### 2.5 可辨识联合（Tagged Unions）

可辨识联合结合了字面量类型和联合类型，用于创建一个有固定数量成员的类型，每个成员都有一个共同的属性用于辨识。

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
  }
}
```

### 2.6 映射类型

映射类型可以从旧类型创建新类型，可以迭代旧类型的属性。

```typescript
type Keys = "option1" | "option2";
type Flags = { [K in Keys]: boolean };
```

### 2.7 条件类型

条件类型选择两种类型之一，基于给定的条件。

```typescript
type Check<T> = T extends string ? "String" : "Not a string";
type Type = Check<string>; // Type is 'String'
type NotString = Check<number>; // NotString is 'Not a string'
```

当然，我将继续并调整格式。

## 3. 模块和命名空间

### 3.1 模块简介

模块是 TypeScript 用于组织和封装代码的一种方式。模块可以包含变量、函数、类、接口等，通常是一个文件。

```typescript
// someModule.ts
export function someFunction() {
  // ...
}
```

### 3.2 导出和导入模块

可以通过 `export` 关键字导出模块中的成员，并通过 `import` 关键字导入。

```typescript
// someModule.ts
export function someFunction() {
  /* ... */
}

// otherModule.ts
import { someFunction } from "./someModule";
```

### 3.3 默认导出

每个模块可以有一个默认导出，使用 `export default`。

```typescript
// calculator.ts
export default class Calculator {
  add(a: number, b: number) {
    return a + b;
  }
}

// app.ts
import Calculator from "./calculator";
const calc = new Calculator();
```

### 3.4 与其他 JavaScript 库和框架的互操作性

TypeScript 能够和现有的 JavaScript 库和框架无缝合作，通常通过类型声明文件（`.d.ts`）来实现。

```typescript
// 使用第三方库 lodash
import _ from "lodash";
_.padStart("Hello TypeScript", 20, " ");
```

### 3.5 命名空间和模块的区别

命名空间主要用于组织代码和避免全局作用域的命名冲突，而模块则是文件级别的代码和依赖管理。

```typescript
// 使用命名空间
namespace MyNamespace {
  export class MyClass {
    /* ... */
  }
}
```

接下来，我们将探讨 TypeScript 中的装饰器。

## 4. 装饰器

装饰器是一种特殊类型的声明，它可以被附加到类声明、方法、访问器、属性或参数上。装饰器使用 `@expression` 形式，其中 `expression` 必须求值为一个函数，它会在运行时被调用。

### 4.1 类装饰器

类装饰器在类声明之前被声明，用于观察、修改或替换类定义。

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

### 4.2 方法装饰器

方法装饰器声明在一个方法的声明之前。用于观察、修改或替换方法定义。

```typescript
function enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value;
  };
}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

### 4.3 访问器装饰器

访问器装饰器可以应用于属性的访问器（getter/setter）之上，用于修改属性的行为。

```typescript
function configurable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}

class Point {
  private _x: number;
  private _y: number;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() {
    return this._x;
  }

  @configurable(false)
  get y() {
    return this._y;
  }
}
```

### 4.4 属性装饰器

属性装饰器用于处理类的属性，可以用于记录或修改属性的行为。

```typescript
function format(target: any, propertyKey: string) {
  let value = target[propertyKey];

  const getter = () => value;
  const setter = (newValue: string) => {
    value = newValue.toUpperCase();
  };

  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}

class Greeter {
  @format
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }
}
```

### 4.5 参数装饰器

参数装饰器声明在一个参数声明之前，用于监视、修改或替换方法的参数。

```typescript
function required(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  let existingRequiredParameters: number[] =
    Reflect.getOwnMetadata("required", target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(
    "required",
    existingRequiredParameters,
    target,
    propertyKey
  );
}

class Greeter {
  greeting: string;

  greet(@required name: string) {
    return "Hello " + name;
  }
}
```

## 5. 混入（Mixins）

混入是一种将一个类的方法和属性添加到另一个类的手段，在 TypeScript 中可以通过类和接口的组合来实现。

实现混入的一个示例：

```typescript
class Disposable {
  isDisposed: boolean;
  dispose() {
    this.isDisposed = true;
  }
}

class Activatable {
  isActive: boolean;
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
}

class SmartObject implements Disposable, Activatable {
  constructor() {
    setInterval(
      () => console.log(this.isActive + " : " + this.isDisposed),
      500
    );
  }

  interact() {
    this.activate();
  }

  // Disposable
  isDisposed: boolean = false;
  dispose: () => void;

  // Activatable
  isActive: boolean = false;
  activate: () => void;
  deactivate: () => void;
}

applyMixins(SmartObject, [Disposable, Activatable]);

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

let smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);
```

## 6. 声明合并

TypeScript 允许声明合并，这意味着编译器会将两个同名的声明合并为单一声明。

### 6.1 接口合并

相同名称的接口声明会自动合并其成员。

```typescript
interface Box {
  height: number;
  width: number;
}

interface Box {
  scale: number;
}

let box: Box = { height: 5, width: 6, scale: 10 };
```

### 6.2 命名空间与类、函数、枚举的合并

命名空间可以与类、函数或枚举合并。

```typescript
class Album {
  label: Album.AlbumLabel;
}
namespace Album {
  export class AlbumLabel {}
}
```

## 7. 使用 d.ts 声明文件

`.d.ts` 声明文件允许 TypeScript 理解非 TypeScript 编写的代码。

### 7.1 为 JavaScript 库编写声明文件

编写声明文件可以让 TypeScript 理解现有的 JavaScript 代码库。

```typescript
// typings/lodash.d.ts
declare module "lodash" {
  export function padStart(
    string: string,
    length: number,
    chars?: string
  ): string;
}
```

### 7.2 DefinitelyTyped 和 @types

DefinitelyTyped 提供了许多库的类型定义，可通过 npm 安装对应的 `@types` 包来使用。

```shell
npm install @types/lodash
```

## 8. 编译上下文

`tsconfig.json` 文件定义了 TypeScript 项目的根目录和编译选项。

使用 `tsconfig.json` 示例：

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true
  }
}
```

### 8.1 项目引用

项目引用提供了一种方法来组织 TypeScript 项目。

```json
{
  "compilerOptions": {
    // Base options
  },
  "references": [{ "path": "./sub-project" }]
}
```

## 9. 与构建工具集成

TypeScript 可以与现代构建工具如 Webpack 集成。

与 Webpack 集成示例：

```json
// webpack.config.js
module.exports = {
  entry: './src/app.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

## 10. 调试和测试

TypeScript 支持多种调试和测试策略。

### 10.1 TypeScript 的调试技巧

使用源映射（Source Maps）可以帮助调试 TypeScript 代码。

```json
// tsconfig.json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

### 10.2 使用 TypeScript 进行单元测试

TypeScript 与测试框架如 Jest 可以配合使用，提供类型安全的单元测试。

```typescript
// example.test.ts
import { sum } from "./sum";
test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
```
