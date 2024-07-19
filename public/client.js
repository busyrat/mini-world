console.log('use client')
import { hydrateRoot } from 'react-dom/client';

function parseJSX(key, value) {
  if (value === "$RE") {
    return Symbol.for("react.element");
  } else if (typeof value === "string" && value.startsWith("$$")) {
    return value.slice(1);
  } else {
    return value;
  }
}

const root = hydrateRoot(document, JSON.parse(window.__INITIAL_CLIENT_JSX_STRING__, parseJSX));

async function navigate (pathname) {
  console.log('navigate', pathname)
  const response = await fetch(pathname, {
    headers: new Headers({
      'content-type': 'application/json',
    })
  })
  const jsx = await response.text()
  root.render(JSON.parse(jsx, parseJSX));
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

import React from 'react';
const postContent = ''
const Link = ({ href, children }) => {
  return React.createElement("a", { href: href, className: "link text-blue-500 hover:underline" }, children);
};
const Nav = () => React.createElement("nav", { className: "p-10 text-xl bg-blue-200 flex gap-10" },
  React.createElement(Link, { href: "/hello" }, "Hello"),
  React.createElement(Link, { href: "/world" }, "World"));
const Footer = () => React.createElement("div", { className: "px-10 py-4 text-xl bg-blue-200" }, "footer");
let jsx = (React.createElement("html", { lang: "en" },
  React.createElement("head", null,
      React.createElement("meta", { charSet: "UTF-8" }),
      React.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }),
      React.createElement("title", null, "no.2"),
      React.createElement("script", { src: "https://cdn.tailwindcss.com" })),
  React.createElement("body", { className: "flex flex-col h-screen" },
      React.createElement(Nav, null),
      React.createElement("input", { type: "text", className: 'mx-10 my-4 border' }),
      React.createElement("div", { className: "m-10 flex-1" }, postContent),
      React.createElement(Footer, null))));
console.log(jsx);