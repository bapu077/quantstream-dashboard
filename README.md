# QuantStream  Portfolio Manager

**QuantStream** is a sophisticated, real-time financial dashboard that simulates market data, analyzes it using key technical indicators.

This project serves as a comprehensive demonstration of building a modern, interactive,  web application with Next.js, Genkit, and advanced state management techniques in React.



---

## 🚀 Core Features

- **Multi-Stock Portfolio Management:** Simultaneously track and manage a portfolio of multiple stocks (e.g., AAPL, GOOG, TSLA), each with its own state, data stream, and trading history.

- **Dual-Mode Data Simulation:**
  - **Live Mode:** Generates a continuous, random-walk simulation of market data to mimic a live trading environment.
  - **Historical Replay:** Backtest strategies by replaying actual historical stock data, with controls for playback speed.

- **Real-time Technical Analysis:** The dashboard calculates and visualizes critical financial indicators for each stock as data streams in:
  - **Volatility:** 14-day standard deviation of price.
  - **MACD:** Moving Average Convergence Divergence, including the MACD line, signal line, and histogram.
  - **Moving Averages:** 50-period moving average plotted on the main price chart.

- **Interactive & Unified Dashboard:**
  - **Portfolio Overview:** A central table summarizing the performance of all stocks, including holdings, market value, and realized P&L.
  - **Total Equity Chart:** A visual representation of your total portfolio value over time.
  - **Detailed Stock View:** Click on any stock in the portfolio to see its detailed price chart, indicator cards, and individual controls.
  - **Paper Trading Simulator:** Manually execute buy/sell orders to test your own strategies.

---

## 🛠️ Technology Stack

This project is built on a modern, robust, and scalable tech stack.

- **Frontend Framework:** **Next.js** with **React** (App Router)
- **UI Components:** **ShadCN UI** - A collection of beautifully designed, accessible, and composable components.
- **Styling:** **Tailwind CSS** for a utility-first styling workflow.
- **Charts & Visualization:** **Recharts** for creating responsive and interactive charts.
- **Language:** **TypeScript** for type safety and improved developer experience.
- **State Management:** Advanced React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) for managing complex, real-time application state.

---

##  Architecture

The application's architecture is designed to be modular and scalable, cleanly separating concerns between data management, state logic, and the user interface.

1.  **`usePortfolioManager` Hook (`src/hooks/use-portfolio-manager.ts`):**
    - This is the central "brain" of the application.
    - It manages the state for all stocks in the portfolio.
    - It runs the data simulation loops (both live and historical).
    - It orchestrates the AI trading agents, staggering API calls to stay within rate limits.
    - It aggregates data for the portfolio-level UI components.

2.  **React Components (`src/components/`):**
    - Components are organized by function (e.g., `PortfolioOverview`, `MarketChart`, `AutoTraderCard`).
    - They are primarily presentational, receiving data and callbacks as props from the main `DashboardPage`.
    - This makes the UI easy to manage and test.

3.  **State Management:**
    - The application leverages a centralized state management pattern without external libraries.
    - A single top-level hook (`usePortfolioManager`) provides a consistent and unified state object to the entire component tree, preventing race conditions and ensuring data consistency.

---

## 🚀 How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd quantstream-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project and add your Google AI API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open your browser** to `http://localhost:9002` to see the application in action.

