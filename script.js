//making life easier

let randomRadioButton = getElByID('random-radio');
let categoriesRadioButton = getElByID('categories-radio');
let searchRadioButton = getElByID('search-radio');
let serchLineInput = getElByID('search-line');
let chosenRadioBtn;

function getElByID(element){
    return document.getElementById(element);
}

function createEl(element,styleClass){
    let newEl = document.createElement(element);
    if (styleClass){
        newEl.classList.add(styleClass);
    }
    return newEl;
}


//changing "radio" buttons when clicked 

function changeBtnVisibility(btnName){
    const btnArray = ['random','categories','search'];
    let newBtnArray = btnArray.filter(value => value != btnName);
    document.body.style.setProperty(`--visibility-btn-${btnName}-radio`, 'visible');
    //uncheck radio btns that have not been clicked
    for(let btn of newBtnArray){
        document.body.style.setProperty(`--visibility-btn-${btn}-radio`, 'hidden');
    }
    //hide categories  if categories radio btn is not checked
    if (getComputedStyle(document.body).getPropertyValue('--visibility-btn-categories-radio') == 'hidden'){
        getElByID('categories').style.display = 'none';
    }
    //hide search line if search is not checked
    if (getComputedStyle(document.body).getPropertyValue('--visibility-btn-search-radio') == 'hidden'){
        serchLineInput.style.display = 'none';
    }
}

randomRadioButton.addEventListener('click',()=>{
    chosenRadioBtn='random';
    randomRadioButton.classList.add('checked-radio-btn');
    changeBtnVisibility('random');
});

categoriesRadioButton.addEventListener('click', ()=>{
    getElByID('categories').style.display = 'block';
    chosenRadioBtn = 'categories';
    categoriesRadioButton.classList.add('checked-radio-btn');
    changeBtnVisibility('categories');
});

searchRadioButton.addEventListener('click', ()=>{
    serchLineInput.style.display = 'block';
    chosenRadioBtn = 'search';
    searchRadioButton.classList.add('checked-radio-btn');
    changeBtnVisibility('search');
});


//choose category 
let chosenCategory;

let animalCategoryBtn = getElByID('animal-btn');
animalCategoryBtn.addEventListener('click', () => {
    chosenCategory = animalCategoryBtn.value;
    animalCategoryBtn.classList.add('chosen-category');
});

let careerCategoryBtn = getElByID('career-btn');
careerCategoryBtn.addEventListener('click', () => {
    chosenCategory = careerCategoryBtn.value;
    careerCategoryBtn.classList.add('chosen-category');
});

let devCategoryBtn = getElByID('dev-btn');
devCategoryBtn.addEventListener('click', () => {
    chosenCategory = devCategoryBtn.value;
    devCategoryBtn.classList.add('chosen-category');
});

let celebrityCategoryBtn = getElByID('celebrity-btn');
celebrityCategoryBtn.addEventListener('click', () => {
    chosenCategory = celebrityCategoryBtn.value;
    celebrityCategoryBtn.classList.add('chosen-category');
});



// buttons show and hide favourite  for tablet&smartphone

document.getElementsByClassName('show-fav')[0].addEventListener('click',()=>{
    getElByID('fav-div').style.display = 'block';
    document.getElementsByClassName('main-div-wrap')[0].style.position = 'absolute';
    document.getElementsByClassName('main-div-wrap')[0].style.display = 'block';
});
document.getElementsByClassName('hide-fav')[0].addEventListener('click',()=>{
    getElByID('fav-div').style.display = 'none';
    document.getElementsByClassName('main-div-wrap')[0].style.position = '';
    document.getElementsByClassName('main-div-wrap')[0].style.display = 'none';

});


//main fnc create joke response

getElByID('main-btn').addEventListener('click', mainFunction);

async function mainFunction(){
   if (chosenRadioBtn == 'random'){
        await getRequest('https://api.chucknorris.io/jokes/random', 'joke-response');
   } else if (chosenRadioBtn == 'categories'){
        await getRequest(`https://api.chucknorris.io/jokes/random?category=${chosenCategory}`, 'joke-response');
   } else if (chosenRadioBtn == 'search'){
        await getRequest(`https://api.chucknorris.io/jokes/search?query=${serchLineInput.value}`, 'joke-response');
   }
   like();
}


//request and parse data, create joke div

