// Application State
let transactions = [];
let lastFocusedElement = null;

// Local Storage

function saveTransactions() {

    localStorage.setItem(
        "financeFlowTransactions",
        JSON.stringify(transactions)
    );

}

function loadTransactions() {

    const savedTransactions =
        localStorage.getItem("financeFlowTransactions");

    if (!savedTransactions) {
        return;
    }

    try {

        const parsedTransactions =
            JSON.parse(savedTransactions);

        if (!validateImportedTransactions(parsedTransactions)) {

            console.warn(
                "Invalid transaction data found in localStorage."
            );

            transactions = [];

            return;
        }

        transactions = parsedTransactions;

    } catch (error) {

        console.error(
            "Failed to load transactions:",
            error
        );

        transactions = [];

    }
}

// DOM Elements

const balanceElement =
    document.getElementById("balance");

const incomeElement =
    document.getElementById("income");

const expensesElement =
    document.getElementById("expenses");

const transactionList =
    document.getElementById("transactionList");

const expenseBreakdown =
    document.getElementById("expenseBreakdown");

const incomeExpenseChart =
    document.getElementById("incomeExpenseChart");

const spendingTrendChart =
    document.getElementById("spendingTrendChart");

const savingsRateElement =
    document.getElementById("savingsRate");

const averageExpenseElement =
    document.getElementById("averageExpense");

const largestExpenseElement =
    document.getElementById("largestExpense");

const transactionCountElement =
    document.getElementById("transactionCount");

const themeToggle =
    document.getElementById("themeToggle");

const toastContainer =
    document.getElementById("toastContainer");

const exportDataBtn =
    document.getElementById("exportDataBtn");

const importDataBtn =
    document.getElementById("importDataBtn");

const importFileInput =
    document.getElementById("importFileInput");

const formError =
    document.getElementById("formError");


// Modal elements

const transactionModal =
    document.getElementById("transactionModal");

const addTransactionBtn =
    document.getElementById("addTransactionBtn");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelTransactionBtn =
    document.getElementById("cancelTransactionBtn");

const transactionForm =
    document.getElementById("transactionForm");

const descriptionInput =
    document.getElementById("description");

const amountInput =
    document.getElementById("amount");

const typeInput =
    document.getElementById("type");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

// Search & Filters

const searchInput = 
    document.getElementById("searchInput");

const categoryFilter = 
    document.getElementById("categoryFilter");

const typeFilter = 
    document.getElementById("typeFilter");

const sortSelect = 
    document.getElementById("sortSelect");

// Modal Functions

function openTransactionModal() {

    lastFocusedElement =
        document.activeElement;

    clearFormError();

    transactionForm.reset();

    dateInput.value = getTodayDate();

    transactionModal.classList.add("active");

    descriptionInput.focus();
}


function closeTransactionModal() {

    transactionModal.classList.remove("active");

    transactionForm.reset();

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }

}

function trapModalFocus(event) {

    if (!transactionModal.classList.contains("active")) {
        return;
    }

    if (event.key !== "Tab") {
        return;
    }

    const focusableElements =
        transactionModal.querySelectorAll(
            'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

    const firstElement = focusableElements[0];
    const lastElement =
        focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {

        if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }

    } else {

        if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }

    }
}


// Event Listeners

addTransactionBtn.addEventListener(
    "click",
    openTransactionModal
);


closeModalBtn.addEventListener(
    "click",
    closeTransactionModal
);


cancelTransactionBtn.addEventListener(
    "click",
    closeTransactionModal
);

searchInput.addEventListener(
    "input", 
    renderTransactions
);

categoryFilter.addEventListener(
    "change", 
    renderTransactions
);

typeFilter.addEventListener(
    "change", 
    renderTransactions
);

sortSelect.addEventListener(
    "change", 
    renderTransactions
);

themeToggle.addEventListener(
    "click",
    toggleTheme
);

exportDataBtn.addEventListener(
    "click",
    exportTransactions
);

importDataBtn.addEventListener("click", function () {
    importFileInput.click();
});

