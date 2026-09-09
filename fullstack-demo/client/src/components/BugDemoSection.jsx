import { BUG_SCENES } from '../config';
import './BugDemoSection.css';

export default function BugDemoSection({ onTestApi, onFrontendCrash }) {
  return (
    <div className="card">
      <h2>🐛 Bug 场景演示</h2>
      <p className="bug-desc">
        点下面的按钮，观察 Network 面板里的请求状态 → 理解"bug 在前端还是后端"
      </p>
      <div>
        {BUG_SCENES.map(scene => (
          <button
            key={scene.key}
            className={`btn ${scene.key === 'slow' ? 'btn-warn' : 'btn-danger'}`}
            onClick={() => onTestApi(scene.key, scene.path)}
          >
            {scene.label}
          </button>
        ))}
        <button className="btn btn-danger" onClick={onFrontendCrash}>🚫 前端自己崩</button>
      </div>
    </div>
  );
}
