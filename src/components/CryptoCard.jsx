import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { formatPrice, formatMarketCap } from '../utils/formatter';

// accept a prop called crypto that contains the information
export const CryptoCard = ({ crypto }) => {
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    useEffect(() => {
        // Check if crypto is in localStorage watchlist on mount
        const savedWatchlist = localStorage.getItem('watchlist');
        if (savedWatchlist) {
            const watchlistIds = JSON.parse(savedWatchlist);
            setIsInWatchlist(watchlistIds.includes(crypto.id));
        }
    }, [crypto.id]);

    const handleAddToWatchlist = (e) => {
        e.preventDefault();
        const savedWatchlist = localStorage.getItem('watchlist');
        let watchlistIds = savedWatchlist ? JSON.parse(savedWatchlist) : [];

        if (isInWatchlist) {
            // Remove from watchlist
            watchlistIds = watchlistIds.filter(id => id !== crypto.id);
            setIsInWatchlist(false);
            console.log(`Removed ${crypto.name} from watchlist`);
        } else {
            // Add to watchlist
            watchlistIds.push(crypto.id);
            setIsInWatchlist(true);
            console.log(`Added ${crypto.name} to watchlist`);
        }

        localStorage.setItem('watchlist', JSON.stringify(watchlistIds));
    };

    return (
        // make each card a clickable link to navigate to a route
        <Link to={`/coin/${crypto.id}`} style={{ textDecoration: 'none' }}>
            <div className="crypto-card">
                <button
                    className={`watchlist-btn ${isInWatchlist ? 'active' : ''}`}
                    onClick={handleAddToWatchlist}
                    aria-label={`${isInWatchlist ? 'Remove from' : 'Add to'} watchlist`}
                >
                    {isInWatchlist ? '✓' : '+'}
                </button>
                <div className="crypto-header">
                    <div className="crypto-info">
                        {/* Display the crypto info */}
                        <img src={crypto.image} alt={crypto.name} />
                        <div>
                            <h3>{crypto.name}</h3>
                            <p className="symbol">{crypto.symbol.toUpperCase()}</p>
                            {/* sort by rank */}
                            <span className="rank">#{crypto.market_cap_rank}</span>
                        </div>
                    </div>
                </div>

                <div className="crypto-price">
                    {/* using formatter helper function */}
                    <p className="price">{formatPrice(crypto.current_price)}</p>
                    {/* latest 24hr change */}
                    <p className={`change ${crypto.price_change_percentage_24h >= 0 ? "positive" : "negative"
                        }`}
                    >
                        {/* shows an up arrow or down arrow */}
                        {crypto.price_change_percentage_24h >= 0 ? "↑" : "↓"}{" "}
                        {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </p>
                </div>

                {/* crypto stats: market cap and volume*/}
                <div className="crypto-stats">
                    <div className="stat">
                        <span className="stat-label">Market Cap</span>
                        <span className="stat-value">
                            ${formatMarketCap(crypto.market_cap)}
                        </span>
                    </div>

                    <div className="stat">
                        <span className="stat-label">Volume</span>
                        <span className="stat-value">
                            ${formatMarketCap(crypto.total_volume)}
                        </span>
                    </div>
                </div>
            </div>
        </Link >
    );
};