async function getRequest(requestURL,divToAppend){
    await fetch(requestURL)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data['result']){
                for(let i=0; i<data['result'].length; i++){
                    createResponse(data['result'][i], divToAppend);
                }
            } else {
                createResponse(data, divToAppend);
            }
        })
}


//keep favorite jokes after page reloading

function displayCookie(){
    if(document.cookie){
        for (let ID of document.cookie.split('; ')){
            let newID =  ID.split('=')[0].slice(2); // slice(2) because added "ID" to cookieID in 137
            createFavoriteJoke(newID);
        }
    }
}

displayCookie();


//create cookies of liked jokes and show them in favourite section

function like(){
    let heartBtnArray = document.getElementsByClassName('unclicked');

    for(let i=0; i<heartBtnArray.length; i++){
        heartBtnArray[i].addEventListener('click', () => {
            heartBtnArray[i].childNodes[0].src = '/liked-heart-btn.svg';
            createCookie(heartBtnArray[i]); 
            createFavoriteJoke(heartBtnArray[i].id);
        })
    }
}

function createCookie(cookieID){
    let date = new Date();
    date.setDate(date.getDate() + 200)
    document.cookie = 'ID'+ cookieID.id +'=' + '; expires=' + date.toUTCString() + '; path=/';
            
}

function deleteCookie(cookieName){
    document.cookie = 'ID' + cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function createFavoriteJoke(jokeID){
    let likedJokeLink = `https://api.chucknorris.io/jokes/${jokeID}`;
    getRequest(likedJokeLink, 'fav-div');
}

// do all the dirty job e.g. form joke div & everythng inside it

function createResponse(obj, divToAppend){
    
    let responseDiv = createEl('div','joke');
    if (divToAppend == 'fav-div'){responseDiv.classList.add('favorite');}

    let likeBtnDiv = createEl('div','heart-btn-div');
    let likeBtn = createEl('button','heart-btn');
    likeBtnDiv.appendChild(likeBtn);
    let heartImg = createEl('img');
    likeBtn.appendChild(heartImg);
    likeBtn.id = obj['id'];
    if (divToAppend == 'fav-div'){
        heartImg.src = '/liked-heart-btn.svg';

        likeBtn.addEventListener('click', ()=>{
            deleteCookie(likeBtn.id);
            responseDiv.style.display = 'none';
            heartImg.src = '/heart-btn.svg';
        })
    } else {
        heartImg.src = '/heart-btn.svg';
        likeBtn.classList.add('unclicked');

        if(document.cookie.includes(likeBtn.id)){

            heartImg.src = '/liked-heart-btn.svg';
            likeBtn.classList.remove('unclicked');
        }
    }
    responseDiv.appendChild(likeBtnDiv);

    let messageIconBtn = createEl('button','message-icon-btn');
    let messageIcon = createEl('img');
    messageIconBtn.appendChild(messageIcon);
    messageIcon.src = '/message-icon.svg';
    responseDiv.appendChild(messageIconBtn);

    let jokeBody = createEl('div','joke-body');

    let responseID = createEl('p','response-id');
    responseID.innerHTML = 'ID:';
    let responseIDlink = createEl('a');
    responseIDlink.href = obj['url'];
    responseIDlink.innerHTML = obj['id'];
    let linkImg = createEl('img','link-img');
    linkImg.src = '/link.svg';
    let linkImgArrow = createEl('img','link-img-arrow');
    linkImgArrow.src = '/linkArrow.svg';
    responseID.appendChild(responseIDlink);
    responseID.appendChild(linkImg);
    responseID.appendChild(linkImgArrow);
    jokeBody.appendChild(responseID);

    let jokeP = createEl('p', 'joke-txt');
    jokeP.innerHTML = obj['value'];
    jokeBody.appendChild(jokeP);

    let jokeLowDiv = createEl('div','joke-low-div');
    jokeBody.appendChild(jokeLowDiv);

    let lastUpdate = createEl('div','last-upd');
    let lastUpdHours = (1/3600000) * (Date.now() - Date.parse(obj['updated_at']));
    lastUpdate.innerHTML = `Last update ${Math.floor(lastUpdHours)} hours ago`;
    jokeLowDiv.appendChild(lastUpdate);

    if (obj['categories'][0]){
        let categoryDiv = createEl('div','div-category');
        categoryDiv.innerHTML = obj['categories'][0];
        jokeLowDiv.appendChild(categoryDiv);
    }

    responseDiv.appendChild(jokeBody);
    getElByID(divToAppend).appendChild(responseDiv);
}
