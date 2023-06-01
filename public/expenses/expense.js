function saveToServer(event) {
  event.preventDefault();
  const expenseAmount = event.target.expenseAmount.value;
  const checkDescription = event.target.checkDescription.value;
  const category = event.target.category.value;
  // const image = event.target.image.value;
  console.log(expenseAmount, checkDescription, category);

  const obj = { expenseAmount, checkDescription, category };

  axios
    .post("http://localhost:4000/expensedetails", obj)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http://localhost:4000/expensedetails")
    .then((response) => {
      const result = response.data.expensedetails;

      for (let i = 0; i < result.length; i++) {
        showExpenseDetails(result[i]);
      }
      //   console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

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

function deleteExpense(expenseId) {
  console.log(expenseId);

  axios
    .delete("http://localhost:4000/deleteexpense", { data: { expenseId } })
    .then((response) => {
      console.log(response);

      // Remove the UI element
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
