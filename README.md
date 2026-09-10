# FinanceFlow — Personal Finance Dashboard

FinanceFlow is a responsive personal finance dashboard built with **HTML, CSS, and Vanilla JavaScript**.

FinanceFlow helps users track income and expenses, analyze spending patterns, and manage their financial data directly in the browser. The application uses **localStorage** for persistence and supports JSON-based data backup and restoration.

## Features

* Add income and expense transactions
* Categorize transactions
* Calculate total balance, income, and expenses
* Search transactions
* Filter by category and transaction type
* Sort by date and amount
* View expense breakdowns
* Compare income and expenses
* View monthly spending trends
* View financial statistics
* Delete transactions
* Persist data using localStorage
* Export financial data as JSON
* Import and restore JSON backups
* Light and dark mode
* Responsive layout for desktop, tablet, and mobile
* Keyboard-friendly transaction modal
* Form validation and error handling
* Toast notifications
* Defensive validation of imported data

## Key Highlights

* Fully client-side application with no backend dependency
* Persistent financial data using the Web Storage API
* JSON backup and restoration system
* Responsive design across desktop, tablet, and mobile
* Light and dark themes with saved user preference
* Dynamic financial calculations and visualizations
* Keyboard-accessible transaction modal
* Client-side validation and defensive data handling
* Security-conscious DOM rendering for user-provided transaction data

## Tech Stack

* **HTML5** — Application structure and semantic markup
* **CSS3** — Responsive layout, styling, animations, and dark mode
* **JavaScript (ES6+)** — Application logic, calculations, DOM manipulation, and event handling
* **Web Storage API** — Local transaction persistence
* **File API** — JSON data import and export

## Screenshots

### Dashboard - Light Mode

![FinanceFlow Dashboard - Light Mode](assets/screenshots/Finance%20Flow%201%20-%20Light%20Full%20(2).png)

### Dashboard - Dark Mode

![FinanceFlow Dashboard - Dark Mode](assets/screenshots/Finance%20Flow%202%20-%20Dark%20Full%20(2).png)

### Dashboard with Transactions - Light Mode

![FinanceFlow Dashboard with Transactions - Light](assets/screenshots/Finance%20Flow%203%20-%20Transactions%20Light.png)

### Dashboard with Transactions - Dark Mode

![FinanceFlow Dashboard with Transactions - Dark](assets/screenshots/Finance%20Flow%204%20-%20Transactions%20Dark.png)

### Add Transaction - Light

![FinanceFlow Add Transaction - Light](assets/screenshots/Finance%20Flow%205%20-%20Transaction%20Modal%20Light.png)

### Add Transaction - Dark

![FinanceFlow Add Transaction - Dark](assets/screenshots/Finance%20Flow%206%20-%20Transaction%20Modal%20Dark.png)

### Mobile Dashboard - Light

![FinanceFlow Mobile Dashboard - Light](assets/screenshots/Finance%20Flow%207%20-%20Mobile%20Light.png)

### Mobile Dashboard - Dark

![FinanceFlow Mobile Dashboard - Dark](assets/screenshots/Finance%20Flow%208%20-%20Mobile%20Dark.png)

## Project Structure

```text
FinanceFlow/
├── index.html
├── style.css
├── script.js
├── .gitignore
└── assets/
    └── screenshots/
```

## How to Run

No installation or build process is required.

1. Clone the repository.
2. Open the project folder.
3. Open `index.html` in a modern web browser.

Alternatively, the project can be served using a simple local development server such as the VS Code Live Server extension.

## Demo

**Live Demo:** [View FinanceFlow](https://finance-flow-hazel-kappa.vercel.app/)

## Data Storage

FinanceFlow does not require a backend or database.

Transaction data is stored in the browser using:

```text
localStorage
```

Users can also export their transactions as a JSON file and later import the backup to restore their data.

## What This Project Demonstrates

FinanceFlow was built as a practical demonstration of frontend development fundamentals, including:

* DOM manipulation
* Event-driven programming
* State management
* Array methods and data processing
* Form handling and validation
* Browser APIs
* Client-side persistence
* Data import/export
* Responsive UI development
* Accessibility considerations
* Defensive programming
* Basic security-conscious rendering
* UI/UX design and interaction patterns

## Future Improvements

Potential future improvements include:

* Multiple financial accounts
* Budget tracking
* Recurring transactions
* More advanced financial reports
* Data visualization using a charting library
* User authentication
* Cloud-based data synchronization
* Backend API integration

## License

This project is available for educational and portfolio purposes.
