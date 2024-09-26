const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoText = inputPart.querySelector(".info-text"),
inputField = inputPart.querySelector("input");
locationBtn=inputPart.querySelector("button");
wIcon=document.querySelector(".weather-part img");
arrowBack=wrapper.querySelector("header i");
searchBtn = document.querySelector(".search-btn");

let api;
inputField.addEventListener("keyup", e =>{
   
   if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});



locationBtn.addEventListener("click", () =>{
     if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }else{
        alert("Your browser not support geolocation");
    }
});

function onSuccess(position){
    const {latitude,longitude}=position.coords;
    api=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=413a11f6495ac1e6711afe5cbf3ae140`;
    fetchData();
}
function onError(error){
    infoText.innerText=error.message;
    infoText.classList.add("error");
}

function requestApi(city){
     api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=413a11f6495ac1e6711afe5cbf3ae140`;
    fetchData();
}
function fetchData(){
 infoText.innerText="Getting weather details....";
    infoText.classList.add("pending");
    fetch(api).then(response =>response.json()).then(result=> weatherDetails(result));
}
function weatherDetails(info){
    infoText.classList.replace("pending", "error");
    if(info.cod == "404"){
       
        infoText.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const { feels_like, humidity,temp} = info.main;
        if(id == 800){
            wIcon.src = "icons/clear.png";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.png";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.png";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.png";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.png";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.png";
        }
         
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;
        infoText.classList.remove("pending", "error");
       
        inputPart.style.display = "none";
        wrapper.classList.add("active");
        console.log(info);
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
    
    inputPart.style.display = "block";
});

searchBtn.addEventListener("click", () => {
    wrapper.classList.remove("active");
    inputPart.style.display = "block"; // Show the input part again
    inputField.value = ""; // Clear the input field
    infoText.innerText = ""; // Clear any previous info text
});
  