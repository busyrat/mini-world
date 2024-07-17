import express from 'express'
import { readFile } from "fs/promises";
import path from 'path'

const app = express()

console.log();

app.use(express.static(path.join(__dirname, '../public')));

function htmlGenerator(postContent) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div class="p-10 text-xl bg-blue-200">nav</div>
      <div class="p-10">${postContent}</div>
    </body>
    </html>
  `
}

app.get('/:route(*)', async (req, res) => {
  const route = req.params.route
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