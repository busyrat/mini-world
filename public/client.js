console.log('use client')

async function navigate (pathname) {
  console.log('navigate', pathname)
  const response = await fetch(pathname)
  const html = await response.text()
  //  获取其中的 body 标签内容
  const res = /<body(.*?)>/.exec(html);
  const bodyStartIndex = res.index + res[0].length
  const bodyEndIndex = html.lastIndexOf("</body>");
  const bodyHTML = html.slice(bodyStartIndex, bodyEndIndex);
  console.log(bodyHTML);
  // 简单粗暴的直接替换 HTML
  document.body.innerHTML = bodyHTML;
  bindEvent()
}

function bindEvent() {
  document.querySelectorAll('.link').forEach((linkNode) => {
    linkNode.addEventListener('click', (e) => {
      e.preventDefault()
      const href = e.target.getAttribute("href");
      window.history.pushState({}, '', href)
      navigate(href)
    }, true)
  })
}

window.addEventListener("popstate", () => {
  // 处理浏览器前进后退事件
  navigate(window.location.pathname);
});

bindEvent()