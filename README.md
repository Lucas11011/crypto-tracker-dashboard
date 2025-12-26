# 🚀 Crypto Tracker
A modern, responsive React application for tracking cryptocurrency prices and market data in real-time. Built with React Router for seamless navigation and powered by the CoinGecko API.

## 📋 Features

### Home Page
- **Grid & List Views**: Toggle between grid and list layouts to view cryptocurrencies
  - *Implementation*: Dynamic CSS classes based on `viewMode` state; layout switches via button state updates
- **Watchlist View**: Dedicated view to see all saved cryptocurrencies with persistent localStorage storage
  - *Implementation*: Third view mode that renders `CoinWatchlist` component instead of `CryptoCard` list
- **Watchlist Button**: Click the **+** button on any crypto card to add/remove from watchlist (toggles to **✓** checkmark)
  - *Implementation*: `CryptoCard` component uses `localStorage.setItem()` to persist coin IDs; button checks localStorage on mount via `useEffect`
- **Real-time Data**: Displays top 100 cryptocurrencies by market cap with live pricing
  - *Implementation*: Fetches from CoinGecko API on component mount; loading state prevents premature rendering
- **Search Functionality**: Filter cryptocurrencies by name or symbol
  - *Implementation*: `searchQuery` state filters using `.filter()` with `.includes()` for partial name/symbol matching
- **Sorting Options**:
  - *Implementation*: `sortBy` state controls a `switch` statement that applies 7 different `.sort()` algorithms
  - Rank (default)
  - Name (A-Z)
  - Price (Low to High)
  - Price (High to Low)
  - 24hr Change (Low to High)
  - 24hr Change (High to Low)
  - Market Cap
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Watchlist Page
- **Persistent Storage**: Watchlist data saved to browser localStorage
  - *Implementation*: Coin IDs stored as JSON array in `localStorage.getItem('watchlist')`; survives page refresh
- **Detailed Coin View**: Displays each watchlist coin with price, 24-hour change, market cap, and volume
  - *Implementation*: Fetches full coin data via `fetchCoinData()` API for each ID using `Promise.all()`
- **Quick Actions**: Remove button (✕) to delete coins from watchlist
  - *Implementation*: `removeFromWatchlist()` filters coin ID from localStorage array and updates both storage and UI state
- **Navigation**: View Details button to access full coin information
  - *Implementation*: `useNavigate()` hook routes to `/coin/{id}`
- **Empty State**: Helpful message when no coins are saved
  - *Implementation*: Conditional rendering checks `watchlistCoins.length === 0`
- **Real-time Sync**: Watchlist updates instantly when adding/removing coins from home page
  - *Implementation*: `useEffect` dependency arrays trigger re-renders when watchlist localStorage changes
- **Search & Sort**: Uses the same search bar and sort dropdown as grid/list views to filter and organize watchlist coins
  - *Implementation*: Accepts `searchQuery` and `sortBy` props; applies same filtering and sorting logic as Home page

### Coin Detail Page
- **Comprehensive Coin Information**: View detailed data for any cryptocurrency
  - *Implementation*: Uses `useParams()` to extract coin ID from URL; `useEffect` triggers `fetchCoinData()` on mount
- **Price Statistics**: Current price, 24-hour high/low, and market cap
  - *Implementation*: Destructures and displays `coin.market_data` properties
- **Price Change Indicator**: Visual indicators for positive (green) and negative (red) price movements
  - *Implementation*: Conditional className based on `price_change_percentage_24h >= 0`
- **7-Day Price Chart**: Interactive line chart powered by Recharts
  - *Implementation*: `fetchChartData()` returns array of prices; mapped to formatted objects with date and price; `ResponsiveContainer` + `LineChart` renders interactive visualization
- **Market Statistics**: Market cap, 24-hour volume, and circulating supply
  - *Implementation*: Displays from `coin.market_data` object in a grid layout

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2
- **Routing**: React Router 7.11
- **Charts**: Recharts 3.6
- **Build Tool**: Vite 7.2
- **Styling**: CSS with CSS Variables for theming
- **API**: CoinGecko API (free, no authentication required)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Design Features

- **Dark Theme**: Modern dark interface with carefully chosen color palette
- **CSS Variables**: Fully customizable color scheme through root variables
- **Smooth Animations**: Hover effects and transitions for better UX
- **Responsive Grid**: 4-column grid on desktop, adapts to smaller screens
- **Accessible Colors**: WCAG compliant color contrasts

## 🔌 API Integration

### Endpoints Used

1. **Market Data (Home Page)**
   ```
   GET /coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100
   ```
   Fetches top 100 cryptocurrencies by market cap

