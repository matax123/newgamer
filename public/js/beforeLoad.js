const backendUrl = 'https://backend.newgamer.cl:5000';

let dayTime = localStorage.getItem('dayTime');
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if(dayTime == null && isDarkMode) dayTime = 'night';
else if(dayTime == null) dayTime = 'day';
if (dayTime != null && dayTime == 'night') {
    document.documentElement.setAttribute('theme', 'dark');
}
else{
    document.documentElement.setAttribute('theme', 'light');
}