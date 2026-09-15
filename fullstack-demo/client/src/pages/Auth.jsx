import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Auth() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 已登录直接跳转首页
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const resetMsgs = () => {
    setError('');
    setSuccess('');
  };

  const switchTab = (t) => {
    setTab(t);
    resetMsgs();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMsgs();

    // 前端校验
    if (!username.trim() || !password.trim()) {
      setError('请填写用户名和密码');
      return;
    }
    if (tab === 'register') {
      if (password.length < 6) {
        setError('密码至少 6 位');
        return;
      }
      if (password !== confirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }
      if (!email.trim()) {
        setError('请填写邮箱');
        return;
      }
    }

    setLoading(true);
    try {
      if (tab === 'login') {
        await login(username.trim(), password);
        navigate('/', { replace: true });
      } else {
        await register(username.trim(), password, email.trim());
        setSuccess('注册成功！请登录');
        setTab('login');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.message || '请求失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎯 全栈 Demo</h1>
          <p>React + NestJS 登录注册</p>
        </div>

        {/* Tab 切换 */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
            type="button"
          >
            登录
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => switchTab('register')}
            type="button"
          >
            注册
          </button>
        </div>

        {/* 表单 */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div className="form-group">
              <label>邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
          )}

          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>密码</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === 'register' ? '至少 6 位' : '请输入密码'}
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
              >
                {showPassword ? (
                  // 闭眼 icon
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  // 睁眼 icon
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {tab === 'register' && (
            <div className="form-group">
              <label>确认密码</label>
              <div className="password-wrapper">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? '隐藏密码' : '显示密码'}
                >
                  {showConfirm ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 消息提示 */}
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? '处理中...' : tab === 'login' ? '登录' : '注册'}
          </button>
        </form>

        <div className="auth-footer">
          {tab === 'login' ? (
            <span>
              还没有账号？
              <button type="button" className="link-btn" onClick={() => switchTab('register')}>
                立即注册
              </button>
            </span>
          ) : (
            <span>
              已有账号？
              <button type="button" className="link-btn" onClick={() => switchTab('login')}>
                去登录
              </button>
            </span>
          )}
        </div>
      </div>

      <div className="auth-tip">
        <p>💡 小提示：打开 F12 → Network 面板，观察注册 /auth/register 和登录 /auth/login 的请求过程</p>
      </div>
    </div>
  );
}