importFileInput.addEventListener(
    "change",
    function (event) {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function () {

            try {

                const importedData =
                    JSON.parse(reader.result);

                if (!validateImportedTransactions(importedData)) {

                    showToast(
                        "Invalid FinanceFlow backup file.",
                        "error"
                    );

                    return;
                }

                transactions = importedData;

                saveTransactions();

                refreshDashboard();

                showToast(
                    "Financial data imported successfully."
                );

            } catch (error) {

                showToast(
                    "Invalid JSON file.",
                    "error"
                );

            }
            importFileInput.value = "";

        };

        reader.readAsText(file);
    }
);

document.addEventListener("keydown", function (event) {

    if (
        event.key === "Escape" &&
        transactionModal.classList.contains("active")
    ) {
        closeTransactionModal();
        return;
    }

    trapModalFocus(event);

});

transactionModal.addEventListener(
    "click",
    function (event) {

        if (event.target === transactionModal) {
            closeTransactionModal();
        }

    }
);

// Add Transaction

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        clearFormError();

        const descriptionValue =
            descriptionInput.value.trim();

        const amountValue =
            Number(amountInput.value);

        const typeValue =
            typeInput.value;

        const categoryValue =
            categoryInput.value;

        const dateValue =
            dateInput.value;

        if (!descriptionValue) {

            showFormError(
                "Please enter a transaction description."
            );

            descriptionInput.classList.add("form-input-error");

            descriptionInput.focus();

            return;
        }

        if (!amountValue || amountValue <= 0) {

            showFormError(
                "Please enter an amount greater than zero."
            );

            amountInput.classList.add("form-input-error");

            amountInput.focus();

            return;
        }

        if (!dateValue) {

            showFormError(
                "Please select a transaction date."
            );

            dateInput.classList.add("form-input-error");

            dateInput.focus();

            return;
        }

        const transaction = {

            id: Date.now(),

            description: descriptionValue,

            amount: amountValue,

            type: typeValue,

            category: categoryValue,

            date: dateValue

        };

        transactions.push(transaction);

        saveTransactions();

        showToast(
            "Transaction added successfully."
        );

        refreshDashboard();

        closeTransactionModal();

    }
);

function getFilteredTransactions() {
    let filteredTransactions = [...transactions];

    // Search
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm) {
        filteredTransactions = filteredTransactions.filter(transaction =>
            transaction.description.toLowerCase().includes(searchTerm)
        );
    }

    // Category filter
    const selectedCategory = categoryFilter.value;

    if (selectedCategory !== "all") {
        filteredTransactions = filteredTransactions.filter(
            transaction => transaction.category === selectedCategory
        );
    }

    // Type filter
    const selectedType = typeFilter.value;

    if (selectedType !== "all") {
        filteredTransactions = filteredTransactions.filter(
            transaction => transaction.type === selectedType
        );
    }

    // Sorting
    const selectedSort = sortSelect.value;

    if (selectedSort === "newest") {
        filteredTransactions.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );
    }

    if (selectedSort === "oldest") {
        filteredTransactions.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );
    }

    if (selectedSort === "highest") {
        filteredTransactions.sort(
            (a, b) => b.amount - a.amount
        );
    }

    if (selectedSort === "lowest") {
        filteredTransactions.sort(
            (a, b) => a.amount - b.amount
        );
    }

    return filteredTransactions;
}

// Render Transactions

