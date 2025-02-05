# UI Components Documentation

## Overview
This documentation covers all UI components (~4,500 lines) used in the application.

## Component Categories

### Form Components
- **Form (`form.tsx`)**: Base form component with validation
- **Input (`input.tsx`)**: Text input with validation
- **Select (`select.tsx`)**: Dropdown selection component
- **Checkbox (`checkbox.tsx`)**: Toggle selection
- **Radio (`radio-group.tsx`)**: Option selection
- **TextArea (`textarea.tsx`)**: Multi-line text input

### Navigation Components
- **Navigation Menu (`navigation-menu.tsx`)**: Main navigation
- **Sidebar (`sidebar.tsx`)**: Side navigation panel
- **Breadcrumb (`breadcrumb.tsx`)**: Path navigation
- **Pagination (`pagination.tsx`)**: Page navigation

### Layout Components
- **Card (`card.tsx`)**: Content container
- **Dialog (`dialog.tsx`)**: Modal windows
- **Sheet (`sheet.tsx`)**: Side panel
- **Tabs (`tabs.tsx`)**: Content organization
- **Accordion (`accordion.tsx`)**: Collapsible content

### Data Display Components
- **Table (`table.tsx`)**: Data grid
- **Chart (`chart.tsx`)**: Data visualization
- **Calendar (`calendar.tsx`)**: Date display
- **Progress (`progress.tsx`)**: Loading indicators

### Feedback Components
- **Toast (`toast.tsx`)**: Notifications
- **Alert (`alert.tsx`)**: User feedback
- **Tooltip (`tooltip.tsx`)**: Contextual help

## Implementation Details
Each component follows these principles:
- Fully typed with TypeScript
- Responsive design
- Accessibility compliance
- Theme customization
- Error handling

## Usage Examples
```tsx
// Form example
<Form onSubmit={handleSubmit}>
  <Input name="email" type="email" required />
  <Button type="submit">Submit</Button>
</Form>

// Navigation example
<NavigationMenu>
  <NavigationMenuItem>
    <Link href="/courses">Courses</Link>
  </NavigationMenuItem>
</NavigationMenu>
```

## Styling
Components use a combination of:
- Tailwind CSS for utility classes
- CSS modules for component-specific styles
- Theme variables for consistent branding
