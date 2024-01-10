---
layout: post
title: "Typescript 入门篇"
date: 2024-01-09 20:10:34 GMT+0800
categories: typescript
tags: [typescript, handbook]
comments: true
banner_img: /images/typescript/ts-handbook-junior-banner.png
index_img: /images/typescript/ts-handbook-junior-banner.png
---

# Typescript 入门篇

## 1. Typescript 简介

Typescript 是 JavaScript 的一个超集，添加了类型系统和对 ES6+ 的支持。

什么是 Typescript:

- Typescript 是一种由微软开发的开源语言，它扩展了 JavaScript，增加了类型检查。

Typescript 与 JavaScript 的区别:

- Typescript 提供了类型检查，能够在编译时发现并纠正错误，而 JavaScript 是动态类型的，只能在运行时发现错误。

## 2. 安装和配置

Typescript 的安装和配置是入门的第一步。

安装 Typescript:

- 通过 npm 安装：`npm install -g typescript`

设置和理解 `tsconfig.json`:
`tsconfig.json` 文件定义了 Typescript 项目的编译选项和根文件。

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true
  }
}
```

## 3. 基本类型

Typescript 支持 JavaScript 中的大多数基本类型，并引入了一些新的类型。

字符串、数字、布尔值:

```typescript
let name: string = "Alice";
let age: number = 30;
let isStudent: boolean = true;
```

数组和元组:

```typescript
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];
```

枚举:

```typescript
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;
```

Any、Unknown 和 Never 类型:

- `any` 类型可以是任何值，`unknown` 类型是 `any` 的安全对应类型，`never` 类型表示永远不会返回值。

Void 和 Undefined:

- `void` 表示没有任何类型，`undefined` 表示值未被定义。

## 4. 函数

Typescript 中的函数可以为参数和返回值设置类型。

函数类型:

```typescript
function add(x: number, y: number): number {
  return x + y;
}
```

可选参数和默认参数:

```typescript
function buildName(firstName: string, lastName?: string): string {
  return lastName ? `${firstName} ${lastName}` : firstName;
}
```

剩余参数:

```typescript
function buildName(firstName: string, ...restOfName: string[]): string {
  return firstName + " " + restOfName.join(" ");
}
```

## 5. 接口

接口是 Typescript 中定义对象类型的一种方式。

接口定义:

```typescript
interface LabelledValue {
  label: string;
}
```

可选属性和只读属性:

```typescript
interface Person {
  readonly name: string;
  age?: number;
}
```

函数类型接口:

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```

可索引的类型:

```typescript
interface StringArray {
  [index: number]: string;
}
```

类类型接口:

```typescript
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}
```

## 6. 类

Typescript 支持面向对象编程特性，如类、接口等。

类的基本使用:

```typescript
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

继承和多态:

```typescript
class Animal {
  move(distanceInMeters: number = 0) {
    console.log(`Animal moved ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof! Woof!");
  }
}
```

公共、私有与受保护的修饰符:

- Typescript 支持 `public`（默认）、`private` 和 `protected`

访问修饰符。

存取器:

- Typescript 支持通过 `getters/setters` 来截取对对象成员的访问。

静态属性和方法:

- 静态属性和方法是属于类的，而不是类的实例。

抽象类:

- 抽象类作为其他派生类的基类使用，它们一般不会直接被实例化。

## 7. 类型断言

类型断言提供了一种方式来告诉编译器关于变量的更多信息。

类型断言的用法:

```typescript
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
```

类型守卫:

- Typescript 使用类型守卫来细化类型的范围。

## 8. 类型推论

Typescript 会在没有明确指出类型的地方自动推断出一个类型。

基本规则:

- 如果没有明确的指定类型，TypeScript 会依照类型推论的规则推断出一个类型。

最佳通用类型:

- 当需要从几个表达式中推断出一个类型时，TypeScript 会尝试找出这些表达式共同的类型。

上下文类型:

- Typescript 也会根据上下文进行类型推断，如在事件处理中。

## 9. 联合类型和交叉类型

联合类型和交叉类型提供了一种有效的方式来表示非统一的类型。

联合类型:

- 联合类型是多个类型之一，表示一个值可以是几种类型之一。

```typescript
let value: string | number;
value = "My String"; // OK
value = 42; // OK
```

交叉类型:

- 交叉类型是将多个类型合并为一个类型。

```typescript
interface BusinessPartner {
  name: string;
  credit: number;
}

interface Identity {
  id: number;
  name: string;
}

type Employee = BusinessPartner & Identity;

let e: Employee = { id: 1, name: "Alice", credit: 1000 };
```
