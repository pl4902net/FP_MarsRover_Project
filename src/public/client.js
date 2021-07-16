// Data store object
const store = 
{
    user: { name: 'Phillip' },
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    roverClicked: '',
    roverData: ''
}

const root = document.getElementById('root')

// Function to update store values
const updateStore = (store, newState) => 
{
    store = Object.assign(store, newState);
    render(root, store)
}

// Build webpage using App function
const render = async (root, state) => 
{
    root.innerHTML = App(state)
}

// create content of page
const App = (state) => 
{
    return (
    `
        <header>
            <h1>Welcome to ${store.user.name}'s Mars Rovers Dashboard!</h1>
        </header>
        <main>
            <section>${Rover(state)}</section>
        </main>
        <footer></footer>
    `)
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => 
{
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS
// Maps array and creates individual HTML elements for the items
const fnMap = (state, arr, htmlElem) => 
{
    return (
        `
        ${arr.map(x => htmlElem(state, x)).join('')}
        `)
}

// Creates HTML div element
const createDiv = (state, fnMap, arr, htmlElem) => 
{
    return (
        `
        <div>
            ${fnMap(state, arr, htmlElem)}
        </div>
        `)
}

// Create HTML for boxes & buttons for clickable rovers
const Box = (state, rover) => 
{
    return (
        `
        <div class="box">
            <button class="button" onclick="updateStore(store, {roverClicked: '${rover}'})"><span>${rover}</span></button>
        </div>
        `)
}

// Create static rover data
const staticData = (state) => 
{
    const photos = Photos(state);
    const { name, landing_date, launch_date, status } = photos[0].rover;
    return (
        `
        <div>
            <h2><span style="color:#00ff00;">Rover name:</span> ${name}     <span style="color:#00ff00;">Mission status:</span> ${status}</h2>
            <h2><span style="color:#00ff00;">Launch date:</span> ${launch_date}     <span style="color:#00ff00;">Landing date:</span> ${landing_date}</h2>
            <h2><span style="color:#00ff00;">Photos taken:</span> ${photos[0].earth_date}</h2>
        </div>
        `)
}

// Creates HTML back button to reset back to main page
const BackButton = () => {
    return (
    `
        <button class="back" onclick="updateStore(store, {roverClicked: '', roverData: ''})">Back</button>
    `)
}

// Build photo album for the clicked on rover
const Photos = (state) =>
{
    let photos = state.roverData.data.photos;
    if(state.roverClicked == 'Curiosity')
    {photos = state.roverData.data.latest_photos;}
    return photos;
}

// Create HTML images
const Image = (state, url) =>
{
    return (
        `
        <img src="${url}"/>
        `)
}

const Rover = (state) => 
{
// Build home page specific image and header & the 3 rover boxes to be clicked
    if (!state.roverClicked) 
    {
        return (
        `
            <img src="assets/images/theyarehere.jpg" height="400px" width="100%" />
            <h2>Click a rover to see latest photos</h2>
            ${createDiv(state, fnMap, state.rovers, Box)}
        `)
    }

// Get Rover Data returned from NASA API calls
    if (!state.roverData) 
    {
        getRoverData(state)
        return ''
    }

    let photos = Photos(state);

 //Get photos URLs
    const photoUrl = photos.map(photo => photo.img_src);
// return new page with static info , back button & the rover photos
    return (
    `
        ${staticData(state)}
        ${BackButton()}
        ${createDiv(state, fnMap, photoUrl, Image)}
    `)
}

// ------------------------------------------------------  API CALLS
const getRoverData = (state) => 
{
    const { roverClicked } = state;
    fetch(`http://localhost:3000/${roverClicked}`)
        .then(res => res.json())
        .then((roverData) => 
        {
            updateStore(state, { roverData })
        })
}
