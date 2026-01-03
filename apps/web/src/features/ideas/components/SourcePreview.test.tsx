import React from 'react';
import { render, screen } from '@testing-library/react';
import { SourcePreview } from './SourcePreview';
import { IdeaSource } from '../types';

describe('SourcePreview', () => {
  it('should render link source', () => {
    const source: IdeaSource = {
      type: 'link',
      url: 'https://example.com',
      meta: { title: 'Example' },
    };
    render(<SourcePreview source={source} />);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('should render image source', () => {
    const source: IdeaSource = {
      type: 'image',
      url: 'https://example.com/image.png',
    };
    render(<SourcePreview source={source} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', source.url);
  });

  it('should render text source', () => {
    // Note: Text source usually just content so handled by parent?
    // Logic check: original inline code handled showing text?
    // SourceInput had 'text' type but it was input textarea.
    // Wait, does IdeaSource type have 'text' that needs previewing differently?
    // Let's check SourceInput.tsx again.

    // In SourceInput:
    // {activeTab === 'text' && ( <textarea ... /> )}
    // But for *displaying* a saved source (if implemented), we need to see how stored.
    // AC 4 says "Full Image / Note".
    // Let's implement text support too.

    const source: IdeaSource = {
      type: 'text',
      content: 'Some note',
    };
    render(<SourcePreview source={source} />);
    expect(screen.getByText('Some note')).toBeInTheDocument();
  });
});
