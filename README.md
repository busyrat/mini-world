# Mini RSC

> 手写一个 React Server Component

## 思路

- 基于 express 返回一个静态的 HTML 文件。

- 借用 TS 的能力把 JSX 编译成 JSX对象。（这一步也可以用 Webpack 和 Babel 来处理）

- 编写 renderJSXToHTML 函数，把上一步的 JSX对象 编译成 HTML。（这一步也可以使用 react-dom/server 包里面的 [renderToString](https://react.dev/reference/react-dom/server/renderToString) 方法）

- 实现导航栏，点击导航栏跳转到不同的页面。

- 拦截客户端导航，获取目标路由的JSX对象，使用 react-dom/client 的 [hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot#updating-a-hydrated-root-component) 方法更新
