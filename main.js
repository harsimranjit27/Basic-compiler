let userWrittenCode = document.querySelector("#textarea");
let languages = document.querySelector(".languages");
let output_container = document.querySelector(".output_container");
let compile_btn = document.querySelector(".compile_btn");

let resultChild = document.createElement("p");

let languageObj = [
    {name : "Python",langID : 0},
    {name : "Javascript", langID : 4},
    {name : "C", langID : 7},
    {name : "CPP", langID : 77},
    {name : "Java", langID : 8}
];

let languageSel;
let langId;
let dataToSend = { "code" : null, langId : null};
let responseFromServer;

languages.addEventListener("click",(event)=>{
    
    languageSel = event.target.value;

    languageObj.forEach((element)=>{
        if (element.name === languageSel) {
            langId = element.langID;
        }
    });
    console.log(languageSel);
    console.log(langId);
});

// if(languageSel === undefined){
//     langID = 0;
// }

compile_btn.addEventListener("click",(event)=>{

    resultChild.innerText = "";

    let request = new XMLHttpRequest();

    request.open("POST","https://codequotient.com/api/executeCode",true);

    request.setRequestHeader("Content-Type","application/json");

    dataToSend.code = userWrittenCode.value;
    dataToSend.langId = langId;
    console.log(dataToSend);
    
    request.send(JSON.stringify(dataToSend));

    request.addEventListener("load",(event)=>{
        responseFromServer = JSON.parse(event.target.responseText);
        // console.log(responseFromServer);
        if(responseFromServer.errors){
            resultChild.innerText = responseFromServer.errors;
            outer_container.appendChild(resultChild);
        }
        else{
            setTimeout(()=>{
                fetchResult();
            },5000);
        }
    });
});

function fetchResult() {
    
    let result = new XMLHttpRequest();
    console.log(responseFromServer);
    result.open("GET",`https://codequotient.com/api/codeResult/${responseFromServer.codeId}`);

    result.setRequestHeader("Content-Type","application/json");

    result.send();

    result.addEventListener("load",(event)=>{
        let resultFromServer = JSON.parse(event.target.responseText);

        // console.log(JSON.parse(resultFromServer.data).output);
        let resultObj = JSON.parse(resultFromServer.data);
        console.log(resultObj);
        console.log(resultObj.output);
        // console.log(typeof resultObj.errors);
        
        if (resultObj.output) {
            resultChild.innerText = resultObj.output;
            output_container.appendChild(resultChild);
        }
        else{
            resultChild.innerText = resultObj.errors;
            output_container.appendChild(resultChild);
        }
    });
}