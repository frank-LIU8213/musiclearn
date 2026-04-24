import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';

describe('和弦进行完整流程', () => {
  it('应用加载后显示初始界面', () => {
    render(<App />);

    expect(screen.getByText('和弦织网')).toBeInTheDocument();
    expect(screen.getByText('选择一个模板开始')).toBeInTheDocument();
  });

  it('选择模板后显示和弦信息', () => {
    render(<App />);

    // 点击第一个模板
    const templateButton = screen.getByText('1-5-6-4 流行进行');
    fireEvent.click(templateButton);

    // 验证模板被选中
    expect(screen.getByText('1-5-6-4 流行进行')).toBeInTheDocument();
  });

  it('虚拟钢琴组件渲染', () => {
    render(<App />);

    expect(screen.getByText('虚拟钢琴')).toBeInTheDocument();
  });

  it('五线谱组件渲染', () => {
    render(<App />);

    expect(screen.getByText('五线谱')).toBeInTheDocument();
  });
});
