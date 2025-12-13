# Profile Feature

This feature provides user profile pages with viewing and editing capabilities for the Sutoor blog platform.

## 📁 Structure

```
profile/
├── index.tsx                  ← Feature exports
├── user-profile.tsx           ← Main profile component
├── edit-profile-dialog.tsx    ← Edit profile modal
└── README.md                  ← This file
```

## 🔄 Data Flow

```
Profile Page (Server Component)
       ↓
getUserProfile() action
    ↓
  ProfileService (Server)
       ↓
   UserProfile (Client Component)
       ↓
   ┌───┴────┬────────────┐
   ↓        ↓            ↓
PostCard  Tabs  EditProfileDialog
                        ↓
            updateUserProfile() action
```

## ✨ Features

### MVP (Current Implementation)

- **User Info Display**: Avatar, name, email, bio, join date
- **Post Statistics**: Total posts count
- **User's Published Posts**: Grid view of all published articles
- **Edit Profile**: Modal dialog for updating name and bio (owner only)
- **Tabs**: Posts and About sections
- **Role Badge**: Shows "Admin" badge for admin users

### Components

#### UserProfile

Main profile display component with:

- Profile header with avatar and stats
- Tabbed interface (Posts/About)
- Post grid with responsive layout
- Edit profile button (shown only to profile owner)

#### EditProfileDialog

Modal form for editing profile:

- Name input (max 100 characters)
- Bio textarea (max 500 characters)
- Email display (read-only)
- Form validation and error handling

## 🛣️ Routes

- `/profile/[id]` - View user profile by user ID

## 🔧 Server Actions

### getUserProfile(userId: string)

Fetches user profile data including:

- User basic info (name, email, image, bio, role)
- Total posts count
- Published posts count
- Published posts preview (limited, sorted by publish date)

### updateUserProfile(formData: FormData)

Updates current user's profile:

- Validates authentication
- Updates name and bio
- Revalidates profile page cache

## 🎨 UI Components Used

- Avatar, AvatarFallback, AvatarImage
- Button
- Card, CardContent, CardHeader
- Tabs, TabsContent, TabsList, TabsTrigger
- Badge
- Dialog, DialogContent, DialogHeader, etc.
- Input, Textarea, Label
- Toast notifications (via Sonner)

## 🔮 Future Enhancements

- [ ] Social links (Twitter, GitHub, LinkedIn, Website)
- [ ] Follow/Following system
- [ ] Post view counts and reading statistics
- [ ] Bookmarked posts tab
- [ ] Profile cover image
- [ ] Avatar upload functionality
- [ ] Draft posts tab (for profile owner)
- [ ] Reading history
- [ ] Customizable profile themes
- [ ] Public/Private profile toggle
- [ ] Activity feed

## 🔗 Integration Points

- **Auth**: Uses `auth()` from `@/lib/auth` to identify current user
- **Database**: Prisma queries via repositories (services do not access `@/db` directly)
- **Post System**: Displays user's posts via PostCard component
- **Navigation**: UserMenu links to profile page

## 📝 Usage Example

```tsx
// Accessing profile page
<Link href={`/profile/${userId}`}>View Profile</Link>;

// In a server component
const session = await auth();
const isOwnProfile = session?.user?.id === profileUserId;
```

## 🐛 Known Limitations

- Email cannot be changed (managed by auth providers)
- No image upload (uses OAuth provider images)
- Posts show only published status (no draft count on public view)

---

For questions or improvements, see the main project [README](../../../README.md).
