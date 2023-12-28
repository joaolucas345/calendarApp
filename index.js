const date = new Date()

const ACTION_HISTORY_MAXIMUM = 5

let actionHistory = []


let reminders = localStorage.getItem("reminders") ? JSON.parse(localStorage.getItem("reminders")) : []

const saveRemind = (dateKey, content) => {
    reminders.push({ content, dateKey })
    localStorage.setItem("reminders", JSON.stringify(reminders))
}

const removeRemind = (dateKey, content) => {
    const index = reminders.findIndex(remind => remind.dateKey == dateKey && remind.content == content)
    reminders.splice(index, 1)
    localStorage.setItem("reminders", JSON.stringify(reminders))
}

const months = []
months[0] = { month: "january", length: 31 }
months[1] = { month: "february", length: 28 }
months[2] = { month: "march", length: 31 }
months[3] = { month: "april", length: 30 }
months[4] = { month: "may", length: 31 }
months[5] = { month: "june", length: 30 }
months[6] = { month: "july", length: 31 }
months[7] = { month: "august", length: 31 }
months[8] = { month: "september", length: 30 }
months[9] = { month: "october", length: 31 }
months[10] = { month: "november", length: 30 }
months[11] = { month: "december", length: 31 }

const LIMIT_YEARS = 20

const main = document.querySelector("main")
const header = document.querySelector("header")
const selectMonth = document.getElementById("SelectMonth")
const selectYear = document.getElementById("SelectYear")
const calendarCointainer = document.querySelector(".calendar-container")

const populateSelectYear = () => {
    let optionEl
    for(let i = 0; i <= LIMIT_YEARS; i++) {
        optionEl = document.createElement("option")
        optionEl.innerHTML = date.getFullYear() + i
        optionEl.value = optionEl.innerHTML
        selectYear.appendChild(optionEl)
    }
}

const populateSelectMonth = () => {
    let optionEl
    for(let i = 0; i < months.length; i++) {
        optionEl = document.createElement("option")
        if(i == date.getMonth()) optionEl.selected = true
        optionEl.innerHTML = `${months[i].month[0].toUpperCase()}${months[i].month.substring(1)}`
        optionEl.value = i
        selectMonth.appendChild(optionEl)
    }
}


// create options in each select
populateSelectYear()
populateSelectMonth()

const createReminds = (reminds, parentElement, historyDisable) => {
    let el
    for(let remind of reminds) {
        el = document.createElement("div")
        el.innerHTML = remind.content
        el.className = "reminds"
        el.id = remind.dateKey
        el.onclick = () => {
            removeRemind(remind.dateKey, remind.content)
            if(!historyDisable) actionHistory.push({ action: "removeRemind", remind: {  content: remind.content, dateKey: remind.dateKey }, parentEl: parentElement })
            el.remove()
        }
        parentElement.appendChild(el)
    }
}

const renderCalendar = () => {
    calendarCointainer.innerHTML = ""
    let divEl
    const month = date.getMonth()
    for(let i = 0; i < months[month].length; i++) {
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${i+1}`
        divEl = document.createElement("div")
        divEl.className = "days-container"
        const p = document.createElement("p")
        p.innerHTML = i+1
        const remindContainers = document.createElement("div")
        remindContainers.className = "remind-container"

        const reminds = reminders.filter(remind => remind.dateKey == dateKey)
        if(reminds) createReminds(reminds, remindContainers)

        p.onclick = () => {
            const content = prompt("what is the remind")
            if(content) {
                saveRemind(dateKey, content)
                actionHistory.push({ action: "addRemind", remind: {  content, dateKey }, parentEl: remindContainers })
                createReminds([{ dateKey, content }], remindContainers)
            }
        }
        divEl.appendChild(p)

        divEl.appendChild(remindContainers)

        calendarCointainer.appendChild(divEl)
    }
}

renderCalendar()



selectYear.onchange = (e) => {
    date.setFullYear(e.target.value)
    renderCalendar()
}

selectMonth.onchange = (e) => {
    date.setMonth(e.target.value)
    renderCalendar()
}


document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'z') {
        if(!(actionHistory[actionHistory.length - 1])) return
        const restoring = actionHistory[actionHistory.length - 1]
        if(restoring.action == "addRemind") {
            // console.log(restoring.parentEl.childNodes)
            const elements = Array.from(restoring.parentEl.childNodes).filter(child => child.id == restoring.remind.dateKey && child.innerHTML == restoring.remind.content)
            for(let element of elements) {
                element.remove()
            }
            removeRemind(restoring.remind.dateKey, restoring.remind.content)

        } else if(restoring.action == "removeRemind") {
            saveRemind(restoring.remind.dateKey, restoring.remind.content)
            createReminds([{ dateKey: restoring.remind.dateKey, content: restoring.remind.content }], restoring.parentEl, true)
        }
        actionHistory.pop()
    }
  });