function renderTransactions() {

    if (transactions.length === 0) {

        transactionList.innerHTML = `

            <p class="empty-state">

                No transactions yet.

            </p>

        `;

        return;

    }

    transactionList.innerHTML = "";

    const filteredTransactions =
        getFilteredTransactions();

    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">📭</div>

                <h3>No transaction found</h3>

                <p>Try adjusting your search filters.</p>

            </div>

        `;

        return;

    }

    filteredTransactions.forEach(function (transaction) {

        const transactionElement =
            document.createElement("div");

        transactionElement.classList.add(
            "transaction-item"
        );


        // LEFT SIDE

        const transactionLeft =
            document.createElement("div");

        transactionLeft.classList.add(
            "transaction-left"
        );


        // TRANSACTION ICON

        const transactionIcon =
            document.createElement("div");

        transactionIcon.classList.add(
            "transaction-icon",
            transaction.type
        );

        transactionIcon.textContent =
            transaction.type === "income"
                ? "↑"
                : "↓";


        // TRANSACTION INFO

        const transactionInfo =
            document.createElement("div");

        transactionInfo.classList.add(
            "transaction-info"
        );


        const description =
            document.createElement("strong");

        description.textContent =
            transaction.description;


        const category =
            document.createElement("span");

        category.classList.add(
            "transaction-category"
        );

        category.textContent =
            `${transaction.category} • ${formatDate(transaction.date)}`;


        transactionInfo.appendChild(description);

        transactionInfo.appendChild(category);


        transactionLeft.appendChild(
            transactionIcon
        );

        transactionLeft.appendChild(
            transactionInfo
        );

        // RIGHT SIDE

        const transactionRight =
            document.createElement("div");

        transactionRight.classList.add(
            "transaction-right"
        );


        const amount =
            document.createElement("span");

        amount.classList.add(
            "transaction-amount",
            transaction.type
        );

        amount.textContent =
            `${transaction.type === "income" ? "+" : "-"} ${formatCurrency(transaction.amount)}`;


        const deleteButton =
            document.createElement("button");

        deleteButton.classList.add(
            "delete-transaction"
        );

        deleteButton.dataset.id =
            transaction.id;

        deleteButton.type = "button";

        deleteButton.title =
            "Delete transaction";

        deleteButton.setAttribute(
            "aria-label",
            `Delete ${transaction.description}`
        );

        deleteButton.textContent = "×";


        transactionRight.appendChild(amount);

        transactionRight.appendChild(
            deleteButton
        );

        // BUILD TRANSACTION

        transactionElement.appendChild(
            transactionLeft
        );

        transactionElement.appendChild(
            transactionRight
        );

        transactionList.appendChild(
            transactionElement
        );

    });
}

// Delete Btn Handler

transactionList.addEventListener(
    "click",
    function (event) {

        const deleteButton =
            event.target.closest(
                ".delete-transaction"
            );


        if (!deleteButton) {
            return;
        }


        const transactionId =
            Number(deleteButton.dataset.id);


        deleteTransaction(transactionId);

    }
);

// Currency Format

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "TZS"
    }).format(amount);

}

// Calculate Total Income

function calculateIncome() {

    return transactions
        .filter(transaction => transaction.type === "income")
        .reduce((total, transaction) => {
            return total + transaction.amount;
        }, 0);

}

// Calculate Total Expenses

function calculateExpenses() {

    return transactions
        .filter(transaction => transaction.type === "expense")
        .reduce((total, transaction) => {
            return total + transaction.amount;
        }, 0);

}

// Calculating Savings Rate

function calculateSavingsRate() {
    const income = calculateIncome();
    const expenses = calculateExpenses();

    if (income === 0) {
        return 0;
    }

    return ((income - expenses) / income) * 100;
}


function calculateAverageExpense() {

    const expenses = transactions.filter(
        transaction => transaction.type === "expense"
    );

    if (expenses.length === 0) {
        return 0;
    }

    const totalExpenses = expenses.reduce(
        (total, transaction) => {
            return total + transaction.amount;
        },
        0
    );

    return totalExpenses / expenses.length;
}


function calculateLargestExpense() {
    const expenses = transactions.filter(
        transaction => transaction.type === "expense"
    );

    if (expenses.length === 0) {
        return 0;
    }

    return Math.max(
        ...expenses.map(transaction => transaction.amount)
    );
}


function calculateTransactionCount() {
    return transactions.length;
}

function renderSpendingTrend() {
    spendingTrendChart.innerHTML = "";

    const monthlyExpenses = calculateMonthlyExpenses();

    const months = Object.entries(monthlyExpenses)
        .sort((a, b) => a[0].localeCompare(b[0]));

    if (months.length === 0) {
        spendingTrendChart.innerHTML = `
            <p class="empty-state">
                No spending data available.
            </p>
        `;

        return;
    }

    const highestAmount = Math.max(
        ...months.map(([, amount]) => amount)
    );

    const chart = document.createElement("div");

    chart.className = "spending-chart";

    months.forEach(([monthKey, amount]) => {

        const [year, month] = monthKey.split("-");

        const monthLabel = new Date(
            Number(year),
            Number(month) - 1
        ).toLocaleString("en-US", {
            month: "short",
            year: "numeric"
        });

        const percentage =
            (amount / highestAmount) * 100;

        const bar = document.createElement("div");

        bar.className = "spending-bar-item";

        bar.innerHTML = `
            <div class="spending-bar-wrapper">

                <div
                    class="spending-bar"
                    style="height: ${percentage}%"
                    title="${formatCurrency(amount)}"
                ></div>

            </div>

            <span class="spending-month">
                ${monthLabel}
            </span>

            <span class="spending-amount">
                ${formatCurrency(amount)}
            </span>
        `;

        chart.appendChild(bar);
    });

    spendingTrendChart.appendChild(chart);
}

// Calculate Expenses Breakdown

function calculateExpenseBreakdown() {

    const breakdown = {};

    transactions
        .filter(transaction => transaction.type === "expense")
        .forEach(transaction => {

            const category = transaction.category;

            if (!breakdown[category]) {

                breakdown[category] = 0;

            }

            breakdown[category] += transaction.amount;

        });


    return breakdown;

}

function calculateMonthlyExpenses() {
    const monthlyExpenses = {};

    transactions
        .filter(transaction => transaction.type === "expense")
        .forEach(transaction => {

            const [year, month] = transaction.date.split("-");

            const monthKey = `${year}-${month}`;

            if (!monthlyExpenses[monthKey]) {
                monthlyExpenses[monthKey] = 0;
            }

            monthlyExpenses[monthKey] += transaction.amount;
        });

    return monthlyExpenses;
}

// Render Expenses Breakdown

function renderExpenseBreakdown() {
    expenseBreakdown.innerHTML = "";

    const breakdown = calculateExpenseBreakdown();

    const categories = Object.entries(breakdown)
        .sort((a, b) => b[1] - a[1]);

    if (categories.length === 0) {
        expenseBreakdown.innerHTML = `
            <p class="empty-state">
                No expense data available.
            </p>
        `;

        return;
    }

    const totalExpenses = categories.reduce(
        (total, [, amount]) => total + amount,
        0
    );

    categories.forEach(([category, amount]) => {

        const percentage = (amount / totalExpenses) * 100;

        const expenseItem = document.createElement("div");

        expenseItem.className = "expense-item";

        expenseItem.innerHTML = `
            <div class="expense-item-header">

                <span class="expense-category">
                    ${category}
                </span>

                <div class="expense-info">

                    <span class="expense-percentage">
                        ${percentage.toFixed(1)}%
                    </span>

                    <span class="expense-amount">
                        ${formatCurrency(amount)}
                    </span>

                </div>

            </div>

            <div class="expense-bar-container">

                <div
                    class="expense-bar"
                    style="width: ${percentage}%"
                ></div>

            </div>
        `;

        expenseBreakdown.appendChild(expenseItem);
    });
}

function renderIncomeExpenseChart() {
    incomeExpenseChart.innerHTML = "";

    const income = calculateIncome();
    const expenses = calculateExpenses();

    if (income === 0 && expenses === 0) {
        incomeExpenseChart.innerHTML = `
            <p class="empty-state">
                No financial data available.
            </p>
        `;

        return;
    }

    const largestValue = Math.max(income, expenses);

    const incomePercentage =
        largestValue > 0 ? (income / largestValue) * 100 : 0;

    const expensePercentage =
        largestValue > 0 ? (expenses / largestValue) * 100 : 0;

    incomeExpenseChart.innerHTML = `
        <div class="comparison-item">

            <div class="comparison-header">

                <span class="comparison-label">
                    Income
                </span>

                <span class="comparison-amount income">
                    ${formatCurrency(income)}
                </span>

            </div>

            <div class="comparison-bar-container">

                <div
                    class="comparison-bar income-bar"
                    style="width: ${incomePercentage}%"
                ></div>

            </div>

        </div>


        <div class="comparison-item">

            <div class="comparison-header">

                <span class="comparison-label">
                    Expenses
                </span>

                <span class="comparison-amount expense">
                    ${formatCurrency(expenses)}
                </span>

            </div>

            <div class="comparison-bar-container">

                <div
                    class="comparison-bar expense-bar"
                    style="width: ${expensePercentage}%"
                ></div>

            </div>

        </div>
    `;
}

// Calculate Balance

function calculateBalance() {

    const income = calculateIncome();

    const expenses = calculateExpenses();

    return income - expenses;

}

// Updating the Financial Statistics

function updateFinancialStatistics() {

    const savingsRate = calculateSavingsRate();
    const averageExpense = calculateAverageExpense();
    const largestExpense = calculateLargestExpense();
    const transactionCount = calculateTransactionCount();

    savingsRateElement.textContent =
        `${savingsRate.toFixed(1)}%`;

    savingsRateElement.style.color =
        savingsRate >= 0
            ? "var(--income)"
            : "var(--expense)";

    averageExpenseElement.textContent =
        formatCurrency(averageExpense);

    largestExpenseElement.textContent =
        formatCurrency(largestExpense);

    transactionCountElement.textContent =
        transactionCount;
}

// Updating Dashboard

function updateDashboard() {

    const income = calculateIncome();
    const expenses = calculateExpenses();
    const balance = calculateBalance();


    incomeElement.textContent =
        formatCurrency(income);

    expensesElement.textContent =
        formatCurrency(expenses);

    balanceElement.textContent =
        formatCurrency(balance);

}

// Deleting Transactions

function deleteTransaction(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmed) {
        return;
    }

    transactions =
        transactions.filter(
            transaction => transaction.id !== id
        );


    saveTransactions();

    showToast("Transaction deleted.");

    refreshDashboard();

}

function formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

//DARK MODE

function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    const isDark =
        document.body.classList.contains("dark-theme");

    localStorage.setItem(
        "financeFlowTheme",
        isDark ? "dark" : "light"
    );

    themeToggle.textContent =
        isDark ? "☀️" : "🌙";
}

function loadTheme() {
    const savedTheme =
        localStorage.getItem("financeFlowTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");

        themeToggle.textContent = "☀️";
    }
}

// FEEDBACK MESSAGES

function showToast(message, type = "success") {

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("hide");

        setTimeout(() => {
            toast.remove();
        }, 250);

    }, 3000);
}

// EXPORT DATA

function exportTransactions() {

    if (transactions.length === 0) {
        showToast("There is no data to export.", "error");
        return;
    }

    const data = JSON.stringify(transactions, null, 2);

    const blob = new Blob(
        [data],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "financeflow-backup.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showToast("Financial data exported successfully.");
}

// IMPORT DATA

function isValidDate(dateString) {

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return false;
    }

    const date = new Date(`${dateString}T00:00:00`);

    return !Number.isNaN(date.getTime());
}

function validateImportedTransactions(data) {

    if (!Array.isArray(data)) {
        return false;
    }

    return data.every(transaction => {

        if (!transaction || typeof transaction !== "object") {
            return false;
        }

        if (
            typeof transaction.id !== "number" ||
            !Number.isFinite(transaction.id)
        ) {
            return false;
        }

        if (
            typeof transaction.description !== "string" ||
            transaction.description.trim() === ""
        ) {
            return false;
        }

        if (
            typeof transaction.amount !== "number" ||
            !Number.isFinite(transaction.amount) ||
            transaction.amount <= 0
        ) {
            return false;
        }

        if (
            transaction.type !== "income" &&
            transaction.type !== "expense"
        ) {
            return false;
        }

        if (
            typeof transaction.category !== "string" ||
            transaction.category.trim() === ""
        ) {
            return false;
        }

        if (
            typeof transaction.date !== "string" ||
            !isValidDate(transaction.date)
        ) {
            return false;
        }

        return true;
    });
}

// FORM ERROR

function showFormError(message) {

    formError.textContent = message;

    formError.classList.add("visible");
}


function clearFormError() {

    formError.textContent = "";

    formError.classList.remove("visible");

    clearFieldErrors();
}

function clearFieldErrors() {

    descriptionInput.classList.remove("form-input-error");
    amountInput.classList.remove("form-input-error");
    dateInput.classList.remove("form-input-error");

}


// REFRESH DASHBOARD

function refreshDashboard() {

    renderTransactions();
    updateDashboard();
    renderExpenseBreakdown();
    renderIncomeExpenseChart();
    renderSpendingTrend();
    updateFinancialStatistics();

}

// Initialize Application

function initializeApp() {

    loadTransactions();
    loadTheme();

    updateDashboard();
    renderTransactions();
    renderExpenseBreakdown();
    renderIncomeExpenseChart();
    renderSpendingTrend();
    updateFinancialStatistics();

}


initializeApp();