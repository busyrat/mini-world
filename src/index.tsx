import express from 'express'
import { readFile } from "fs/promises";
import path from 'path'
import React from 'react'
import { renderToString } from 'react-dom/server'

const app = express()

console.log();

app.use(express.static(path.join(__dirname, '../public')));

function htmlGenerator(postContent) {
  const Link = ({ href, children }) => {
    return <a href={href} className="link text-blue-500 hover:underline">{children}</a>
  }
  const Nav = () => <nav className="p-10 text-xl bg-blue-200 flex gap-10">
    <Link href="/hello">Hello</Link>
    <Link href="/world">World</Link>
  </nav>
  const Footer = () => <div className="px-10 py-4 text-xl bg-blue-200">footer</div>
  const jsx = (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>no.2</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="flex flex-col h-screen">
        <Nav />
        <div className="p-10 flex-1">{ postContent }</div>
        <Footer />
      </body>
      <script src="/client.js"></script>
    </html>
  )

  return renderToString(jsx)
}

app.get('/:route(*)', async (req, res) => {
  const route = req.params.route
  const url = new URL(req.url, `http://${req.headers.host}`);
  // console.log(req.url, url);
  
  try {
    const postContent = await readFile(`./posts/${route}.md`, 'utf8')
    res.setHeader("Content-Type", "text/html");
    res.send(htmlGenerator(postContent))
  } catch (error) {
    res.send('404')
    return
  }
})

app.listen(3000, (err) => {
  if (err) return console.error(err)
  console.log('Example app listening on port 3000! http://localhost:3000')
})