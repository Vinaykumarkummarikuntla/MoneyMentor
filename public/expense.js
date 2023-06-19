// sending expense details
function saveToServer (event) {
  event.preventDefault()
  const expenseAmount = event.target.expenseAmount.value
  const checkDescription = event.target.checkDescription.value
  const category = event.target.category.value
  // const image = event.target.image.value;
  console.log(expenseAmount, checkDescription, category)

  const token = localStorage.getItem('token')

  const obj = { expenseAmount, checkDescription, category }

  axios
    .post('http://localhost:4000/expensedetails', obj, {
      headers: { Authorization: token }
    })
    .then((response) => {
      console.log(response)
    })
    .catch((err) => {
      console.log(err)
    })
}

// retreiveing the expense details
window
  .addEventListener('DOMContentLoaded', () => {
    const page = 1
    getExpenseDetails(page)

    const premiumToken = localStorage.getItem('token')
    console.log(
      'at the time of getting expene details localStorage Premiumtoken getItem',
      premiumToken
    )
    const decodeToken = parseJwt(premiumToken)
    console.log('decoded Token', decodeToken)
    console.log(decodeToken.isPremiumUser)

    if (decodeToken.isPremiumUser) {
      isPremiumUserMessage()
    }
  })
  .catch((err) => {
    console.log(err)
  })
// })

// expense add to UI
function showExpenseDetails (expense) {
  console.log('showExpenseDetails function called')
  console.log('Expense amount:', expense.expenseamount)
  const parentElement = document.getElementsByClassName('tbody')[0]

  childHTML = `<tr id =  ${expense.id}> <td>${expense.expenseamount} </td>
    <td>${expense.category}</td> 
    <td> ${expense.description}</td>
    <td> <button onclick = "deleteExpense('${expense.id}')" class = "btn btn-danger">Delete</button></td>
    </tr>`
  parentElement.innerHTML = parentElement.innerHTML + childHTML

  // parentElement.insertAdjacentHTML('beforeend', childHTML)

  // showYearReportUI()
}

// Pagination
function showPagination ({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage
}) {
  const pagination = document.querySelector('.pagination-container')

  pagination.innerHTML = ''
  // previousPage
  if (hasPreviousPage) {
    const btn2 = document.createElement('button')
    btn2.textContent = previousPage
    btn2.addEventListener('click', () => getExpenseDetails(previousPage))
    pagination.appendChild(btn2)
  }
  // currentPage
  const btn1 = document.createElement('button')
  btn1.textContent = currentPage
  btn1.addEventListener('click', () => getExpenseDetails(currentPage))
  pagination.appendChild(btn1)

  // nextPage
  if (hasNextPage) {
    const btn3 = document.createElement('button')
    btn3.textContent = nextPage
    btn3.addEventListener('click', () => getExpenseDetails(nextPage))
    pagination.appendChild(btn3)
  }
}

function getExpenseDetails (page) {
  const parentElement = document.getElementsByClassName('tbody')[0]
  parentElement.innerHTML = ''

  const token = localStorage.getItem('token')
  axios
    .get(`http://localhost:4000/expensedetails?page=${page}`, {
      headers: { Authorization: token }
    })
    .then((response) => {
      console.log(response)
      const result = response.data.expensedetails
      const paginationResponse = response.data.pageData
      console.log('getexpensedetais callled', result)
      console.log(
        'getexpensedetais callled while paginationREsponse',
        paginationResponse
      )

      for (let i = 0; i < result.length; i++) {
        showExpenseDetails(result[i])
      }
      showPagination(paginationResponse)
    })
    .catch((err) => {
      console.log(err)
    })
}

// delete expense in backend
function deleteExpense (expenseId) {
  const token = localStorage.getItem('token')
  console.log(expenseId)
  // { data: { expenseId } } --> delete
  axios
    .delete('http://localhost:4000/deleteexpense/${expenseId}', {
      headers: { Authorization: token }
    })
    .then((response) => {
      console.log(response)

      // remove UI element
      const expenseElement = document.getElementById(`expense-${expenseId}`)
      if (expenseElement) {
        expenseElement.remove()
      }
    })
    .catch((err) => {
      console.log(err)
      document.body.innerHTML +=
        '<h2>Something went wrong item is not found in database</h2>'
    })
}

