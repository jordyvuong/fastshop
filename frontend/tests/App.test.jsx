import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App Component', () => {
  it('should render FastShop title', () => {
    render(<App />);
    expect(screen.getByText(/FastShop/i)).toBeInTheDocument();
  });
});
