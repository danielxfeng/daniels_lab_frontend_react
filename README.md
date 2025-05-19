# a_blog_frontend_react_vite

A SPA for a blog system built with **React** and **Vite**.

## Getting Started

Before starting the frontend, make sure the backend demo is running:  
[https://github.com/danielxfeng/a_blog_backend_node/tree/main](https://github.com/danielxfeng/a_blog_backend_node/tree/main)


### Setup

```bash
git clone https://github.com/danielxfeng/a_blog_frontend_react.git frontend_react
cd frontend_react
npm install
npm run dev
```

Once running, open your browser at:
[http://localhost:5173/](http://localhost:5173/)

## Todo
- **Authentication Bug**: Users may be logged out unexpectedly.
- **Search bar** and **Tags selection** are not connected to backend yet.
- **Tags selection Bug**: The current suggestion fetch may have a race conditions: the return value of an older request may override newer ones in the suggestion list.