// showing premium user message
function isPremiumUserMessage () {
  const buypremium = document.getElementById('rzp-button1')

  buypremium.style.display = 'none'
  document.getElementById('message').innerHTML =
    '<h4>You are a Premium User. Access All Features Now!</h4>'

  document.getElementById('leaderboard').innerHTML =
    '<button onclick = "showLeaderBoard()" class ="btn btn-secondary btn-lg" > Show LeaderBoard </button>'
}

// get show LeaderBoard
let Count = 1
async function showLeaderBoard () {
  const token = localStorage.getItem('token')

  // document.getElementById("show-leaderboard-btn").style.display = "none";
  document.getElementById('leaderboard-main').style.display = 'block'

  const leaderboardresponse = await axios
    .get('http://localhost:4000/premium/showleaderboard', {
      headers: { Authorization: token }
    })

    .then((response) => {
      console.log('leaderboardresponse', response.data.leaderboardresponse)
      const leaderboardresponse = response.data.leaderboardresponse

      for (let i = 0; i < leaderboardresponse.length; i++) {
        showLeaderBoardUI(leaderboardresponse[i], Count)
        Count++
      }
    })
    .catch((error) => {
      console.log('error', error)
    })
}

// leaderboard  add to UI
function showLeaderBoardUI (leaderboardresponse, Count) {
  const parentElement = document.getElementById('dynamic-leaderboard')

  childHTML = `<tr>
    <td> ${Count}</td>
    <td>${leaderboardresponse.username} </td>
    <td>${leaderboardresponse.totalAmount}</td> 
    </tr>`
  parentElement.innerHTML = parentElement.innerHTML + childHTML
}

// decoding token
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

// Razorpay
document.getElementById('rzp-button1').onclick = async function (e) {
  alert('welcome to razorpay')
  e.preventDefault()

  const response = await axios.get('http://localhost:4000/buypremiumship', {
    headers: { Authorization: token }
  })
  console.log('razorpay response', response)
  // payment success
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      const transactionResponse = await axios.post(
        'http://localhost:4000/updatetransactionstatus',
        {
          order_id: options.order_id, // Correct the property name to "order_id"
          payment_id: response.razorpay_payment_id
        },
        { headers: { Authorization: token } }
      )
      alert('You are Premium User Now')
      console.log('Token:', transactionResponse.data.token)
      // console.log("transaction return responsee",transactionResponse)
      localStorage.setItem('token', transactionResponse.data.token)

      const premiumToken = localStorage.getItem('token')
      console.log('localStorage Premiumtoken getItem', premiumToken)

      const decodeToken = parseJwt(premiumToken)
      console.log(decodeToken)
      console.log(decodeToken.isPremiumUser)
      if (decodeToken.isPremiumUser) {
        isPremiumUserMessage()
      }
    }
  }
  const rzp = new Razorpay(options)
  rzp.open()

  // payment failed
  rzp.on('payment.failed', function (response) {
    console.log(response)
    alert('Something went wrong')
  })
}

// showing year report UI
function showYearReportUI () {
  document.getElementById('report-main').style.display = 'block'
  const parentElement = document.getElementById('dynamic-yearlyreport')

  childHTML = `<tr>
    <td> 2023-06-17 </td>
    <td>Groceries</td>
    <td>Rice</td> 
    <td>100</td> 
    <td>200</td> 
    </tr>`
  parentElement.innerHTML = parentElement.innerHTML + childHTML
}

// download report
function downloadfile (event) {
  event.preventDefault()
  const token = localStorage.getItem('token')

  axios
    .get('http://localhost:4000/downloadreport', {
      headers: { Authorization: token }
    })
    .then((response) => {
      if (response.status === 200) {
        const a = document.createElement('a')
        a.href = response.data.fileURL
        a.download = 'myexpense.csv'
        a.click()
      } else {
        throw new Error(response.data.message)
      }
    })
    .catch((err) => {
      console.log(err)
    })

  axios
    .get('http://localhost:4000/getalldownloadedreports', {
      headers: { Authorization: token }
    })
    .then((response) => {
      console.log('all downloaded files', response)
    })
    .catch((err) => {
      console.log(err)
    })
}
