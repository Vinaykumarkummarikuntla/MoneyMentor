// sending expense details
function saveToServer(event) {
  event.preventDefault();
  const expenseAmount = event.target.expenseAmount.value;
  const checkDescription = event.target.checkDescription.value;
  const category = event.target.category.value;
  // const image = event.target.image.value;
  console.log(expenseAmount, checkDescription, category);

  const token = localStorage.getItem("token");

  const obj = { expenseAmount, checkDescription, category };

  axios
    .post("http://localhost:4000/expensedetails", obj, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}

// retreiveing the expense details
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:4000/expensedetails", {
      headers: { Authorization: token },
    })
    .then((response) => {
      const result = response.data.expensedetails;

      for (let i = 0; i < result.length; i++) {
        showExpenseDetails(result[i]);
      }
      //   console.log(result);

      const premiumToken = localStorage.getItem("Premiumtoken");
      console.log(
        "at the time of getting expene details localStorage Premiumtoken getItem",
        premiumToken
      );
      const decodeToken = parseJwt(premiumToken);
      console.log(decodeToken);
      console.log(decodeToken.isPremiumUser);

      if (decodeToken.isPremiumUser) {
        isPremiumUserMessage();
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// expense add to UI
function showExpenseDetails(expense) {
  console.log("showExpenseDetails function called");
  console.log("Expense amount:", expense.expenseamount);
  const parentElement = document.getElementsByClassName("tbody")[0];

  childHTML = `<tr id =  ${expense.id}> <td>${expense.expenseamount} </td>
    <td>${expense.category}</td> 
    <td> ${expense.description}</td>
    <td> <button onclick = "deleteExpense('${expense.id}')" class = "btn btn-danger">Delete</button></td>
    </tr>`;
  parentElement.innerHTML = parentElement.innerHTML + childHTML;
}

// delete expense in backend
function deleteExpense(expenseId) {
  const token = localStorage.getItem("token");
  console.log(expenseId);
  // { data: { expenseId } } --> delete
  axios
    .delete("http://localhost:4000/deleteexpense/${expenseId}", {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);

      // remove UI element
      const expenseElement = document.getElementById(`expense-${expenseId}`);
      if (expenseElement) {
        expenseElement.remove();
      }
    })
    .catch((err) => {
      console.log(err);
      document.body.innerHTML +=
        "<h2>Something went wrong item is not found in database</h2>";
    });
}

function isPremiumUserMessage () {
  const buypremium = document.getElementById("rzp-button1");

  buypremium.style.display = "none";
  document.getElementById("message").innerHTML =
    "<h4>You are a Premium User. Access All Features Now!</h4>";

  document.getElementById("leaderboard").innerHTML =
    '<button onclick = "showLeaderBoard()" class ="btn btn-secondary btn-lg" > Show LeaderBoard </button>';
}

// show LeaderBoard

function showLeaderBoard () {
  // document.getElementById("show-leaderboard-btn").style.display = "none";
  document.getElementById("leaderboard-main").style.display = "block";

  // Simulated dynamic leaderboard data
  const leaderboardData = [
    { rank: 1, name: "Vinay Kumar", points: 3000 },
    { rank: 2, name: "Mohan", points: 2500 },
    { rank: 3, name: "Zuber", points: 2000 },
    { rank: 4, name: "Ranjith", points: 1500 },
    { rank: 5, name: "Arun", points: 1000 }
  ]

  const leaderboardTable = document.getElementById("dynamic-leaderboard");

  // Generate leaderboard rows dynamically
  leaderboardData.forEach((item) => {
    const row = leaderboardTable.insertRow()
    const rankCell = row.insertCell(0)
    const nameCell = row.insertCell(1)
    const pointsCell = row.insertCell(2)

    rankCell.textContent = item.rank
    nameCell.textContent = item.name
    pointsCell.textContent = item.points
  })
}

// decoding token
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

// Razorpay
document.getElementById("rzp-button1").onclick = async function (e) {
  alert("welcome to razorpay");
  e.preventDefault();
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:4000/buypremiumship", {
    headers: { Authorization: token },
  });
  console.log("razorpay response", response);
  // payment success
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      const transactionResponse = await axios.post(
        "http://localhost:4000/updatetransactionstatus",
        {
          order_id: options.order_id, // Correct the property name to "order_id"
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );
      alert("You are Premium User Now");
      console.log("Token:", transactionResponse.data.token);
      // console.log("transaction return responsee",transactionResponse)
      localStorage.setItem("Premiumtoken", transactionResponse.data.token);

      const premiumToken = localStorage.getItem("Premiumtoken");
      console.log("localStorage Premiumtoken getItem", premiumToken);

      const decodeToken = parseJwt(premiumToken);
      console.log(decodeToken);
      console.log(decodeToken.isPremiumUser);
      if (decodeToken.isPremiumUser) {
        isPremiumUserMessage();
      }
    },
  };
  var rzp = new Razorpay(options);
  rzp.open();

  // payment failed
  rzp.on("payment.failed", function (response) {
    console.log(response);
    alert("Something went wrong");
  });
};
