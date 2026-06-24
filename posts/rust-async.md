---
title: "Rust 异步编程入门"
date: "2026-06-15"
description: "介绍 Rust 中 async/await 异步编程的基础概念和实践。"
tags: ["Rust", "异步编程", "后端"]
---

## 为什么需要异步编程？

在处理 I/O 密集型任务时（如网络请求、文件读写），同步代码会导致线程阻塞，浪费 CPU 资源。异步编程允许线程在等待 I/O 时执行其他任务。

## Rust 的异步模型

Rust 采用了基于 `Future` trait 的零成本异步模型：

```rust
use tokio;

#[tokio::main]
async fn main() {
    let result = fetch_data().await;
    println!("获取到数据: {}", result);
}

async fn fetch_data() -> String {
    // 异步操作
    tokio::time::sleep(std::time::Duration::from_secs(1)).await;
    String::from("Hello from async!")
}
```

## 关键概念

### Future

`Future` 是 Rust 异步编程的核心 trait：

```rust
trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
```

### async/await

`async` 和 `await` 是创建和使用 `Future` 的语法糖，让异步代码看起来像同步代码。

### Runtime

Rust 标准库不包含异步运行时，需要第三方库提供。最常用的是 **Tokio**：

- 事件循环
- 异步 I/O
- 定时器
- 任务调度

## 实际示例：Axum Web 服务器

```rust
use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(root));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "Hello, World!"
}
```

## 总结

Rust 的异步编程结合了高性能和内存安全，配合 Tokio 等生态库，非常适合构建高并发的网络服务。