2. **Coin Details**
   ```
   GET /coins/{id}?market_data=true
   ```
   Fetches detailed information for a specific coin

3. **Historical Chart Data**
   ```
   GET /coins/{id}/market_chart?vs_currency=usd&days=7
   ```
   Fetches 7-day price history for chart visualization

## 🎯 Key Components

### CryptoCard Component
- Displays cryptocurrency information in a card format
  - *Implementation*: Receives `crypto` prop; wrapped in `Link` component for routing
- Shows price, 24h change, market cap, and volume
- **Watchlist Button**: + (plus) button to add to watchlist, toggles to ✓ (checkmark) when added
  - *Implementation*: `useState` tracks `isInWatchlist`; `useEffect` checks localStorage on mount; click handler reads/writes to localStorage
- localStorage integration to persist watchlist state
  - *Implementation*: `JSON.parse()` / `JSON.stringify()` for reading and writing watchlist array
- Clickable link to detailed coin page
  - *Implementation*: `Link` component routes to `/coin/{crypto.id}`
- Responsive layout for different view modes
  - *Implementation*: Parent `.crypto-container` has dynamic class; CSS uses `.list` and `.grid` selectors for different styles

### Home Page Component
- State management for filtering, sorting, and search
  - *Implementation*: Multiple `useState` hooks track `cryptoList`, `filteredCryptoList`, `sortBy`, `searchQuery`, `viewMode`
- Dynamic class assignment based on view mode
  - *Implementation*: `className={\`crypto-container ${viewMode}\`}` applies conditional CSS
- Three view options: Grid, List, and **Watchlist**
  - *Implementation*: Buttons update `viewMode` state; conditional rendering shows different components
- Real-time list updates on search/sort changes
  - *Implementation*: `useEffect` watches `sortBy`, `searchQuery`, and `cryptoList`; calls `filterAndSort()` whenever dependencies change
- Loading state with spinner animation
  - *Implementation*: `isLoading` state shown/hidden with conditional rendering

### CoinWatchlist Component
- Fetches and displays all saved cryptocurrencies
  - *Implementation*: Reads coin IDs from localStorage; fetches full data via `Promise.all()` for parallel API calls
- Loads watchlist IDs from localStorage on mount
  - *Implementation*: `useEffect` with empty dependency array runs once; retrieves and parses `localStorage.getItem('watchlist')`
- Displays detailed coin data (price, change, market cap, volume)
- **Integrated Search & Sort**: Accepts searchQuery and sortBy props from Home page
  - *Implementation*: Combines filtering and sorting in single `filterAndSort()` function; updates `filteredCoins` state
  - Filters coins by name or symbol in real-time
  - Applies all 7 sorting options (rank, name, price, change, market cap)
- Remove button (✕) to delete coins from watchlist
  - *Implementation*: Filters coin ID from localStorage array; updates localStorage and component state
- View Details button for quick navigation to coin pages
  - *Implementation*: `useNavigate()` routes to `/coin/{coin.id}`
- Empty state handling with helpful message
  - *Implementation*: Conditional rendering checks if `filteredCoins.length === 0` and `watchlistCoins.length > 0`

### Coin Detail Page Component
- Fetches and displays comprehensive coin information
  - *Implementation*: `useParams()` gets coin ID; `useEffect` calls two async functions on mount
- Interactive Recharts line chart for price history
  - *Implementation*: `fetchChartData()` returns prices; `map()` transforms to chart-compatible format; `LineChart` with `XAxis`, `YAxis`, `Line`, `Tooltip` renders visualization
- Market statistics grid
  - *Implementation*: CSS grid layout displays key metrics from `coin.market_data`
- Back button to return to home
  - *Implementation*: `useNavigate()` hook with `/` path

### Utility Functions
- `formatPrice()`: Formats prices with currency symbol or decimal places
  - *Implementation*: Conditional logic checks price magnitude; returns formatted string with appropriate decimals
- `formatMarketCap()`: Converts large numbers to readable format (T, B, M)
  - *Implementation*: Divides by 1 trillion/billion/million; returns string with appropriate suffix

## 🚀 Features in Detail

### Search & Filter
- Real-time search by coin name or symbol across all views
  - *Implementation*: `searchQuery` state updates on input change; `useEffect` re-runs filtering when query changes
- Instant filtering as you type
  - *Implementation*: `.filter()` method uses `.toLowerCase().includes()` for case-insensitive partial matching
- Maintains view mode and sort selection during search
  - *Implementation*: Search state separate from `viewMode` and `sortBy`; each can be changed independently
- Works on Grid, List, and Watchlist views
  - *Implementation*: Home page applies search to all coins; CoinWatchlist accepts `searchQuery` prop

