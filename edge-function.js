// ESA Edge Function - 处理 SPA 路由
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  // 静态资源直接返回
  if (url.pathname.startsWith('/assets/') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.ico')) {
    return fetch(request);
  }

  // SPA 路由 - 返回 index.html
  const indexUrl = new URL('/index.html', url.origin);
  return fetch(indexUrl);
}
