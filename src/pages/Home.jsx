import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchCryptos } from "../api/coinGecko";
import { CryptoCard } from "../components/CryptoCard";
import { CoinWatchlist } from "./CoinWatchlist";

export const Home = () => {
    const navigate = useNavigate();

    // Keep track of data, to display it as cards
    const [cryptoList, setCryptoList] = useState([]);

    // keep track of list after we applied filtering or sorting to it
    const [filteredCryptoList, setFilteredCryptoList] = useState([]);

    // Keep track whether we are fetching the data or not
    const [isLoading, setIsLoading] = useState(true); //Loading by default

    // keep track of the view
    const [viewMode, setViewMode] = useState("grid"); // default to grid view

    // Keep track of the sort by option
    const [sortBy, setSortBy] = useState("market_cap_rank");

    // keep track of what user is searching for
    const [searchQuery, setSearchQuery] = useState("");

    // To run once in this components life, whenever it renders for the first time
    useEffect(() => {
        // to fetch data evfery 30 seconds
        // const interval = setInterval(fetchCryptoData, 30000);
        // return () => clearInterval(interval);

        fetchCryptoData();
    }, []);

    useEffect(() => {
        if (cryptoList.length > 0) {
            filterAndSort();
        }
    }, [sortBy, cryptoList, searchQuery]);


    // Calls the function in coinGecko.js, and deals with how to manage the data & display any error states 
    const fetchCryptoData = async () => {
        // catch issue if one happens while fetching data
        try {
            const data = await fetchCryptos();
            setCryptoList(data);
        } catch (err) {
            console.error("Error fetching crypto: ", err);
        } finally {
            setIsLoading(false);
        }
    };

    const filterAndSort = () => {
        // make a copy of the original list. filter based on what the user is typing
        let filtered = cryptoList.filter((crypto) =>
            crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // sort it, specify how you want to sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                // compare first letter
                case "name":
                    return a.name.localeCompare(b.name);
                case "price":
                    return a.current_price - b.current_price;
                case "price_desc":
                    return b.current_price - a.current_price;
                case "change":
                    return a.price_change_percentage_24h - b.price_change_percentage_24h;
                case "change_desc":
                    return b.price_change_percentage_24h - a.price_change_percentage_24h;
                case "market_cap":
                    return a.market_cap - b.market_cap;
                case "market_cap_rank":
                default:
                    return a.market_cap_rank - b.market_cap_rank;
            }
        });

        setFilteredCryptoList(filtered)
    };

    return (
        <div className="app">
            <header className="header">
                <div className="header-content">
                    <div className="logo-section">
                        <h1 onClick={() => {
                            navigate("/");
                            setViewMode("grid");
                            setSortBy("market_cap_rank");
                        }} style={{ cursor: "pointer" }}>🚀 Crypto Tracker</h1>
                        <p>Track Cryptocurrency Prices and market data in Real-Time</p>
                    </div>
                    <div className="search-section">
                        <input
                            type="text" placeholder="Search cryptocurrencies..."
                            className="search-input"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                        />
                    </div>
                </div>
            </header>
            {/* toggling between grid and list view */}
            <div className="controls">
                <div className="filter-group">
                    <label>Sort by:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="market_cap_rank">Rank</option>
                        <option value="name">Name</option>
                        <option value="price">Price (Low to High)</option>
                        <option value="price_desc">Price (High to Low)</option>
                        <option value="change">24hr Change (Decrease)</option>
                        <option value="change_desc">24hr Change (Increase)</option>
                        <option value="market_cap">Market Cap</option>
                    </select>
                </div>
                <div className="view-toggle">
                    <button className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")}>Grid</button>
                    <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>List</button>
                    <button className={viewMode === "watchlist" ? "active" : ""} onClick={() => setViewMode("watchlist")}>Watchlist</button>
                </div>
            </div>

            {isLoading ? (
                <div className="loading">
                    <div className="spinner" />
                    <p>Loading crypto data...</p>
                </div>
            ) : viewMode === "watchlist" ? (
                <CoinWatchlist sortBy={sortBy} searchQuery={searchQuery} />
            ) : filteredCryptoList.length > 0 ? (
                <div className={`crypto-container ${viewMode}`}> {/* dynamic class */}
                    {/* Loop through the crypto list and render component to represent each individual card*/}
                    {filteredCryptoList.map((crypto, key) => (
                        <CryptoCard crypto={crypto} key={key} />
                    ))}
                </div>
            ) : (
                <div className="loading">
                    <p>No cryptocurrencies found</p>
                </div>
            )}

            <footer className="footer">
                <p>Data provided by CoinGecko API</p>
            </footer>
        </div>
    );
};