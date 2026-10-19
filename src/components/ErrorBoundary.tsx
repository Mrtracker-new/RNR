import React, { Component, ReactNode } from 'react';
import styled from 'styled-components';
import { glassSurface } from '../styles/surfaces';
import { ShieldSVG } from './icons';

interface Props {
    children: ReactNode;
    /** Optional custom fallback UI rendered instead of the full-screen overlay. */
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

const ErrorFallback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-8);
  background: var(--bg-base);
  color: var(--dark-100);
  text-align: center;
`;

const ErrorContainer = styled.div`
  ${glassSurface};
  border-radius: var(--radius-2xl);
  max-width: 600px;
  padding: var(--spacing-12);
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--spacing-6);
  animation: shake 0.5s ease-in-out;

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: var(--spacing-4);
  color: var(--dark-50);
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  margin-bottom: var(--spacing-8);
  color: var(--dark-400);
  line-height: var(--leading-relaxed);
`;

const ReloadButton = styled.button`
  padding: var(--spacing-4) var(--spacing-10);
  font-size: 1rem;
  font-weight: var(--font-semibold);
  color: #ffffff;
  background: var(--accent-fill);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover { background: var(--accent-fill-hover); }
  &:active { background: var(--accent-fill-press); }
`;

const PageErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary, #aaa);

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--text-primary, #fff);
  }

  button {
    margin-top: 1.25rem;
    padding: 0.6rem 1.5rem;
    border: 1px solid var(--accent-primary, #3b82f6);
    border-radius: 999px;
    background: transparent;
    color: var(--accent-primary, #3b82f6);
    cursor: pointer;
    font-size: 0.95rem;
    transition: background 0.2s;

    &:hover {
      background: var(--accent-primary, #3b82f6);
      color: #fff;
    }
  }
`;

/* Inline fallback used by route-level boundaries so a single page can fail
   without taking the whole shell down. */
export function PageError({ message }: { message: string }) {
    return (
        <PageErrorWrapper role="alert">
            <h2>{message}</h2>
            <p>Please try refreshing the page.</p>
            <button onClick={() => window.location.reload()}>Reload</button>
        </PageErrorWrapper>
    );
}

const ErrorDetails = styled.details`
  margin-top: var(--spacing-8);
  text-align: left;
  background: rgba(0, 0, 0, 0.2);
  padding: var(--spacing-4);
  border-radius: 10px;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.7);
  max-height: 200px;
  overflow-y: auto;

  summary {
    cursor: pointer;
    font-weight: var(--font-semibold);
    margin-bottom: var(--spacing-2);
    color: rgba(255, 255, 255, 0.9);
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(_error: Error): Partial<State> {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Log error details for debugging
        console.error('Error Boundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

    }

    handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Use caller-supplied fallback when provided
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <ErrorFallback>
                    <ErrorContainer>
                        <ErrorIcon>
                            <ShieldSVG size={56} />
                        </ErrorIcon>
                        <ErrorTitle>Oops! Something went wrong</ErrorTitle>
                        <ErrorMessage>
                            We're sorry for the inconvenience. An unexpected error occurred while rendering this page.
                            Please try reloading the page or contact support if the problem persists.
                        </ErrorMessage>
                        <ReloadButton onClick={this.handleReload}>
                            Reload Page
                        </ReloadButton>

                        {import.meta.env.DEV && this.state.error && (
                            <ErrorDetails>
                                <summary>Error Details (Development Only)</summary>
                                <pre>
                                    <strong>Error:</strong> {this.state.error.toString()}
                                    {'\n\n'}
                                    <strong>Component Stack:</strong>
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </ErrorDetails>
                        )}
                    </ErrorContainer>
                </ErrorFallback>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
