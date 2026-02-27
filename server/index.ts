import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

import convertRouter from './routes/convert';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API 文档
app.get('/api', (_req, res) => {
  res.json({
    name: 'MD2Anything API',
    version: '1.0.0',
    endpoints: {
      'POST /api/convert/html': 'Convert Markdown to styled HTML',
      'POST /api/convert/email': 'Convert Markdown to email-compatible HTML',
      'POST /api/convert/wechat': 'Convert Markdown to WeChat-compatible HTML',
      'POST /api/convert/plain': 'Convert Markdown to plain HTML',
      'GET /api/convert/templates': 'Get all available templates',
    },
  });
});

// API 路由
app.use('/api/convert', convertRouter);

// 404 处理
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
  });
});

// 错误处理
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║     MD2Anything API Server                  ║
║     Running on http://localhost:${PORT}       ║
╚════════════════════════════════════════════╝

API Endpoints:
  GET  /api                        - API documentation
  GET  /health                     - Health check
  POST /api/convert/html           - Convert MD to styled HTML
  POST /api/convert/email          - Convert MD to email HTML
  POST /api/convert/wechat         - Convert MD to WeChat HTML
  POST /api/convert/plain          - Convert MD to plain HTML
  GET  /api/convert/templates      - List all templates
`);
});

export default app;
