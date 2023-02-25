const calendar = document.querySelector("#calendar"); // div cotaining all 35 days
const monthEl = document.querySelector("#month");

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const STORYBLOK_URL =
  "https://api-us.storyblok.com/v2/cdn/stories?starts_with=events&token=fJzWV7rZ5RRz5FPgIeUPrgtt";

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

// load events from Storyblok
let events; // global variable instead of local variable in the loadEvents function because we're going to use it in the updateCalendar function
const loadEvents = async () => {
  const res = await fetch(STORYBLOK_URL);
  const { stories } = await res.json(); // {stories} destructuring of data.stories
  // mapping events with days
  events = stories.reduce((acc, event) => {
    const eventTime = new Date(event.content.time); // event content created in Storyblok
    const eventDate = new Date(eventTime.toDateString()); // return date protion of date object
    acc[eventDate] = event.content;
    return acc;
  }, {}); // will start with an empty object
};

loadEvents();

// blank calendar with 35 days
const drawBlankCalendar = () => {
  for (let i = 0; i < 35; i++) {
    const day = document.createElement("div");
    day.classList.add("day");

    const dayText = document.createElement("p");
    dayText.classList.add("day-text");
    dayText.innerText = days[i % 7]; // update day of the week from days array. When it reaches i=7 (modulo operator) it will star with 0 again

    const dayNumber = document.createElement("p");
    dayNumber.classList.add("day-number");

    const eventName = document.createElement("small");
    eventName.classList.add("event-name");

    day.appendChild(dayText);
    day.appendChild(dayNumber);
    day.appendChild(eventName);

    calendar.appendChild(day);
  }
};

// update calendar
const updateCalendar = (month, year, events) => {
  const dayElements = document.querySelectorAll(".day"); // all day divs

  const theFirst = new Date(today.getFullYear(), today.getMonth(), 1); // get the date of the first day of the month
  theFirst.setMonth(month); // get today's month
  theFirst.setFullYear(year); // get today's year

  const theFirstDayOfWeek = theFirst.getDay(); // get the week's day of the first date of the month
  const monthName = months[month]; // get the name of the month of month's parameter from months array
  const monthWithYear = `${monthName} - ${year}`; // get combination of month and year for calendar H1
  monthEl.innerText = monthWithYear;
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // if we get day 0 of next month, it will be the last day of the current month, in that way we get how many days the current month has

  let dayCounter = 1;
  for (let i = 0; i < dayElements.length; i++) {
    const day = dayElements[i]; // get each of the 35 days div

    const dayNumber = day.querySelector(".day-number"); // get number <p>
    if (i >= theFirstDayOfWeek && dayCounter <= daysInMonth) {
      // decide if the day has events
      const thisDate = new Date(year, month, dayCounter);
      const eventName = day.querySelector(".event-name");
      if (events[thisDate]) {
        const event = events[thisDate];
        eventName.innerText = `- ${event.title}`;
      } else {
        eventName.innerText = "";
      }

      dayNumber.innerText = dayCounter;
      dayCounter++;
    } else {
      dayNumber.innerText = ""; // reset days divs without day number
    }
  }
};

const previousMonth = () => {
  if (currentMonth === 0) {
    currentMonth = 12;
    currentYear--;
  }
  updateCalendar(--currentMonth, currentYear, events);
};

const nextMonth = () => {
  if (currentMonth === 11) {
    currentMonth = -1;
    currentYear++;
  }
  updateCalendar(++currentMonth, currentYear, events);
};

// wait for loadEvents to load and then call drawBlankCalendar and updateCalendar functions
const load = async () => {
  await loadEvents();
  drawBlankCalendar();
  updateCalendar(currentMonth, currentYear, events);
};

load();
