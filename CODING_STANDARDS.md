## Style Guide

We follow a minimalist style guide using Shad cn components - default design with padding reduction adjustments for more real estate on mobile devices

## TypeScript

Only define types
Interfaces are only used in the mongoDB models: interface ModelInterface extends Document {...}
Declare component props in component file using: type ComponentNameProps = {...}

## File and Folder Structure

Use the /app directory for routing
Use the /api directory folder system for structuring API routing
Place reusable components in /components
Components folder default structure:
/components
/journal
/habits
/goals
/ui (shad cn components)
Use /utils for utility functions and shared logic
Store types in /types
Keep styles in /styles

## Naming Conventions

Use PascalCase for React components: UserProfile.tsx
Use camelCase for functions and variables: getUserData()
Use UPPER_CASE for constants: const API_URL = '...'
Prefix boolean variables with "is", "has", or "should": isLoading, hasError

## Import Order / Component Structure

// React imports
import { useState } from 'react'
// Component imports
// UI component imports
import { Button } from '@/components/ui/button'
// Utils imports
// Icon imports
// Type imports
import type { dataType } from '@/types'
// Custom Hook imports

type ComponentNameProps {
dataKey: string
}

export function ComponentName({ propKey }: ComponentNameProps) {
const [data, setData] = useState<dataType | null>(null)

// Component logic here

return (
<>
{/_ Component JSX _/}
</>
)
}

## Named Exports

Use named exports: export function ComponentName() {...}
For pages and layouts in the App Router: export default function Page() {...}
For async server components, always use async function: export async function ServerComponent() {...}
