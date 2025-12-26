import { useEffect, useState } from "react";
import { fetchCoinData } from "../api/coinGecko";
import { formatPrice, formatMarketCap } from "../utils/formatter";
import { useNavigate } from "react-router";

// Displays all cryptocurrencies saved to the user's watchlist
// Loads watchlist IDs from localStorage and fetches detailed coin data
export const CoinWatchlist = ({ sortBy = "market_cap_rank", searchQuery = "" }) => {
    const navigate = useNavigate();
    const [watchlistCoins, setWatchlistCoins] = useState([]);
    const [filteredCoins, setFilteredCoins] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load watchlist from localStorage on component mount
    useEffect(() => {
        const savedWatchlist = localStorage.getItem("watchlist");
        if (savedWatchlist) {
            const coinIds = JSON.parse(savedWatchlist);
            loadWatchlistCoins(coinIds);
        }
    }, []);

    // Filter by search query and sort when either changes
    useEffect(() => {
        if (watchlistCoins.length > 0) {
            filterAndSort();
        }
    }, [sortBy, searchQuery, watchlistCoins]);

    // Filter coins based on search query and apply sorting
    const filterAndSort = () => {
        // Filter coins based on name or symbol matching search query
        let filtered = watchlistCoins.filter((coin) =>
            coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "price":
                    return a.market_data.current_price.usd - b.market_data.current_price.usd;
                case "price_desc":
                    return b.market_data.current_price.usd - a.market_data.current_price.usd;
                case "change":
                    return a.market_data.price_change_percentage_24h - b.market_data.price_change_percentage_24h;
                case "change_desc":
                    return b.market_data.price_change_percentage_24h - a.market_data.price_change_percentage_24h;
                case "market_cap":
                    return a.market_data.market_cap.usd - b.market_data.market_cap.usd;
                case "market_cap_rank":
                default:
                    return a.market_cap_rank - b.market_cap_rank;
            }
        });
        setFilteredCoins(filtered);
    };

    // Fetch detailed data for each coin ID from the API
    const loadWatchlistCoins = async (coinIds) => {
        setIsLoading(true);
        try {
            const coins = await Promise.all(
                coinIds.map(id => fetchCoinData(id))
            );
            setWatchlistCoins(coins);
        } catch (err) {
            console.error("Error fetching watchlist coins:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Remove a coin from watchlist and update both localStorage and UI state
    const removeFromWatchlist = (coinId) => {
        const savedWatchlist = localStorage.getItem("watchlist");
        if (savedWatchlist) {
            const coinIds = JSON.parse(savedWatchlist);
            const updatedIds = coinIds.filter(id => id !== coinId);

            // Clear localStorage if no coins remain, otherwise save updated list
            if (updatedIds.length > 0) {
                localStorage.setItem("watchlist", JSON.stringify(updatedIds));
            } else {
                localStorage.removeItem("watchlist");
            }

            // Update UI state to remove the coin from display
            setWatchlistCoins(watchlistCoins.filter(coin => coin.id !== coinId));
        }
    };

    // Show loading spinner while fetching coin data
    if (isLoading) {
        return (
            <div className="app">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading watchlist...</p>
                </div>
            </div>
        );
    }

    // Show no coins saved message if no coins have been added to watchlist
    if (watchlistCoins.length === 0) {
        return (
            <div className="app">
                <div className="watchlist-container">
                    <div className="empty-watchlist">
                        <h2>Your Watchlist is Empty</h2>
                        <p>Click the + button on any cryptocurrency to add it to your watchlist</p>
                    </div>
                </div>
            </div>
        );
    }

    // Render watchlist with filtered and sorted coins
    return (
        <div className="watchlist-container">
            <h2 className="watchlist-title">My Watchlist</h2>
            {filteredCoins.length === 0 && watchlistCoins.length > 0 ? (
                <div className="empty-watchlist">
                    <p>No coins match your search</p>
                </div>
            ) : (
                <div className="watchlist-items">
                    {filteredCoins.map((coin) => (
                        <div key={coin.id} className="watchlist-item">
                            <div className="watchlist-header">
                                <div className="watchlist-info">
                                    <img src={coin.image.small} alt={coin.name} />
                                    <div>
                                        <h3>{coin.name}</h3>
                                        <p className="symbol">{coin.symbol.toUpperCase()}</p>
                                    </div>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromWatchlist(coin.id)}
                                    aria-label={`Remove ${coin.name} from watchlist`}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Display price, 24h change, market cap, and volume for each coin */}
                            <div className="watchlist-details">
                                <div className="detail-section">
                                    <span className="detail-label">Price</span>
                                    <span className="detail-value">
                                        {formatPrice(coin.market_data.current_price.usd)}
                                    </span>
                                </div>

                                <div className="detail-section">
                                    <span className="detail-label">24h Change</span>
                                    {/* Show green for positive change, red for negative */}
                                    <span className={`detail-value ${coin.market_data.price_change_percentage_24h >= 0 ? "positive" : "negative"}`}>
                                        {coin.market_data.price_change_percentage_24h >= 0 ? "↑" : "↓"}{" "}
                                        {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}%
                                    </span>
                                </div>

                                <div className="detail-section">
                                    <span className="detail-label">Market Cap</span>
                                    <span className="detail-value">
                                        ${formatMarketCap(coin.market_data.market_cap.usd)}
                                    </span>
                                </div>

                                <div className="detail-section">
                                    <span className="detail-label">Volume</span>
                                    <span className="detail-value">
                                        ${formatMarketCap(coin.market_data.total_volume.usd)}
                                    </span>
                                </div>
                            </div>

                            {/* Navigation button to view full coin details */}
                            <button
                                className="view-details-btn"
                                onClick={() => navigate(`/coin/${coin.id}`)}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
