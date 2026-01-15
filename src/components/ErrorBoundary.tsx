import React, { Component, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
    children: ReactNode;
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
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
  color: #fff;
  text-align: center;
`;

const ErrorContainer = styled.div`
  max-width: 600px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: shake 0.5s ease-in-out;

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const ReloadButton = styled.button`
  padding: 1rem 2.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px 0 rgba(102, 126, 234, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorDetails = styled.details`
  margin-top: 2rem;
  text-align: left;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 10px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  max-height: 200px;
  overflow-y: auto;

  summary {
    cursor: pointer;
    font-weight: 600;
    margin-bottom: 0.5rem;
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

    static getDerivedStateFromError(error: Error): Partial<State> {
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

        // TODO: Send error to error tracking service (e.g., Sentry)
        // Example: Sentry.captureException(error, { errorInfo });
    }

    handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <ErrorFallback>
                    <ErrorContainer>
                        <ErrorIcon>🛡️</ErrorIcon>
                        <ErrorTitle>Oops! Something went wrong</ErrorTitle>
                        <ErrorMessage>
                            We're sorry for the inconvenience. An unexpected error occurred while rendering this page.
                            Please try reloading the page or contact support if the problem persists.
                        </ErrorMessage>
                        <ReloadButton onClick={this.handleReload}>
                            Reload Page
                        </ReloadButton>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
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
