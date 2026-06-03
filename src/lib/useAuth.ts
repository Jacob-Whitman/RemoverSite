// Re-exports useAuth from App context for use in components.
// Separated to satisfy react-refresh lint rule (non-component exports must be in their own file).
export { useAuth } from '../lib/authContext'
