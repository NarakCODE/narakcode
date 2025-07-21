# Design Document

## Overview

This design outlines the integration of the enhanced CopyButton component into existing code block components. The integration will enhance user experience by providing visual package manager icons, improved copy feedback, and more robust copy functionality while maintaining backward compatibility with existing implementations.

## Architecture

### Component Structure

```
src/components/
├── ui/
│   └── copybutton.tsx (source component with enhanced features)
├── code-block-command.tsx (target for integration)
├── code-tabs.tsx (target for integration)
└── copy-button.tsx (existing simple copy button)
```

### Integration Strategy

1. **Extract Reusable Components**: Extract the package manager icons and enhanced copy logic from `copybutton.tsx` into reusable components
2. **Enhance Existing Components**: Integrate the enhanced functionality into `code-block-command.tsx` and `code-tabs.tsx`
3. **Maintain Compatibility**: Ensure existing functionality continues to work while adding new features

## Components and Interfaces

### Enhanced Package Manager Icons

```typescript
interface IconProps {
  className?: string;
  active?: boolean;
}

type PackageManagerIcon = React.ComponentType<IconProps>;

interface PackageManagerConfig {
  id: "npm" | "pnpm" | "yarn" | "bun";
  label: string;
  icon: PackageManagerIcon;
  command: string;
  color: string; // Brand color for active state
}
```

### Enhanced Copy Button

```typescript
interface EnhancedCopyButtonProps {
  value: string;
  className?: string;
  onCopy?: (success: boolean) => void;
}

interface CopyState {
  copied: boolean;
  error?: string;
}
```

### Updated Code Block Command Component

```typescript
interface CodeBlockCommandProps extends NpmCommands {
  // Existing props maintained
}

interface PackageManagerTab {
  id: PackageManager;
  label: string;
  icon: PackageManagerIcon;
  command: string;
}
```

## Data Models

### Package Manager Configuration

```typescript
const PACKAGE_MANAGERS: Record<PackageManager, PackageManagerConfig> = {
  npm: {
    id: "npm",
    label: "npm",
    icon: NpmIcon,
    command: "npx",
    color: "#CB3837",
  },
  pnpm: {
    id: "pnpm",
    label: "pnpm",
    icon: PnpmIcon,
    command: "pnpm dlx",
    color: "#F69220",
  },
  yarn: {
    id: "yarn",
    label: "yarn",
    icon: YarnIcon,
    command: "yarn dlx",
    color: "#2C8EBB",
  },
  bun: {
    id: "bun",
    label: "bun",
    icon: BunIcon,
    command: "bunx",
    color: "#FBF0DF",
  },
};
```

### Copy Functionality

```typescript
interface CopyMechanism {
  name: string;
  execute: (text: string) => Promise<boolean>;
  isSupported: () => boolean;
}

const COPY_MECHANISMS: CopyMechanism[] = [
  {
    name: "execCommand",
    execute: execCommandCopy,
    isSupported: () => document.execCommand !== undefined,
  },
  {
    name: "clipboardAPI",
    execute: clipboardAPICopy,
    isSupported: () => navigator.clipboard?.writeText !== undefined,
  },
];
```

## Error Handling

### Copy Operation Error Handling

1. **Primary Method**: Attempt `document.execCommand('copy')` first as it's more reliable in various contexts
2. **Fallback Method**: Use `navigator.clipboard.writeText()` if execCommand fails
3. **Error Logging**: Log specific error messages for debugging
4. **User Feedback**: Provide visual feedback for both success and failure states
5. **Graceful Degradation**: Continue functioning even if copy fails

### Browser Compatibility

- Support for older browsers through `document.execCommand`
- Modern browser support through Clipboard API
- Fallback handling for restricted environments (iframes, HTTPS requirements)

## Testing Strategy

### Unit Tests

1. **Icon Components**: Test that icons render correctly with active/inactive states
2. **Copy Functionality**: Test copy mechanisms with mocked clipboard APIs
3. **Package Manager Selection**: Test that correct commands are generated for each package manager
4. **Error Handling**: Test fallback mechanisms when copy operations fail

### Integration Tests

1. **Code Block Command**: Test that enhanced copy button integrates correctly
2. **Code Tabs**: Test that package manager selection works with enhanced features
3. **State Management**: Test that configuration state is maintained correctly
4. **Visual Feedback**: Test that success/error states display correctly

### Visual Tests

1. **Icon Rendering**: Verify package manager icons display with correct colors
2. **Animation States**: Verify copy button animations work smoothly
3. **Responsive Design**: Verify components work across different screen sizes
4. **Theme Compatibility**: Verify components work in light/dark themes

## Implementation Phases

### Phase 1: Extract Reusable Components

- Extract package manager icons from `copybutton.tsx`
- Create enhanced copy hook with fallback mechanisms
- Create package manager configuration constants

### Phase 2: Enhance Code Block Command

- Integrate enhanced copy button into `code-block-command.tsx`
- Add package manager icons to tabs
- Implement visual feedback for copy operations

### Phase 3: Enhance Code Tabs

- Integrate enhanced functionality into `code-tabs.tsx`
- Ensure configuration management works with new features
- Add visual enhancements while maintaining existing behavior

### Phase 4: Testing and Refinement

- Implement comprehensive test suite
- Test across different browsers and environments
- Refine error handling and user feedback
- Performance optimization and cleanup
