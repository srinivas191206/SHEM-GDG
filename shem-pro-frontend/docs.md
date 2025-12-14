# SHEM-Pro Frontend Documentation

## Technology Choices

### React
- **Purpose**: Used for building the user interface due to its component-based architecture, which promotes reusability and maintainability.
- **Key Features Utilized**:
    - **Functional Components and Hooks**: For state management (`useState`, `useEffect`), performance optimization (`useCallback`, `useMemo`), and custom logic (`useEnergyDataFetcher`).
    - **React Router DOM**: For declarative routing within the single-page application.

### Tailwind CSS
- **Purpose**: A utility-first CSS framework for rapidly building custom designs.
- **Key Features Utilized**:
    - **Utility Classes**: For styling components directly in JSX, enabling quick and consistent UI development.
    - **Dark Mode**: Integrated for user preference, leveraging Tailwind's dark mode variants.

### Recharts
- **Purpose**: A composable charting library built with React and D3.
- **Key Features Utilized**:
    - **LineChart and BarChart**: For visualizing live and historical energy data.
    - **ResponsiveContainer**: To ensure charts adapt to different screen sizes.

### Axios
- **Purpose**: A promise-based HTTP client for the browser and Node.js.
- **Key Features Utilized**:
    - **API Requests**: Used in `useEnergyDataFetcher.ts` and `api.js` for making asynchronous requests to the backend API.

### Vite
- **Purpose**: A next-generation frontend tooling that provides a fast development experience.
- **Key Features Utilized**:
    - **Instant Server Start**: For quick development server setup.
    - **Hot Module Replacement (HMR)**: For real-time updates without full page reloads.

## Implementation Approach

### Data Fetching and State Management
- **`useEnergyDataFetcher.ts`**: A custom React hook responsible for fetching live and historical energy data from the backend. It handles:
    - **Real-time Updates**: Fetches data every 5 seconds using `setInterval`.
    - **Demo Mode**: Generates mock data when the application is in demo mode.
    - **Authentication**: Includes user authentication tokens in API requests.
    - **Online Status**: Manages the application's online/offline status.
- **`EnergyDataContext.tsx`**: Provides the fetched energy data and related states to all components that need it, avoiding prop drilling.

### User Interface and Experience
- **Component-Based Design**: The application is structured into reusable React components (e.g., `Dashboard`, `Header`, `LoginPage`).
- **Responsive Design**: Tailwind CSS utility classes are used to ensure the application is visually appealing and functional across various device sizes.
- **Dark Mode**: A toggle allows users to switch between light and dark themes, enhancing user comfort.
- **Intuitive Navigation**: The header section is designed for clear grouping of user-related information and actions.

### Performance Optimization
- **`React.memo`**: Applied to functional components (e.g., `Dashboard`) to prevent unnecessary re-renders when props do not change.
- **`useCallback`**: Used for memoizing callback functions (e.g., `toggleDarkMode`, `handleLogout`) to prevent their re-creation on every render, which helps optimize child components that rely on reference equality.

### Accessibility
- **WCAG Guidelines**: Implemented features to improve accessibility for users with disabilities.
    - **`aria-label`**: Added to interactive elements for better screen reader context.
    - **`aria-live="polite"`**: Used for dynamic content updates (e.g., status messages) to ensure screen readers announce changes.
    - **`id` and `aria-describedby`**: Used for charts to provide descriptive text for screen reader users.

### Authentication
- **JWT (JSON Web Tokens)**: Used for securing API endpoints.
- **`authService.js`**: Handles user login, logout, and token management.
- **Protected Routes**: Implemented using `react-router-dom` to restrict access to authenticated users.