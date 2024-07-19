import express from 'express'
import { readFile } from "fs/promises";
import path from 'path'
import React from 'react'
import { renderToString } from 'react-dom/server'

const app = express()

app.use(express.static(path.join(__dirname, '../public')));
export async function renderJSXToClientJSX(jsx) {
  if (
    typeof jsx === "string" ||
    typeof jsx === "number" ||
    typeof jsx === "boolean" ||
    jsx == null
  ) {
    return jsx;
  } else if (Array.isArray(jsx)) {
    return Promise.all(jsx.map((child) => renderJSXToClientJSX({...child})));
  } else if (jsx != null && typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      if (typeof jsx.type === "string") {
        return {
          ...jsx,
          props: await renderJSXToClientJSX(jsx.props),
        };
      } else if (typeof jsx.type === "function") {
        const Component = jsx.type;
        const props = jsx.props;
        const returnedJsx = await Component(props);
        return renderJSXToClientJSX(returnedJsx);
      } else throw new Error("Not implemented.");
    } else {      
      return Object.fromEntries(
        await Promise.all(
          Object.entries(jsx).map(async ([propName, value]) => [
            propName,
            await renderJSXToClientJSX(value),
          ])
        )
      );
    }
  } else throw new Error("Not implemented");
}


export function stringifyJSX(key, value) {
  if (value === Symbol.for("react.element")) {
    // We can't pass a symbol, so pass our magic string instead.
    return "$RE"; // Could be arbitrary. I picked RE for React Element.
  } else if (typeof value === "string" && value.startsWith("$")) {
    // To avoid clashes, prepend an extra $ to any string already starting with $.
    return "$" + value;
  } else {
    return value;
  }
}
async function contentGenerator(postContent) {
  const Link = ({ href, children }) => {
    return <a href={href} className="link text-blue-500 hover:underline">{children}</a>
  }
  const Nav = () => <nav className="p-10 text-xl bg-blue-200 flex gap-10">
    <Link href="/hello">Hello</Link>
    <Link href="/world">World</Link>
  </nav>
  const Footer = () => <div className="px-10 py-4 text-xl bg-blue-200">footer</div>
  let jsx = (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>no.2</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="flex flex-col h-screen">
        <Nav />
        <input type="text" className='mx-10 my-4 border' />
        <div className="m-10 flex-1">{ postContent }</div>
        <Footer />
      </body>
    </html>
  )

  let html = renderToString(jsx)
  jsx = await renderJSXToClientJSX(jsx)
  jsx = JSON.stringify(jsx, stringifyJSX)

  
  html += `
      <script>
        window.__INITIAL_CLIENT_JSX_STRING__ = ${JSON.stringify(jsx)}
      </script>
      <script type="importmap">
        {
          "imports": {
            "react": "https://esm.sh/react@18.2.0",
            "react-dom/client": "https://esm.sh/react-dom@18.2.0/client?dev"
          }
        }
      </script>
      <script type="module" src="/client.js"></script>
  `

  return { html, jsx }
}

// 过滤 favicon 请求
app.use('/favicon.ico', (req, res, next) => {
  res.status(204).end(); // 返回204 No Content
});

app.get('/:route(*)', async (req, res) => {
  const route = req.params.route
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  try {
    const postContent = await readFile(`./posts/${route}.md`, 'utf8')
    if (req.headers['content-type'] === 'application/json') {
      res.setHeader("content-type", "application/json");
      res.send((await contentGenerator(postContent)).jsx)
    } else {
      res.setHeader("content-type", "text/html");
      res.send((await contentGenerator(postContent)).html)
    }
  } catch (error) {
    res.send('404')
    return
  }
})

app.listen(3000, (err) => {
  if (err) return console.error(err)
  console.log('Example app listening on port 3000! http://localhost:3000')
})