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
      if (Number(expense[2]) < 0) {
        exp.push(Number(expense[2]))
        list_rendering(expense[0], expense[1], expense[2], 'ex')
      } else {
        inc.push(Number(expense[2]))
        list_rendering(expense[0], expense[1], expense[2], 'in')
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

//validation
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
  time = Date.now();
  if (amount.value < 0) {
    list_rendering(time, description.value, amount.value, 'ex')
    saveExpense(time, description.value, amount.value)
  } else {
    list_rendering(time, description.value, amount.value, 'in')
    saveExpense(time, description.value, amount.value)
  }
}

function saveExpense(time, desc, amt) {
  expenses = JSON.parse(localStorage.getItem("expenses"));
  expenses.push([time, desc, Number(amt)])
  localStorage.setItem('expenses', JSON.stringify(expenses));
  location.reload()
}

function list_rendering(time, desc, amt, clas) {
  listItem.innerHTML += `
  <li class="list-group-item border-right-${clas} mr-3 ml-3">
  <i class="fa fa-close"></i>

  <span class="text-capitalize">${desc}</span>
  <div class="row text-right">
  <span class="col-12">${formatMoney(Number(amt))}</span>
  <span class="col-12 font-weight-light" style="font-size:small">${elapsedTime(time)}</span></div></li>`
}

function deleteExpense(e) {
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

function elapsedTime(time) {
  currentTime = Date.now();
  elapsed = currentTime - time;

  seconds = elapsed / 1000 //seconds
  minutes = elapsed / 60000 //minutes
  hours = elapsed/ 3.6e+6 //hours
  days = elapsed / 8.64e+7 //days
  weeks = elapsed/ 6.048e+8 //weeks
  months = elapsed/ 2.628e+9 //months
  years = elapsed / 3.154e+10 //months

  if (minutes < 1) {
    return Math.floor(seconds) + ' seconds ago'
  } else if (hours < 1) {
    return Math.floor(minutes) + ' minutes ago'
  } else if (hours > 1 && days < 1) {
    return Math.floor(hours) + ' hours ago'
  } else if (days > 1 && days < 7) {
    return Math.floor(days) + ' days'
  } else if (days > 7 && weeks < 4) {
    return Math.floor(weeks) + ' weeks ago'
  } else if (weeks > 4 && months < 12) {
    return Math.floor(months) + ' months ago'
  } else if (months > 12) {
    return Math.floor(years) + ' years ago'
  }
}