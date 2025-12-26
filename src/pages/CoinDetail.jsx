import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchCoinData, fetchChartData } from "../api/coinGecko";
import { formatPrice, formatMarketCap } from "../utils/formatter";
// npm install recharts for chart
import { CartesianGrid, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line } from "recharts";

export const CoinDetail = () => {
    const { id } = useParams();
    // hook to navigate programmatically
    const navigate = useNavigate();
    const [coin, setCoin] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // fetch coin data whenever user enters page
    useEffect(() => {
        loadCoinData();
        loadChartData();
    }, [id]);

    const loadCoinData = async () => {
        try {
            // need to pass id to fetch specific coin data
            const data = await fetchCoinData(id);
            setCoin(data);
        } catch (err) {
            console.error("Error fetching crypto: ", err);
        } finally {
            setIsLoading(false);
        }
    };

    const loadChartData = async () => {
        try {
            // need to pass id to fetch specific coin data
            const data = await fetchChartData(id);

            // format data in a way that the chart can understand
            const formattedData = data.prices.map((price) => ({
                time: new Date(price[0]).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                price: parseFloat(price[1].toFixed(2)),
            }));

            setChartData(formattedData);
        } catch (err) {
            console.error("Error fetching crypto: ", err);
        }
    };

    if (isLoading) {
        return (
            <div className="app">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading coin data...</p>
                </div>
            </div>
        );
    }

    if (!coin) {
        return (
            <div className="app">
                <div className="no-results">
                    <p>Coin not found</p>
                    <button onClick={() => navigate("/")}>Go Back</button>
                </div>
            </div>
        );
    }

    const priceChange = coin.market_data.price_change_percentage_24h || 0;
    const isPositive = priceChange >= 0;
    return (
        <div className="app">
            <header className="header">
                <div className="header-content">
                    <div className="logo-section">
                        <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>🚀 Crypto Tracker</h1>
                        <p>Track Cryptocurrency Prices and market data in Real-Time</p>
                    </div>
                    <button className="back-button" onClick={() => navigate("/")}>← Back to Home</button>
                </div>
            </header>

            <div className="coin-detail">
                <div className="coin-header">
                    <div className="coin-title">
                        <img src={coin.image.large} alt={coin.name} />
                        <div>
                            <h1>{coin.name}</h1>
                            <p className="symbol">{coin.symbol.toUpperCase()}</p>
                        </div>
                    </div>
                    <span className="rank">Rank #{coin.market_data.market_cap_rank}</span>
                </div>

                <div className="coin-price-section">
                    <div className="current-price">
                        {/* using formatter helper function */}
                        <h2>{formatPrice(coin.market_data.current_price.usd)}</h2>
                        {/* latest 24hr change */}
                        <span className={`change-badge ${isPositive ? "positive" : "negative"
                            }`}
                        >
                            {/* shows an up arrow or down arrow */}
                            {isPositive ? "↑" : "↓"}{" "}
                            {Math.abs(priceChange).toFixed(2)}%
                        </span>
                    </div>

                    <div className="price-ranges">
                        <div className="price-range">
                            <span className="range-label">24hr High</span>
                            <span className="range-value">{formatPrice(coin.market_data.high_24h.usd)}</span>
                        </div>
                        <div className="price-range">
                            <span className="range-label">24hr Low</span>
                            <span className="range-value">{formatPrice(coin.market_data.low_24h.usd)}</span>
                        </div>
                    </div>
                </div>

                <div className="chart-section">
                    <h3>Price Chart (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} domain={["auto", "auto"]} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(20, 20, 40, 0.95)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "8px",
                                    color: "#e0e0e0"
                                }}
                            />
                            <Line type="monotone" dataKey="price" stroke="#ADD8E6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">Market Cap</span>
                        <span className="stat-value">${formatMarketCap(coin.market_data.market_cap.usd)}</span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Volume (24hrs)</span>
                        <span className="stat-value">${formatMarketCap(coin.market_data.total_volume.usd)}</span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Circulating Supply</span>
                        <span className="stat-value">{coin.market_data.circulating_supply?.toLocaleString() || "N/A"}</span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Total Supply</span>
                        <span className="stat-value">{coin.market_data.total_supply?.toLocaleString() || "N/A"}</span>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <p>Data provided by CoinGecko API</p>
            </footer>
        </div>
    );
};