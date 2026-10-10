import { Component, type ReactNode } from 'react'

/**
 * Catches a failure in the 3D layer: the three.js chunk not loading, WebGL
 * failing to start, or a scene throwing. The page then carries on as the
 * plain version instead of going blank.
 */
export class StageBoundary extends Component<{
  onError: () => void
  children: ReactNode
}> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('3D layer failed; showing the plain page.', error)
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
