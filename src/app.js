//OpenWeather info
const apiKey = process.env.APP_KEY;
const url = 'https://api.openweathermap.org/data/2.5/weather';

//declare user position and user value request
let lat;
let lon;
let inputValue;

//Page Element
const mainTemp = document.getElementById('main-temp');
const mainIcon = document.getElementById('main-icon');
const mainCity = document.getElementById('city-name');
const suggestionsToday = document.getElementById('suggestions-today');
const formCity = document.getElementById('form-city');
const menuButton = document.getElementById('menu-button');
const inputText = document.getElementById('city-input');
const logo = document.getElementById('logo');
const infoButton = document.getElementById('more-info');
const popupBg = document.getElementById('popup-bg');
const popup = document.getElementById('popup');
const popupMainIcon = document.getElementById('main-popup-icon');
const popupMaxTemp = document.getElementById('max-temp-text');
const popupMinTemp = document.getElementById('min-temp-text');
const popupHumidity = document.getElementById('humidity-text');
const popupWind = document.getElementById('wind-text');
const popupCity = document.getElementById('popup-city')

//object containg icons
let icons = {
    sunny: 'Assets/sunny-icon.svg',
    cloudy: 'Assets/cloud-icon.svg',
    rainy: 'Assets/Rain icon.svg',
    thunderstorm: 'Assets/thunderstorm-icon.svg',
    snow: 'Assets/snow-icon.svg',
    mist: 'Assets/mist-icon.svg',
    moon: 'Assets/moon-icon.svg'
}

//empty object to store sentences once location name is available from api
let sentences =  {}

//empty object to store weather data once available from api
let weather = {};

//get human time from unix timestamp
const getDate = (timeStamp) => {
    let hours = new Date(timeStamp).getHours();
    let minutes = new Date(timeStamp).getMinutes();
    hours = (hours<10) ? '0' + hours : hours;
    minutes = (minutes<10) ? '0' + minutes : minutes;
    return `${hours}:${minutes}`
}

//get user location and control if browser has geolocation services
if ('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(position => {
        lon = position.coords.longitude;
        lat = position.coords.latitude;
        getWeather(lat, lon)
    }, () => {
        suggestionsToday.innerHTML = 'Hey, we have no idea about your position 😅<br> If you still love us, select your city manually'
    })
} else{
    getWeather(59,10);
}

//get data based on input or lon and lat
const getWeather = (lat, lon) => {
    let urlToFetch
    if(inputValue === undefined){
        urlToFetch = `${url}?lat=${lat}&lon=${lon}&APPID=${apiKey}`;
    } else{
        urlToFetch = `${url}?q=${inputValue}&APPID=${apiKey}`
    }
    
    fetch(urlToFetch)
    .then(response => {
        let data = response.json()
        return data
    })
    .then(data => {
        weather.temperature = Math.floor(data.main.temp - 273);
        weather.description = data.weather[0].main;
        weather.location = data.name;
        weather.maxTempToday = Math.floor(data.main.temp_max - 273);
        weather.minTempToday = Math.floor(data.main.temp_min -273);
        weather.windSpeed = data.wind.speed;
        weather.humidity = data.main.humidity;
        weather.time = getDate(data.dt * 1000);
        weather.sunrise = getDate(data.sys.sunrise * 1000);
        weather.sunset = getDate(data.sys.sunset * 1000);
    }).then(() => {
        sentences.sunny = [`Today the sky is clear in ${weather.location}! <br>You can leave the 🌂 at home.`, `Today the sky is clear in ${weather.location}!<br>Enjoy your day 🙌🏻`];
        sentences.clouds = [`Today is cloudy in ${weather.location}...<br>Take the ☂️, or do not take the 🌂, that is the question...`, `Today is cloudy in ${weather.location}...<br>Leave the 🕶 at home`];
        sentences.rainy = [`Today is rainy in ${weather.location}<br>Take your 🌂 and get things done!`, `Today is rainy in ${weather.location}<br>It's a rainy day 🎶`];
        sentences.thunderstorm = [`Today there is a thunderstorm in ${weather.location}<br>If you go out you will get back wet...`, `Today there is a thunderstorm in ${weather.location}<br>Bring inside your clotheshorse 👕`];
        sentences.snow = [`Today is snowing in ${weather.location}<br>Wear your 🧤 and make a ☃️`, `Today is snowing in ${weather.location}<br>Turn on Netflix and make a cup of tea ☕️`];
        sentences.mist = [`Today is foggy in ${weather.location}<br>Don't lose yourself...`]
        displayWeather()
    })
};

//Render the weather data
const changeAspect = () => {
    if (weather.description === 'Clear'){
        clearAspect()
    } else if (weather.description === 'Clouds') {
        cloudAspect()
    } else if (weather.description === 'Rain') {
        rainAspect()
    } else if (weather.description === 'Thunderstorm') {
        thunderstormAspect()
    } else if (weather.description === 'Snow') {
        snowAspect()
    } else if (weather.description === 'Mist' || weather.description === 'Drizzle') {
        mistAspect()
    } else {
        suggestionsToday.innerHTML = `We don't know the condition in ${weather.location}.<br> Send us an email at simple@weather.com`
    }
}

const displayWeather = () => {
    mainTemp.innerHTML = `${weather.temperature}&deg`;
    mainTemp.style.color = 'white'
    suggestionsToday.style.color = 'white'
    infoButton.style.display = 'initial';
    popupCity.innerHTML = weather.location
    popupMaxTemp.innerHTML = `${weather.maxTempToday}&deg`;
    popupMinTemp.innerHTML = `${weather.minTempToday}&deg`;
    popupWind.innerHTML = `${weather.windSpeed} Km/h`;
    popupHumidity.innerHTML = `${weather.humidity}%`;
    changeAspect()
}

