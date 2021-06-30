
const form = document.forms['search'];

function meansLike(search){
    const request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () =>{
        if (request.readyState === 4 && request.status === 200){
            console.log(request);
            const data = JSON.parse(request.responseText);
            console.log(data);
            const div = document.getElementById("tofill")
            toDisplay = meansLikeTemplate(data)
            div.innerHTML = `<div class = "jumbotron"style="background-color: lightblue"> ${toDisplay} </div>`

        };
        
    });
    request.open('GET', 'https://api.datamuse.com/words?ml='+ search);
    request.send();
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
    const request = new XMLHttpRequest();
    request.addEventListener('readystatechange', () => {
        if (request.readyState === 4 && request.status === 200){
            console.log(request)
            const data = JSON.parse(request.responseText);
            console.log(data);
            
            //alert(data)
            
            toDisplay = definitionTemplate(data)
            div.innerHTML = `<div class = "jumbotron" style="background-color: lightgreen"> ${toDisplay} </div?`
            }
        else if(request.readyState === 4 && request.status === 404){
            div.innerHTML = `<div class = "jumbotron" style="background-color: red"><h1><strong>No definitions found</strong></h1></div>`
        }
    })
    request.open('GET', 'https://api.dictionaryapi.dev/api/v2/entries/en_US/'+search, true );
    request.send()
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
        //alert("mle")
        var search = form['usersearch'].value.replaceAll(" ", "+");
        console.log(search)
        //alert(search)
        meansLike(search);
        form['type'].value = 'mle'
    }
    else if (infotype === 'definition'){
        //alert("definition");
        var search = form['usersearch'].value.replaceAll(" ", "");
        definition(search);
    }


}
