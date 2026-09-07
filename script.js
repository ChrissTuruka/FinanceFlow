// =========================================
// FINANCEFLOW APPLICATION
// =========================================


// =========================================
// APPLICATION STATE
// =========================================

let transactions = [];

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const typeFilter = document.getElementById("typeFilter");
const sortSelect = document.getElementById("sortSelect");

// =========================================
// LOCAL STORAGE
// =========================================

function saveTransactions() {

    localStorage.setItem(
        "financeFlowTransactions",
        JSON.stringify(transactions)
    );

}

function loadTransactions() {

    const savedTransactions =
        localStorage.getItem(
            "financeFlowTransactions"
        );


    if (savedTransactions) {

        transactions =
            JSON.parse(savedTransactions);

    }

}


// =========================================
// DOM ELEMENTS
// =========================================

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


// =========================================
// MODAL FUNCTIONS
// =========================================

function openTransactionModal() {

    transactionModal.classList.add("active");

}


function closeTransactionModal() {

    transactionModal.classList.remove("active");

    transactionForm.reset();

}


// =========================================
// EVENT LISTENERS
// =========================================

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


// =========================================
// ADD TRANSACTION
// =========================================

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const description =
            document.getElementById("description").value.trim();

        const amount =
            Number(document.getElementById("amount").value);

        const type =
            document.getElementById("type").value;

        const category =
            document.getElementById("category").value;

        const date =
            document.getElementById("date").value;


        const transaction = {

            id: Date.now(),

            description: description,

            amount: amount,

            type: type,

            category: category,

            date: date

        };


        transactions.push(transaction);

        saveTransactions();

        console.log("Transaction added:", transaction);

        console.log("All transactions:", transactions);

        renderTransactions();

        updateDashboard();

        renderExpenseBreakdown();

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

// =========================================
// RENDER TRANSACTIONS
// =========================================

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

    const filteredTransactions = getFilteredTransactions();

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


        transactionElement.innerHTML = `

            <div class="transaction-info">

                <strong>
                    ${transaction.description}
                </strong>

                <span>
                    ${transaction.category}
                </span>

            </div>


            <div class="transaction-right">

                <span class="transaction-amount ${transaction.type}">

                    ${transaction.type === "income" ? "+" : "-"}
                    ${formatCurrency(transaction.amount)}

                </span>


                <button
                    class="delete-transaction"
                    data-id="${transaction.id}"
                    title="Delete transaction"
                >
                    ×
                </button>

            </div>

        `;


        transactionList.appendChild(
            transactionElement
        );

    });

}

// =========================================
// DELETE BUTTON HANDLER
// =========================================

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

// =========================================
// FORMAT CURRENCY
// =========================================

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "TZS"
    }).format(amount);

}

// =========================================
// UPDATE DASHBOARD
// =========================================

// =========================================
// CALCULATE TOTAL INCOME
// =========================================

function calculateIncome() {

    return transactions
        .filter(transaction => transaction.type === "income")
        .reduce((total, transaction) => {
            return total + transaction.amount;
        }, 0);

}


// =========================================
// CALCULATE TOTAL EXPENSES
// =========================================

function calculateExpenses() {

    return transactions
        .filter(transaction => transaction.type === "expense")
        .reduce((total, transaction) => {
            return total + transaction.amount;
        }, 0);

}

// =========================================
// CALCULATE EXPENSE BREAKDOWN
// =========================================

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

// =========================================
// RENDER EXPENSE BREAKDOWN
// =========================================

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


// =========================================
// CALCULATE BALANCE
// =========================================

function calculateBalance() {

    const income = calculateIncome();

    const expenses = calculateExpenses();

    return income - expenses;

}


// =========================================
// UPDATE DASHBOARD
// =========================================

function updateDashboard() {

    const income = calculateIncome();

    const expenses = calculateExpenses();

    const balance = income - expenses;


    incomeElement.textContent =
        formatCurrency(income);

    expensesElement.textContent =
        formatCurrency(expenses);

    balanceElement.textContent =
        formatCurrency(balance);

}

// =========================================
// DELETE TRANSACTION
// =========================================

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


    renderTransactions();

    updateDashboard();

    renderExpenseBreakdown();

}

searchInput.addEventListener("input", renderTransactions);

categoryFilter.addEventListener("change", renderTransactions);

typeFilter.addEventListener("change", renderTransactions);

sortSelect.addEventListener("change", renderTransactions);

// =========================================
// INITIALIZE APPLICATION
// =========================================

function initializeApp() {

    console.log("FinanceFlow initialized.");

    loadTransactions();
    updateDashboard();
    renderTransactions();
    renderExpenseBreakdown();

}


initializeApp();