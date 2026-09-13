// 🔑 后端 API 地址常量（集中管理，方便修改）
export const API_BASE = 'http://localhost:3000';

// Bug 场景列表（用来演示各种错误类型）
export const BUG_SCENES = [
  { key: 'slow', label: '⏱️ 慢接口（3秒延迟）', path: '/bug/timeout' },
  { key: 'crash', label: '💥 后端 crash（500）', path: '/bug/crash' },
  { key: 'format', label: '📐 格式不统一', path: '/bug/format' },
  { key: 'unauth', label: '🔒 未授权（401）', path: '/bug/unauthorized' },
];
