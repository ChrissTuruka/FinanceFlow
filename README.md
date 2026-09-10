# FinanceFlow — Personal Finance Dashboard

FinanceFlow is a responsive personal finance dashboard built with **HTML, CSS, and Vanilla JavaScript**.

It allows users to record, manage, and analyze their income and expenses directly in the browser. Financial data is stored locally using the browser's **localStorage API**, with support for exporting and importing data as JSON backups.

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

## Tech Stack

* **HTML5** — Application structure and semantic markup
* **CSS3** — Responsive layout, styling, animations, and dark mode
* **JavaScript (ES6+)** — Application logic, calculations, DOM manipulation, and event handling
* **Web Storage API** — Local transaction persistence
* **File API** — JSON data import and export

## Screenshots

Screenshots will be added here.

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
