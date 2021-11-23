
let startingDate = document.querySelector('#startingdate')

let list = document.querySelector('#list')
let addList = document.querySelector('#addList')
let order = document.querySelector('#order')
let arr = []
let finalResult = [["order", "Full Name", "subject", "Date"]]
let orderStudents = 1
let adder = 0
let ready = false
let dataClean = true


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
      let regexName = student.name.match(/[^\w\s.-]/gi, "") || student.subject.match(/[^\w\s.-]/gi, "") ? false : true;
      if (regexName) {
        arr.push(student)
      } else {
        dataClean = false
      }
      console.log(dataClean, student.name, student.subject);
    }
  })
  if (dataClean && arr.length > 0) {
    listItems()
  } else {
    dataClean ? alert('you have to add students first  ') : alert('you have invalid input try to remove special caracters  ')
    dataClean = true
    reset()
  }
})


//get random student from the List
const getRandom = () => {
  if (arr.length > 0) {
    let couter = 0
    let falsh = setInterval(() => {
      let currentIndex = Math.floor(Math.random() * arr.length)
      console.log(currentIndex);
      flash()
      document.querySelector('#wait').innerHTML = `${arr[currentIndex].name}`
      couter++
      if (couter > 30) {
        clearInterval(falsh)
        ready = true
        couter = 0
        greenFlash()
      }
      if (ready) {
        addOrder(currentIndex)
        ready = false
      }
    }, 100);
  } else {
    alert("you are done ")
    return
  }
}

//reset to input step
const reset = () => {
  adder = 0
  orderStudents = 1
  finalResult = [["order", "Full Name", "subject", "Date"]]
  arr = []
  order.innerHTML = ""
  list.innerHTML = ""
  document.querySelector('#listItemHandler').style.display = "flex"
  document.querySelector('#wait').innerHTML = " waiting you pick..."
  document.querySelector('#wait').classList.remove("bg-green-400")
  document.querySelector('#wait').classList.add("bg-gray-200")

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
    let date = skipWeekend(moment(datePicked, 'DD-MM-YYYY'), orderStudents + adder - 1)
    span.setAttribute("class", "w-full flex justify-between	")
    span.innerHTML = `<span>${orderStudents} - ${elm.name}  =>   ${elm.subject}</span><span> ${date._d.toLocaleString().split(',')[0]}</span>`
    order.appendChild(span)
    arr.splice(idx, 1)
    let dateTochange = (new Date(date._d.toLocaleString().split(',')[0])).toLocaleDateString().split('/').join('-')
    finalResult.push(`${orderStudents} ${elm.name.split(' ').join(".")} ${elm.subject.split(' ').join('.')} ${dateTochange}`.split(' '))
    listItems()
  }
  orderStudents++
  if (arr.length == 0) document.querySelector('#wait').innerHTML = "DONE"
}

//check the validity of the date and skip the weekends
const skipWeekend = (d, days) => {
  date = moment(d); // use a clone
  if (days == 0 && !isNotWeekEnd(date)) {
    return moment(defaultSkipWeekEnd(d))
  }
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
  let csvContent = "data:text/csv;charset=utf-8,"
    + finalResult.map(e => e.join(",")).join("\n");
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
}


//set Default starting date to today
const defaultSkipWeekEnd = (date) => {
  let d = moment(date);
  if (!isNotWeekEnd(date)) {
    d.isoWeekday() == 6 ? (date = d.add(2, 'days'), adder = 1) : (date = d.add(1, 'days'), adder = 1)
    let arrayDate = date._d.toLocaleDateString().split('/')
    return [arrayDate[2], arrayDate[0], arrayDate[1]].join('-')
  } else {
    let arrayDate = date._d.toLocaleDateString().split('/')
    return [arrayDate[2], arrayDate[0], arrayDate[1]].join('-')
  }
}



const flash = () => {
  document.querySelector('#wait').classList.remove("bg-gray-200")
  document.querySelector('#wait').classList.remove("bg-green-400")
  document.querySelector('#wait').classList.add("bg-white")
  document.querySelector('#wait').classList.add("text-white")
  setTimeout(() => {
    document.querySelector('#wait').classList.remove("bg-white")
    document.querySelector('#wait').classList.remove("text-white")
    document.querySelector('#wait').classList.add("bg-gray-200")
  }, 100);
}

const alInOne = () => {
  for (let i = 0; i < arr.length; i++) {
    getRandom()
  }
}

const greenFlash = () => {
  document.querySelector('#wait').classList.remove("bg-gray-200")
  document.querySelector('#wait').classList.add("bg-green-400")
  document.querySelector('#wait').classList.add("text-green")
}


startingDate.defaultValue = defaultSkipWeekEnd(moment((new Date()).toISOString().split('T')[0]));
//making functions global
window.downloadCSV = downloadCSV
window.getRandom = getRandom
window.reset = reset
window.alInOne = alInOne




// name : George Eliot
// subject : George Eliot;
// name : J.K. Rowling
// subject : J.K. Rowling;
// name : Walt Whitman
// subject : Walt Whitman;
// name : John Steinbeck
// subject : John Steinbeck;
// name : Emily Bronte
// subject : Emily Bronte;
// name : Stephen King
// subject : Stephen King;
// name : J.R.R Tolkien
// subject : J.R.R Tolkien;
// name : Charles Dickens
// subject : Charles Dickens;
// name : Jane Austen
// subject : Jane Austen;
// name : William Butler Yeats
// subject : William Butler Yeats;
// name : William Shakespeare
// subject : William Shakespeare;
// name : Mark Twain
// subject : Mark Twain;
// name : William Faulkner
// subject : William Faulkner;
// name : Emily Dickinson
// subject : Emily Dickinson;
// name : George Orwell
// subject : George Orwell;
// name : Ernest Hemingway
// subject : Ernest Hemingway;
// name : Harper Lee
// subject : Harper Lee;
// name : F. Scott Fitzgerald
// subject : F. Scott Fitzgerald;
// name : Edgar Allen Poe
// subject : Edgar Allen Poe;


// name: maacha
// subject: otmane;
// name: RAMMACH
// subject: ELMAHDI;
// name: CHOUQFI
// subject: Ayoub;
// name: HASSOUNE
// subject: YOUNESS;
// name: Hajjari
// subject: Youseff;
// name: Rhazlani
// subject: Othmane;
// name: ETTGHARSSI
// subject: Achraf;
// name: CHANTAF
// subject: BADR;
// name: Enefida
// subject: Rafik;
// name: ELHOUBI
// subject: YASSINE;
// name: BELBHIRIYA
// subject: Zineb;
// name: ED - DOUJ
// subject: Ouissal;
// name: Redouane
// subject: BOUABANA;
// name:EL MESKINE
// subject: Anas;
// name: Boumlik
// subject: mohamed;
// name: elmejjati
// subject: soufiane;
// name: Rkhis
// subject: Imane;
// name:EL KAMOUNI
// subject: HICHAM;
// name: Azouzi
// subject: Hamza;
// name: ESSALAMI
// subject: SAID;
// name: Moultamiss
// subject: Walid;
// name: elbakkouri
// subject: youssef;
// name: Khomsi
// subject: Adam;