//display input field
menuButton.addEventListener('click', () => {
    menuButton.style.display = 'none'
    formCity.style.display = 'flex'
})

formCity.addEventListener('submit', (event) => {
    event.preventDefault();
    inputValue = inputText.value;
    getWeather()
    menuButton.style.display = 'block';
    formCity.style.display = 'none';
})

document.addEventListener('click', (e) => {
    if (e.target.id !== 'city-input' && e.target.id !== 'menu-button') {
        formCity.style.display = 'none';
        menuButton.style.display = 'block';
    }
})

//Page aspects based on weather
const clearAspect = () => {
    if (weather.time > weather.sunrise && weather.time < weather.sunset) {
        mainIcon.src = icons.sunny;
        document.body.style.backgroundColor = '#83E3EB';
        document.body.style.backgroundImage = `url('Assets/BG top left.svg')`;
        logo.src = 'Assets/Logo.svg';
        popupMainIcon.src = icons.sunny;
        popup.style.backgroundColor = 'rgb(255, 255, 255)';
        infoButton.onmouseover = () => {
            infoButton.style.color = '#83E3EB'
        }
        infoButton.onmouseleave = () => {
            infoButton.style.color = 'white'
        }
    } else {
        mainIcon.src = icons.moon;
        document.body.style.backgroundColor = '#003478';
        document.body.style.backgroundImage = `url('Assets/BG top left.svg')`;
        logo.src = 'Assets/Logo.svg';
        popupMainIcon.src = icons.moon;
        popup.style.backgroundColor = 'rgb(204, 204, 204)';
        infoButton.onmouseover = () => {
            infoButton.style.color = '#003478'
        }
        infoButton.onmouseleave = () => {
            infoButton.style.color = 'white'
        }
    }

    suggestionsToday.innerHTML = sentences.sunny[Math.floor(Math.random()*2)];
    
}

const cloudAspect = () =>{
    suggestionsToday.innerHTML = sentences.clouds[Math.floor(Math.random()*2)];
    mainIcon.src = icons.cloudy;
    document.body.style.backgroundColor = '#C1BEBA';
    document.body.style.backgroundImage = `url('Assets/BG top left - cloud-snow.svg')`;
    logo.src = 'Assets/Logo snow-cloud.svg';
    popupMainIcon.src = icons.cloudy;
    popup.style.backgroundColor = 'rgb(204, 204, 204)';
    infoButton.onmouseover = () => {
        infoButton.style.color = '#C1BEBA';
    }
    infoButton.onmouseleave = () => {
        infoButton.style.color = 'white'
    }
}
const rainAspect = () => {
    suggestionsToday.innerHTML = sentences.rainy[Math.floor(Math.random()*2)];;
    mainIcon.src = icons.rainy;
    document.body.style.backgroundColor = '#696969';
    document.body.style.backgroundImage = `url('Assets/BG top left - rain.svg')`;
    logo.src = 'Assets/Logo.svg';
    popupMainIcon.src = icons.rainy;
    popup.style.backgroundColor = 'rgb(255, 255, 255)';
    infoButton.onmouseover = () => {
        infoButton.style.color = '#696969'
    }
    infoButton.onmouseleave = () => {
        infoButton.style.color = 'white'
    }
}

const thunderstormAspect = () => {
    suggestionsToday.innerHTML = sentences.thunderstorm[Math.floor(Math.random()*2)];
    mainIcon.src = icons.thunderstorm;
    document.body.style.backgroundColor = '#484745'
    document.body.style.backgroundImage = `url('Assets/BG top left - thunderstorm.svg')`;
    logo.src = 'Assets/Logo.svg';
    popupMainIcon.src = icons.thunderstorm;
    popup.style.backgroundColor = 'rgb(255, 255, 255)';
    infoButton.onmouseover = () => {
        infoButton.style.color = '#696969'
    }
    infoButton.onmouseleave = () => {
        infoButton.style.color = 'white'
    }
}

const snowAspect = () => {
    suggestionsToday.innerHTML = sentences.snow[Math.floor(Math.random()*2)];
    mainIcon.src = icons.snow;
    document.body.style.backgroundColor = '#C1BEBA';
    document.body.style.backgroundImage = `url('Assets/BG top left - cloud-snow.svg')`;
    logo.src = 'Assets/Logo snow-cloud.svg';
    popupMainIcon.src = icons.snow;
    popup.style.backgroundColor = 'rgb(204, 204, 204)';
    infoButton.onmouseover = () => {
        infoButton.style.color = '#C1BEBA'
    }
    infoButton.onmouseleave = () => {
        infoButton.style.color = 'white'
    }
}

const mistAspect = () => {
    suggestionsToday.innerHTML = sentences.mist[0];
    mainIcon.src = icons.mist;
    document.body.style.backgroundColor = '#C1BEBA';
    document.body.style.backgroundImage = `url('Assets/BG top left - cloud-snow.svg')`;
    logo.src = 'Assets/Logo snow-cloud.svg';
    popupMainIcon.src = icons.mist;
    popup.style.backgroundColor = 'rgb(204, 204, 204)';
    infoButton.onmouseover = () => {
        infoButton.style.color = '#C1BEBA'
    }
    infoButton.onmouseleave = () => {
        infoButton.style.color = 'white'
    }
}


//popup event handler
infoButton.addEventListener('click', () => {
    popupBg.style.display = 'block';
    popup.style.display = 'block';
    infoButton.style.display = 'none';
    suggestionsToday.style.display = 'none';
})

popupBg.addEventListener('click', () => {
    popupBg.style.display = 'none';
    popup.style.display = 'none';
    infoButton.style.display = 'initial';
    suggestionsToday.style.display = 'block';
})