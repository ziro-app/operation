import React, { ReactNode } from "react"
import { Route as WRoute } from "wouter"
import { useUser } from "reactfire"

/**
 * A Route component that renders its children or a fallback based on whether the route is public, publicOnly or private
 *
 * Routes that are neither private nor publicOnly are public, meaning any user can see it
 *
 * @param isPublicOnly A boolean that indicates that a route is publicOny (only unauthenticated users can see it, like a login page)
 *
 * @param isPrivate A boolean that indicates that a route is private (only authenticated users can see it)
 *
 * @param PublicOnlyFallback The component to be rendered when a publicOnly route is accessed by an authenticated user ("you've already logged in")
 *
 * @param PrivateFallback The component to be rendered when a private route is accessed by an unauthenticated user
 *
 * @param path The route to match
 *
 * @param children The component to be rendered in all other scenarios
 */

interface CommonProps {
  PublicOnlyFallback?: ReactNode
  PrivateFallback?: ReactNode
  path: string
  children: ReactNode
}

interface isPublicOnlyProps extends CommonProps {
  isPublicOnly: true
  isPrivate?: never
}

interface isPrivateProps extends CommonProps {
  isPublicOnly?: never
  isPrivate: true
}

interface isPublicProps extends CommonProps {
  isPublicOnly?: never
  isPrivate?: never
}

type RouteProps = isPublicOnlyProps | isPrivateProps | isPublicProps

const Route = ({ isPublicOnly, isPrivate, PublicOnlyFallback, PrivateFallback, path, children }: RouteProps) => {
  const user = useUser()
  const isLogged = !!user.data
  /** if user is logged in and route is publicOnly (i.e reset password, login), render fallback */
  if (isLogged && isPublicOnly) return <>{PublicOnlyFallback}</>
  /** if user is not logged in and route is private, render the login component */
  if (!isLogged && isPrivate) return <>{PrivateFallback}</>
  /** otherwise, render the children */
  return <WRoute path={path}>{children}</WRoute>
}

export default Route

/** DETAILED COMPONENT LOGIC
 * if user is logged in and route is publicOnly (i.e reset password, login), render fallback
 * if (isLogged && isPublicOnly) return <div>fallback</div>
 *
 * if user is logged in and route is not publicOnly, render the children
 * if (isLogged && !isPublicOnly) return <WRoute>{children}</WRoute>
 *
 * if user is not logged in and route is publicOnly, render the children
 * if (!isLogged && isPublicOnly) return <WRoute>{children}</WRoute>
 *
 * if user is not logged in and route is not publicOnly, render the children
 * if (!isLogged && !isPublicOnly) return <WRoute>{children}</WRoute>
 *
 * if user is logged in and route is private, render the children
 * if (isLogged && isPrivate) return <WRoute>{children}</WRoute>
 *
 * if user is logged in and route is not private (i.e public), render the children
 * if (isLogged && !isPrivate) return <WRoute>{children}</WRoute>
 *
 * if user is not logged in and route is private, render the login component
 * if (!isLogged && isPrivate) return <div>Login</div>
 *
 * if user is not logged in and route is not private (i.e public), render the children
 * if (!isLogged && !isPrivate) return <WRoute>{children}</WRoute>
 */