### Sorting
- 7 different sorting options
  - *Implementation*: `sortBy` state controls a `switch` statement in `filterAndSort()` function
- Ascending and descending options for price and 24hr change
  - *Implementation*: Two cases in switch: `price` vs `price_desc`, `change` vs `change_desc`; each uses opposite comparison
- Maintained state when switching views
  - *Implementation*: `sortBy` state persists across view changes; applied fresh each time `filterAndSort()` runs

### Data Display
- Grid view: 4-column responsive layout with cards
  - *Implementation*: `.crypto-container.grid` uses CSS Grid with `minmax(280px, 1fr)`
- List view: Compact line-based display with minimal styling
  - *Implementation*: `.crypto-container.list` uses flexbox with `justify-content: space-between` for horizontal layout
- Mobile responsive: Single column on small screens
  - *Implementation*: Media query at 768px changes grid/flex layouts; cards stack vertically

### Price Formatting
- Standard prices: 2 decimal places with currency symbol
  - *Implementation*: `formatPrice()` checks if price >= 1; returns with 2 decimals
- Very small prices: Up to 8 decimal places
  - *Implementation*: For prices < 1, `formatPrice()` shows up to 8 decimals to preserve precision
- Large numbers: Abbreviated with T, B, M suffixes
  - *Implementation*: `formatMarketCap()` divides by 1 trillion/billion/million thresholds; returns with suffix

## 📱 Responsive Breakpoints

- **Desktop**: 4-column grid, full feature display
- **Tablet** (768px-1024px): 2-column grid, adjusted spacing
- **Mobile** (<768px): Single column, stacked layout, optimized padding

## 🔄 Navigation

- **Crypto Tracker Logo**: Click to return to home (resets to grid view and rank sorting)
  - *Implementation*: `onClick` handler with `navigate("/")` and state resets; present on both Home and CoinDetail pages
- **View Toggle Buttons**: Switch between Grid, List, and Watchlist views
  - *Implementation*: Three buttons update `viewMode` state; `className` changes dynamically based on active mode
- **Watchlist Button**: + icon on coins to add/remove from watchlist
  - *Implementation*: CryptoCard component with `useState` and localStorage; click handler toggles state
- **Coin Cards**: Click any coin to view detailed information
  - *Implementation*: `Link` component wraps card; routes to `/coin/{crypto.id}`
- **View Details Button**: Jump to coin detail page from watchlist
  - *Implementation*: Button with `useNavigate()` hook; passes coin ID in URL path
- **Back Button**: Return to home from coin detail page
  - *Implementation*: `navigate("/")` on CoinDetail page header

## 📊 Data Management

- React hooks (useState, useEffect) for state management
  - *Implementation*: `useState` for data/UI state; `useEffect` for side effects and conditional updates
- **localStorage for Watchlist Persistence**: Watchlist data survives browser refresh
  - *Implementation*: Coin IDs stored as JSON string; `localStorage.setItem()` saves, `localStorage.getItem()` retrieves
- Efficient filtering and sorting algorithms
  - *Implementation*: `.filter()` with `.includes()` for search; `.sort()` with `switch` statements for 7 sort options
- Error handling for API failures
  - *Implementation*: `try-catch-finally` blocks wrap API calls; console errors logged
- Loading states for better UX
  - *Implementation*: `isLoading` state managed with conditional rendering
- Synchronization between CryptoCard buttons and CoinWatchlist view
  - *Implementation*: Both components read/write to same `localStorage` key; `useEffect` dependencies trigger re-renders when data changes

## 🎨 Color Scheme

The project uses CSS variables for theming:
- Primary: `#EBDCB8` (Light gold)
- Background: `#181818` (Dark gray)
- Text Primary: `#e0e0e0` (Light gray)
- Positive: `#3EFF7E` (Green)
- Negative: `#FF5252` (Red)

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Create optimized production build
- `npm run lint`: Run ESLint to check code quality
- `npm run preview`: Preview production build locally

### Code Quality
- ESLint configured for React best practices
- React Hooks linting to prevent bugs
- Organized component structure for maintainability

## 📝 Notes

- All data is fetched from the free CoinGecko API
- No authentication required for API calls
- Data is not cached; fresh data is fetched on each page load
- Chart displays 7-day historical price data

## 🚧 Possible Future Enhancements

- Add price alerts and notifications
- Implement data caching to reduce API calls
- Add more chart types (candlestick, area charts)
- Portfolio tracking with investment amounts
- Price change comparisons between watchlist coins
- Export watchlist as CSV or JSON
- Cloud sync for watchlist across devices