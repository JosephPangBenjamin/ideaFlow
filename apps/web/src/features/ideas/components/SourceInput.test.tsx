import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SourceInput } from './SourceInput';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as api from '../../../services/api';

// Mock API service
vi.mock('../../../services/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('SourceInput', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders source type tabs', () => {
    render(<SourceInput value={undefined} onChange={mockOnChange} />);
    expect(screen.getByText('链接')).toBeInTheDocument();
    expect(screen.getByText('图片')).toBeInTheDocument();
    expect(screen.getByText('备注')).toBeInTheDocument();
  });

  it('switches to text input when text tab clicked', () => {
    render(<SourceInput value={undefined} onChange={mockOnChange} />);
    fireEvent.click(screen.getByText('备注'));
    expect(screen.getByPlaceholderText('输入备注...')).toBeInTheDocument();
  });

  it('calls onChange when text is entered', () => {
    render(<SourceInput value={{ type: 'text', content: '' }} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('输入备注...');
    fireEvent.change(input, { target: { value: 'Test note' } });
    expect(mockOnChange).toHaveBeenCalledWith({ type: 'text', content: 'Test note' });
  });

  it('fetches link preview when URL is entered', async () => {
    const mockPreviewData = { title: 'Example', url: 'https://example.com' };
    (api.api.post as any).mockResolvedValue({ data: mockPreviewData });

    render(<SourceInput value={{ type: 'link', url: '' }} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('输入链接 URL...');

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.blur(input); // Trigger preview on blur

    await waitFor(() => {
      expect(api.api.post).toHaveBeenCalledWith('/meta/preview', { url: 'https://example.com' });
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'link',
          url: 'https://example.com',
          meta: mockPreviewData,
        })
      );
    });
  });
  it('uploads image without manually setting Content-Type header', async () => {
    const user = userEvent.setup();
    (api.api.post as any).mockResolvedValue({ data: { url: '/uploads/test.png' } });
    render(<SourceInput value={{ type: 'image', url: '' }} onChange={mockOnChange} />);

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]');

    await user.upload(input!, file);

    await waitFor(() => {
      // Check that it was called with formData
      const formData = (api.api.post as any).mock.calls[0][1];
      expect(formData).toBeInstanceOf(FormData);

      // Check that the third argument (config) is undefined or does not contain Content-Type
      const config = (api.api.post as any).mock.calls[0][2];
      expect(config).toBeUndefined();
    });
  });
});
