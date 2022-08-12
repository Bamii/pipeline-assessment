# implementation details

## stack
- html
- css
- typescript

## how does this work
Everything done on the app is encapsulated in the App class.
- the App class contains data as listed below;
  - current page number
  - the next url to be called (to be gotten from the api). initial value is the API url appended with &page=1
  - placeholders for the table, nav buttons, and pagination elements
  - an object representing the data for all the pages using the page number as key and data for that page as the value
  - status of the current fetch. (loading, or default)
  - current maximum page number. (i'm using this because the api fetches 2 pages at once... so fetches will only happen if the user has navigated to the maximum page number.) 
<hr>
- when the page is loaded, the App is instantiated, and the initialise method is called with an object argument which contains the queryselector for the table, nav buttons, and error div.

on initilisation:
---
  - the table is initialised
    - table element is saved to the class.
  - the navigation elements are initialised
    - all navigation elements are saved to the class.
    - an event listener is attached to the previous and next buttons; to call their respective functions.  
  - the fetch routine is run.
  - the render routine is run
 
- when the next button is clicked
  - if the current page is the max page;
    - run fetch routine.
    - increment the page number by 1
  - run render routine

- when the prev button is clicked
  - if the current page is zero, return;
  - decrement the page number by 1
  - run the render routine
  
fetch routine:
---
  - fetch the next paged data using the next url
  - on successful fetch,
    - the data is saved to the data object.
    - the next url is updated
    - the maxpage is incremented by 2
  - on failed fetch
    - display error
    - execution stops 

render routine:
---
  - the render function renders the list using the data for the current page number.
  - the navigation buttons are updated.
  - the pagination text is updated
