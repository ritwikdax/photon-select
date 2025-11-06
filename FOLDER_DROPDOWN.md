# Folder Dropdown Implementation

This implementation provides a beautiful dropdown component that loads folder data from an API and provides the selected folder ID as context throughout the application.

## Features

- 🎨 **Beautiful UI**: Modern dropdown with smooth animations and hover effects
- 🌙 **Dark Mode Support**: Fully responsive to light/dark theme
- 🔄 **Loading States**: Proper loading indicators and error handling
- 📱 **Responsive Design**: Works on all screen sizes
- 🎯 **Context Integration**: Selected folder available throughout the app
- 🚀 **TypeScript**: Fully typed for better development experience

## Components Created

### 1. FolderDropdown Component
`app/components/FolderDropdown.tsx`

A beautiful dropdown component with:
- Folder icon and smooth animations
- Click outside to close functionality
- Loading and error states
- Keyboard accessibility

### 2. FolderContext Provider
`app/context/FolderContext.tsx`

Manages folder state across the application:
- Fetches folders on mount
- Maintains selected folder state
- Provides refresh functionality
- Error handling

### 3. Custom Hooks
`app/hooks/useFolders.ts`

Convenient hooks for accessing folder data:
- `useSelectedFolderId()` - Get just the folder ID
- `useSelectedFolder()` - Get complete folder object
- `useFolders()` - Full folder management operations

### 4. Folder Service
`app/services/folderService.ts`

API service for fetching folders:
- Mock data for testing (currently active)
- Ready for real API integration

## API Response Format

The folder service expects this response format:

```json
{
  "folders": [
    {
      "folderId": "1uKMvTPn5AX1_TBlPeRFInXOWgatMK4jN",
      "name": "RONNIE  180 EDITED PHOTOS"
    },
    {
      "folderId": "1JishiWfHoqJf17Aed_PpUWMVlKNVM5gB",
      "name": "Bride Side"
    }
  ]
}
```

## Usage Examples

### Basic Usage in Components

```tsx
import { useSelectedFolderId, useSelectedFolder } from '../hooks/useFolders';

function MyComponent() {
  const selectedFolderId = useSelectedFolderId();
  const selectedFolder = useSelectedFolder();
  
  return (
    <div>
      <p>Current Folder: {selectedFolder?.name}</p>
      <p>Folder ID: {selectedFolderId}</p>
    </div>
  );
}
```

### Full Folder Management

```tsx
import { useFolders } from '../hooks/useFolders';

function FolderManager() {
  const { 
    folders, 
    selectedFolder, 
    isLoading, 
    error, 
    setSelectedFolder,
    refreshFolders 
  } = useFolders();
  
  const handleRefresh = () => {
    refreshFolders();
  };
  
  return (
    <div>
      <button onClick={handleRefresh}>Refresh Folders</button>
      {/* Your component logic */}
    </div>
  );
}
```

### Using in API Calls

```tsx
import { useSelectedFolderId } from '../hooks/useFolders';
import { imageService } from '../services/imageService';

function ImageLoader() {
  const selectedFolderId = useSelectedFolderId();
  
  const loadImages = async () => {
    const images = await imageService.fetchImages({
      folderId: selectedFolderId || undefined
    });
    // Handle images...
  };
  
  // Reload when folder changes
  useEffect(() => {
    if (selectedFolderId) {
      loadImages();
    }
  }, [selectedFolderId]);
}
```

## Integration Steps

1. **Install the context provider** (Already done in `layout.tsx`):
```tsx
<FolderProvider>
  <YourApp />
</FolderProvider>
```

2. **Add the dropdown to your header** (Already done in `Header.tsx`):
```tsx
<FolderDropdown />
```

3. **Use the hooks in your components**:
```tsx
const selectedFolderId = useSelectedFolderId();
```

## Switching to Real API

To use your actual API instead of mock data:

1. Open `app/services/folderService.ts`
2. Comment out the mock data return
3. Uncomment the real API call section
4. Update the API endpoint URL

```typescript
// Replace this URL with your actual endpoint
const url = `${API_BASE_URL}/api/folders`;
```

## Current Demo

The application includes a `FolderDemo` component that shows:
- Currently selected folder ID
- Selected folder name
- List of all available folders
- Real-time updates when selection changes

This demo can be removed in production by removing `<FolderDemo />` from `page.tsx`.

## Styling

The dropdown uses Tailwind CSS classes and includes:
- Smooth transitions and animations
- Dark mode support
- Hover and focus states
- Mobile-responsive design
- Proper contrast and accessibility

## Error Handling

The implementation includes robust error handling:
- Network errors when fetching folders
- Loading states during API calls
- Graceful fallbacks for missing data
- User-friendly error messages