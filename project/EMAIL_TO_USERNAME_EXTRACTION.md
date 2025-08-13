# Email to Username Extraction

## Overview

The system automatically extracts usernames from email addresses when display names are not available. This ensures users always have a readable name displayed throughout the application.

## Implementation

### Database Level (Supabase Functions)

1. **`get_user_display_name(user_uuid)`**: Retrieves or creates a display name for a user

   - Checks if a display name exists in the profile
   - If not, extracts the username part from the email (before '@')
   - Updates the profile with the extracted name
   - Returns the display name

2. **`initialize_user_profile(user_uuid, user_email, user_name)`**: Creates a new user profile

   - Uses provided name if available
   - Falls back to extracting username from email
   - Creates referral code and sets default values

3. **`handle_new_user()`**: Trigger function for new user signup
   - Automatically calls `initialize_user_profile` with user data
   - Ensures every new user gets a proper display name

### Frontend Level (React/TypeScript)

1. **`getUsernameFromEmail(email)`**: Utility function in `src/lib/userUtils.ts`

   - Extracts username from email address
   - Returns 'User' as fallback for invalid inputs

2. **`getUserDisplayName(userId)`**: Wrapper for Supabase function

   - Calls the database function to get/update display name
   - Handles errors gracefully

3. **Dashboard Component**: Implements the logic
   - Fetches user profile and ensures display name exists
   - Updates referral names using the same logic
   - Provides consistent user experience

## Examples

### Email to Username Extraction

| Email                  | Extracted Username |
| ---------------------- | ------------------ |
| `raksha@gmail.com`     | `raksha`           |
| `john.doe@company.com` | `john.doe`         |
| `user123@example.org`  | `user123`          |
| `invalid-email`        | `User` (fallback)  |
| `null` or `undefined`  | `User` (fallback)  |

### Usage in Components

```typescript
import { getUsernameFromEmail, getUserDisplayName } from "../../lib/userUtils";

// Extract username from email
const username = getUsernameFromEmail("raksha@gmail.com"); // Returns 'raksha'

// Get or update display name from database
const displayName = await getUserDisplayName(userId); // Returns 'raksha' (from email if no display name set)
```

## Benefits

1. **Consistent User Experience**: Users always see readable names instead of email addresses
2. **Automatic Fallback**: No manual intervention required for missing display names
3. **Database Consistency**: All profiles have proper display names
4. **Privacy Friendly**: Only shows username part, not full email
5. **Performance Optimized**: Updates happen automatically and are cached in profiles

## Migration Considerations

- Existing profiles without display names will be automatically updated when accessed
- The trigger ensures all new users get proper display names
- No data loss - original email addresses remain in auth.users table
- Function updates are idempotent and can be safely re-run

## Database Schema

The following tables are involved:

- `auth.users`: Contains email addresses
- `public.profiles`: Contains display_name field that gets auto-populated
- Functions handle the extraction and updating logic
- Triggers ensure automatic processing for new users
