const add = document.getElementById('add'),
  description = document.getElementById('description'),
  amount = document.getElementById('amount'),
  expense = document.getElementById('expense'),
  income = document.getElementById('income'),
  listItem = document.getElementById('list_item'),
  balance = document.getElementById('balance');

listItem.addEventListener('click', deleteExpense);

//load expenses from local storage
window.onload = function () {
  let expenses;
  if (localStorage.getItem('expenses') === null) {
    listItem.style.display = 'none';
    expenses = [];
    localStorage.setItem('expenses', JSON.stringify(expenses));
  } else {
    expenses = JSON.parse(localStorage.getItem("expenses"));
    let inc = [];
    let exp = [];
    expenses.forEach(expense => {
      if (Number(expense[1]) < 0) {
        exp.push(Number(expense[1]))
        list_rendering(expense[0], expense[1], 'ex')
      } else {
        inc.push(Number(expense[1]))
        list_rendering(expense[0], expense[1], 'in')
      }
    });
    expenseBreakdown(inc, exp)
  }
}

function expenseBreakdown(inc, exp) {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  if (inc.length == 0) {
    inc = [0];
  } else if (exp.length == 0) {
    exp = [0];
  }

  i = inc.reduce(reducer)
  e = exp.reduce(reducer)

  income.innerText = formatMoney(i)
  expense.innerText = formatMoney(e)
  netAmount = e + i
  if (netAmount < 0) {
    balance.classList += ' text-danger'
  } else {
    balance.classList += ' text-success'
  }
  balance.innerText = formatMoney(netAmount)
}

function formatMoney(money) {
  return '$' + money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

add.addEventListener('click', (e) => {
  if (amount.value == '' && description.value == '') {
    showError(amount, description)
  } else if (amount.value == '') {
    showError(amount);
  } else if (description.value == '') {
    showError(description);
  } else {
    logExpense();
  }
  e.preventDefault();
})

function showError(element, element1 = listItem) {
  element.className += ' is-invalid';
  element1.className += ' is-invalid';
  setTimeout(() => {
    element.classList.remove("is-invalid");
    element1.classList.remove("is-invalid");
  }, 3000);
}

function logExpense() {
  if (amount.value < 0) {
    list_rendering(description.value, amount.value, 'ex')
    saveExpense(description.value, amount.value)
  } else {
    list_rendering(description.value, amount.value, 'in')
    saveExpense(description.value, amount.value)
  }
}

function saveExpense(desc, amt) {
  expenses = JSON.parse(localStorage.getItem("expenses"));
  expenses.push([desc, Number(amt)])
  localStorage.setItem('expenses', JSON.stringify(expenses));
  location.reload()
}

function list_rendering(desc, amt, clas) {
  listItem.innerHTML += `
  <li class="list-group-item border-right-${clas} mr-3 ml-3">
  <span>${desc}</span>
  <i id="push_i" class="fa fa-close"></i>
  <span>${formatMoney(Number(amt))}</span></li>`
}

function deleteExpense(e) {
  console.log('deleted')
  let target = e.target;
  if (target.className == 'fa fa-close') {
    if (confirm('Are u sure')) {
      target.parentElement.remove();
      del = target.parentElement.firstElementChild.textContent;

      expenses = JSON.parse(localStorage.getItem("expenses"));
      expenses.forEach((expense, index) => {
        if (del == expense[0]) {
          console.log("yes")
          expenses.splice(index, 1);
        }
      });
      localStorage.setItem('expenses', JSON.stringify(expenses));
      location.reload();
    }
  }
}