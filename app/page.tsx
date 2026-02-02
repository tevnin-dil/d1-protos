import { Card } from '../wireframe-primitives/Card';
import { Divider } from '../wireframe-primitives/Divider';

export default function Home() {
  return (
    <main>
      <h1>Tami's Experiments</h1>
      <p>A minimal prototyping environment for UX experiments.</p>

      <Divider />

      <Card>
        <h2>Experiments</h2>
        <ul>
          <li>
            <a href="/experiments/capability-carousel">Capability Carousel</a>
            <span style={{ fontSize: '12px', color: '#737373', marginLeft: '8px' }}>
              — Dynamic prompt suggestions based on role &amp; activity
            </span>
          </li>
          <li style={{ marginTop: '12px' }}>
            <a href="/experiments/cross-product-access">Cross-Product Access</a>
            <span style={{ fontSize: '12px', color: '#737373', marginLeft: '8px' }}>
              — AI discovery without commercial friction
            </span>
          </li>
          <li style={{ marginTop: '12px' }}>
            <a href="/experiments/contextual-launch-pads">Contextual Launch Pads</a>
            <span style={{ fontSize: '12px', color: '#737373', marginLeft: '8px' }}>
              — Distributed micro-prompts where work happens
            </span>
            <ul style={{ marginTop: '8px', fontSize: '14px' }}>
              <li><a href="/experiments/contextual-launch-pads/board">Board Page</a></li>
              <li><a href="/experiments/contextual-launch-pads/filing">Filing Detail</a></li>
              <li><a href="/experiments/contextual-launch-pads/entity">Entity Overview</a></li>
            </ul>
          </li>
          <li style={{ marginTop: '12px' }}>
            <a href="/experiments/ai-studio-lite">AI Studio Lite</a>
            <span style={{ fontSize: '12px', color: '#737373', marginLeft: '8px' }}>
              — Template gallery making "limited" feel "curated"
            </span>
            <ul style={{ marginTop: '8px', fontSize: '14px' }}>
              <li><a href="/experiments/ai-studio-lite/template?id=board-report">Template Detail View</a></li>
            </ul>
          </li>
          <li style={{ marginTop: '12px' }}>
            <a href="/experiments/mobile-first">Mobile-First AI</a>
            <span style={{ fontSize: '12px', color: '#737373', marginLeft: '8px' }}>
              — Output-focused mobile UX for GRC workflows
            </span>
          </li>
          
        </ul>
      </Card>
    </main>
  );
}
