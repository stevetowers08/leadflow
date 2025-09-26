import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ComponentErrorBoundary } from '@/components/ErrorBoundary';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export class PopupErrorBoundary extends Component<Props, {}> {
  render() {
    return (
      <ComponentErrorBoundary fallback={this.props.fallback}>
        {this.props.children}
      </ComponentErrorBoundary>
    );
  }
}

