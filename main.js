let userWrittenCode = document.getElementById("textarea");
let lang = document.getElementById("languages");
let output_container = document.querySelector(".output_container");
let compile_btn = document.querySelector(".compile_btn");

let resultChild = document.createElement("p");
let responseFromServer;

compile_btn.addEventListener("click",(event)=>{

    let dataToSend = { code : userWrittenCode.value, langId : lang.value};
    // console.log(dataToSend.code);
    // console.log(dataToSend.langId);

    let request = new XMLHttpRequest();

    request.open("POST","https://codequotient.com/api/executeCode",true);

    request.setRequestHeader("Content-Type","application/json");
    
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
    resultChild.innerText = "";
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