window.onload = populateRecent
const form = document.forms['search'];

function meansLike(search){
    if ((sessionStorage.getItem(search)!= null) && (sessionStorage.getItem(search)[0] == "M")){
        alert("no need to make API call")
        const div = document.getElementById("tofill")
        div.innerHTML = `<div class = "jumbotron"style="background-color: lightblue"> ${sessionStorage.getItem(search).slice(1)} </div>`
    }
    else{
    const request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () =>{
        if (request.readyState === 4 && request.status === 200){
            console.log(request);
            const data = JSON.parse(request.responseText);
            console.log(data);
            const div = document.getElementById("tofill")
            toDisplay = meansLikeTemplate(data)
            div.innerHTML = `<div class = "jumbotron"style="background-color: lightblue"> ${toDisplay} </div>`
            sessionStorage.setItem(search, ["M", toDisplay])
            populateRecent()
        };
        
    });
    request.open('GET', 'https://api.datamuse.com/words?ml='+ search);
    request.send();
}
};

function meansLikeTemplate(data) {
    let html = `<ol>`
    for (let i = 0; i < 10; i++) {
        html += `<li><strong><a href = "#top"> ${data[i]['word']}</a></strong></li>`
    }
    html += `</ol>`
    
    return html
    

}

function definition(search) {
    const div = document.getElementById("tofill")
    if ((sessionStorage.getItem(search)!=null) && (sessionStorage.getItem(search)[0] == "D")){
        alert("no need to call API")
        div.innerHTML = `<div class = "jumbotron" style="background-color: lightgreen"> ${sessionStorage.getItem(search).slice(1)} </div>`
    }
    else{
    const request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () => {
        if (request.readyState === 4 && request.status === 200){
            console.log(request)
            const data = JSON.parse(request.responseText);
            console.log(data);
            
            //alert(data)
            
            toDisplay = definitionTemplate(data)
            div.innerHTML = `<div class = "jumbotron" style="background-color: lightgreen"> ${toDisplay} </div>`
            sessionStorage.setItem(search, ["D", toDisplay])
            populateRecent()
            }
        else if(request.readyState === 4 && request.status === 404){
            div.innerHTML = `<div class = "jumbotron" style="background-color: red"><h1><strong>No definitions found</strong></h1></div>`
        }
    })
    request.open('GET', 'https://api.dictionaryapi.dev/api/v2/entries/en_US/'+search, true );
    request.send()
}
}

function definitionTemplate(data) {
    if ('title' in data){
        if (data['title'] === 'No Definitions Found'){
            return '<strong>No definitions found</strong>'
        }
    }
    let word = data[0]['word']
    let meanings = getKey(data[0], 'meanings', 'No meanings found')
    // let meanings = data[0]['meanings']
    let html = `<h1> ${word} <h1>`
    for (let i = 0; i < meanings.length; i++) {
        html += `<h3> type: ${meanings[i]['partOfSpeech']} </h3>`
        console.log(meanings[i]['definition'])

        for (let j = 0; j < meanings[i]['definitions'].length; j++) {
            html += `<h5><strong>definition:</strong> ${meanings[i]['definitions'][j]['definition']}</h6>`
            html += `<h6><strong>example</strong>: ${getKey(meanings[i]['definitions'][j], 'example', 'no Examples found</h5>')}</li>`
        }
    }
    return html
}

function getKey(dictionary, key, message) {
    if (key in dictionary){
        return dictionary[key]
    }
    else{
        return(message)
    }
}


function myfunc() {
    const form = document.forms['search'];
    var infotype = form['type'].value;
    if (infotype === 'mle'){
        var search = form['usersearch'].value.replaceAll(" ", "+");
        meansLike(search);
        form['type'].value = 'mle'
    }
    else if (infotype === 'definition'){
        var search = form['usersearch'].value.replaceAll(" ", "");
        definition(search);
    }


}


function populateRecent(){
    
    
    const recent = document.getElementById('recent')
    console.log(sessionStorage.key(0))
    

    
    // recent.innerHTML = `<div>Hello (Definition)</div> <button class="btn btn-primary" id="newbutton" onclick="definition('${sessionStorage.key(0)}')"></button>`
    // recent.innerHTML += `<div>Hello (Definition)</div> <button class="btn btn-primary" id="newbutton" onclick="definition('${sessionStorage.key(0)}')"></button>`
    recent.innerHTML = ``

    if (sessionStorage.length>0){
        const clearHistory = `<button class="btn btn-primary" id="newbutton" onclick="clearHistory(); populateRecent()" >Clear History</button>`
        recent.innerHTML+= clearHistory
    }

    for (let i = 0; i < sessionStorage.length; i++) {
        const element = sessionStorage.key(i);
        recent.innerHTML += createRecentElement(i)
        
    }

}

function createRecentElement(i){
    let recentElement
    key = sessionStorage.key(i)
    if (sessionStorage.getItem(key)[0] == "D"){
        recentElement = createRecentDefinition(key)
    }

    else if (sessionStorage.getItem(key)[0] == "M"){
        recentElement = createRecentMeansLike(key)
    }
    return recentElement
}

function createRecentMeansLike(key){
    let parsedKey = key.replaceAll("+", " ")
    let recentElement = `<div>${parsedKey} (Means like)</div> <button class="btn btn-primary" id="newbutton" onclick="meansLike('${key}')">&#8634;</button>`
    return recentElement
}

function createRecentDefinition(key){
    let recentElement = `<div>${key} (Definition)</div> <button class="btn btn-primary" id="newbutton" onclick="definition('${key}')">&#8634;</button>`
    return recentElement
}

function clearHistory(){
    sessionStorage.clear()
}
