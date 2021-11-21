import "./style.css"

let startingDate = document.querySelector('#startingdate')

let list = document.querySelector('#list')
let order = document.querySelector('#order')
let arr = []
let finalResult = []
let orderStudents = 1
let ready = false



//add List from textarea to the main data
document.querySelector('#addList').addEventListener("click", (e) => {
  document.querySelector('#listItemHandler').style.display = "none"
  arr = []
  list.innerHTML = ""
  order.innerHTML = ""
  let currentValue = listInput.value
  let data = currentValue.split(';').filter(e => { if (e != "") return e })
  data.forEach(elm => {
    let data = elm.split('\n').filter(e => { if (e != "") return e })
    if (data != "") {
      let student = {
        name: data[0].split(':')[1],
        subject: data[1].split(':')[1]
      }
      arr.push(student)
    }
  })
  listItems()
})


//get random student from the List
const getRandom = () => {
  if (arr.length > 0) {
    let couter = 0
    let falsh = setInterval(() => {
      let currentIndex = Math.floor(Math.random() * arr.length)
      console.log(currentIndex);
      document.querySelector('#wait').innerHTML = `${arr[currentIndex].name}`
      couter++
      if (couter > 10) {
        clearInterval(falsh)
        ready = true
        couter = 0
      }
      if (ready) {
        addOrder(currentIndex)
        ready = false
      }
    }, 100);
  } else {
    alert("you are done ")
  }
}

//reset to input step
const reset = () => {
  orderStudents = 1
  finalResult = []
  arr = []
  order.innerHTML = ""
  list.innerHTML = ""
  document.querySelector('#listItemHandler').style.display = "flex"

}

//List students to the screen 
const listItems = () => {
  list.innerHTML = ""
  arr.forEach((elm, idx) => {
    let div = document.createElement('div')
    div.innerHTML = `${elm.name}`
    div.setAttribute("class", "flex flex-col items-center text-xs bg-indigo-500 rounded-lg gap-4 md:gap-6 px-3 py-2")
    list.appendChild(div)

  })
}


//add student to the order UI
const addOrder = (idx) => {
  let datePicked = startingDate.value.split('-').reverse().join('-');
  let elm = arr[idx]
  if (elm) {
    let span = document.createElement('span')
    let date = skipWeekend(moment(datePicked, 'DD-MM-YYYY'), orderStudents - 1)
    span.setAttribute("class", "w-full flex justify-between	")
    span.innerHTML = `<span>${orderStudents} - ${elm.name} subject  ${elm.subject}</span><span> ${date._d.toLocaleString().split(',')[0]}</span>`
    order.appendChild(span)
    arr.splice(idx, 1)
    finalResult.push(`${orderStudents} ${elm.name} ${elm.subject} ${date._d.toLocaleString().split(',')[0].split('/').reverse().join('-')}`.split(' '))
    listItems()
  }
  orderStudents++
}




//check the validity of the date and skip the weekends
const skipWeekend = (date, days) => {
  date = moment(date); // use a clone
  while (days > 0) {
    date = date.add(1, 'days');
    if (isNotWeekEnd(date)) {
      days -= 1;
    }
  }

  return date;
}

//check if the date is weekend
const isNotWeekEnd = (date) => {
  return date.isoWeekday() !== 6 && date.isoWeekday() !== 7
}


//download CSV  
const downloadCSV = () => {
  console.log(finalResult);
  let csvContent = "data:text/csv;charset=utf-8,"
    + finalResult.map(e => e.join(",")).join("\n");
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
}


//set Default starting date to today 
const defaultSkipWeekEnd = (date) => {
  let d = moment(date);
  if (!isNotWeekEnd(date)) {
    date = d.isoWeekday() == 6 ? d.add(2, 'days') : d.add(1, 'days')
    let arrayDate = date._d.toLocaleDateString().split('/')
    return [arrayDate[2], arrayDate[0], arrayDate[1]].join('-')
  } else {
    return date
  }
}

// startingDate.addEventListener

startingDate.defaultValue = defaultSkipWeekEnd(moment((new Date()).toISOString().split('T')[0]));
//making functions global
window.downloadCSV = downloadCSV
window.getRandom = getRandom
window.reset = reset
