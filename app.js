
var Screens={
    startMenu:"startMenu",
    selectionMenu:"selectionMenu",
    game:"game",
    switch: function(targetScreen){
        document.getElementById(Screens.startMenu).classList.add('hide')
        document.getElementById(Screens.selectionMenu).classList.add('hide')
        document.getElementById(Screens.game).classList.add('hide')
        document.getElementById(targetScreen).classList.remove('hide')
    }
}

var db = {
    data:{},
    load: function(){
        console.log("DB")
        return fetch("http://localhost:5500/db.json")
        .then(function(res){
            console.log(res)
            return res.json()
        })
        .then(function(data){
            console.log(data)
            db.data = data;
        })
    }
}



function isCard(targetEl)
{

    if(targetEl.classList.contains('card') || targetEl.parentElement.parentElement.classList.contains('card') )
        return true;
    return false
}
function getCard(targetEl)
{
    return targetEl.classList.contains('card') ? targetEl : targetEl.parentElement.parentElement
}
window.onload = function( ){
    var Database = db.load()
    document.querySelector('#startMenu button').addEventListener('click',function(e){
        console.log("CLICK")
        e.preventDefault();
        Database.then(function(){
            selectionScreen.load()
        })
        Screens.switch(Screens.selectionMenu);
    })

    var selection_cont = document.querySelector('.cardsContainer');
    selection_cont.addEventListener('click',function(e){
        console.log("hello")
        e.preventDefault();
        var targetEl = e.target;
        if(isCard(targetEl))
        {
            /// getCard(targetEl)
        }
    })

    document.getElementById("nextButton").addEventListener('click',function(e){
        selectionScreen.next()
    })
    document.getElementById("previousButton").addEventListener('click',function(e){
        selectionScreen.previous()
    })

    document.getElementById("cards").addEventListener('mouseover',function(e){
        var targetEl = e.target;
        console.log(e.target)
        if(isCard(e.target))
        {
            console.log("Hit")
            var card = getCard(targetEl)
            document.querySelector('#description').innerText = db.data[card.dataset.name]["description"]
            document.querySelector('#selectionMenu h2').innerText = card.dataset.name
        }
    })

    document.getElementById("cards").addEventListener('mouseout',function(e){
        var targetEl = e.target;

        if(targetEl.classList.contains('card') || targetEl.parentElement.parentElement.classList.contains('card'))
        {
            document.querySelector('#description').innerText = ""
            document.querySelector('#selectionMenu h2').innerText = "choose word category"

        }
    })

    document.getElementById("cards").addEventListener('click',function(e){
        e.preventDefault()
    })
}