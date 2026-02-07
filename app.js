
var Screens={
    startMenu:"startMenu",
    selectionMenu:"selectionMenu",
    game:"game",
    switch: function(targetScreen){
        document.getElementById(Screens.startMenu).classList.add('hide')
        document.getElementById(Screens.selectionMenu).classList.add('hide')
        document.getElementById(Screens.game).classList.add('hide')
        document.getElementById(targetScreen).classList.remove('hide')
        if(targetScreen===Screens.startMenu)
            document.getElementById("backButton").classList.add('hide');
        else
            document.getElementById("backButton").classList.remove('hide');
    }
}

var letterStates = {
    unpicked:"unpicked",
    correct:"correct",
    wrong:"wrong",
}

var db = {
    data:{},
    load: function(){
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

var selectionScreen = {
    categories:[],
    cat_obj:{},
    per_page:3,
    page:1,
    load: function(){
        this.page = 1;
        this.categories = [];
        this.cat_obj={};
        console.log(db.data)
        for(var category in db.data)
        {
            this.categories.push(category);
            this.cat_obj[category] = {
                "description":db.data[category].description,
                "image" : db.data[category].image
            }
        }
        this.render()

    },
    next: function(){
        if(this.page*this.per_page<this.categories.length)   
            this.page = this.page+1;     
        this.render()
    },
    previous: function(){
        if(this.page>1)
            this.page = this.page-1;
        this.render()
    },
    render(){
        var cards = document.getElementById("cards");
        var cardsList = ""
        var total = this.categories.length;
        var base = (this.page-1)*this.per_page + 1;
        var end = Math.min(base+this.per_page-1,total);
        for(var i=base;i<=end;i++)
        {
            var category_name = this.categories[i-1];
            console.log(category_name)
            cardsList += `
            <div class="card" data-name="${category_name}">
                <div class="imgcontainer">
                    <img src="./assets/${this.cat_obj[category_name].image}" class="imgStyle" alt="${category_name}"/>
                </div>
            </div>
        `
        }
        if(cardsList)
            cards.innerHTML = cardsList;

        var next = document.getElementById("nextButton");
        var prev = document.getElementById("previousButton");

        if(base===1)
        {
            prev.disabled=true;
            prev.classList.add("hidden")

        }
        else
        {
            prev.disabled=false;
            prev.classList.remove("hidden")

        }
        if(end===total)
        {
            next.disabled = true;
            next.classList.add("hidden")
        }
        else
        {
            next.disabled = false;
            next.classList.remove("hidden")

        }

    }
}

var hangingMan = {
    state:0,

    draw: function()
    {
        document.querySelectorAll(".manPart")[this.state].classList.remove('hide')
        this.state++;
    },
    reset: function(){
        this.state=0;
        document.querySelectorAll(".manPart").forEach(function(el){
            el.classList.add('hide');
        })
    }
}

var game = {
    category:"",
    unsolved:[],
    word:"",
    letterOptions:{},
    letterBoxes:[],
    score:0,
    mistakes:0,


    
    load: function(category){
        this.category = category;
        this.unsolved = structuredClone(db.data[category].words)
        ///
        this.word = "";
        this.score = 0;
        hangingMan.reset();
        this.roundRender()
    },
    roundRender: function()
    {
        this.letterOptions = {};
        this.letterBoxes = [];
        this.mistakes=0;
        hangingMan.reset();


        var rand = Math.floor(Math.random()*this.unsolved.length)

        this.word = this.unsolved[rand];
        this.unsolved.splice(rand,1);
        for(var i=65;i<=90;i++)
            this.letterOptions[String.fromCharCode(i)]="unpicked";
        for(var i=0;i<this.word.length;i++)
            this.letterBoxes.push(``)

                                

        document.querySelector("#game .header h2").innerText = this.category;
        document.querySelector("#score").innerText = this.score;
        var letterBoxes_html = [];
        this.letterBoxes.forEach(function(el){
            letterBoxes_html.push(
            `<span class="letterBox" data-value="${el}">${el}</span>`
                                );
        })
        var letterOptions_html = [];
        for(var i=65;i<=90;i++)
        {
            var temp = this.letterOptions[String.fromCharCode(i)]
            if(temp===letterStates.unpicked)
            {
                letterOptions_html.push(
                    `<button class="letterButton" data-value="${String.fromCharCode(i)}">${String.fromCharCode(i)}</button>`
                )
            }
            // else if(temp===letterStates.correct)
            // {
            //     letterOptions_html.push(
            //         `<button class="letterButton correctPick" data-value="${String.fromCharCode(i)}>${String.fromCharCode(i)}</button>`
            //     )
            // }
            // else
            // {
            //     letterOptions_html.push(
            //         `<button class="letterButton wrongPick" data-value="${String.fromCharCode(i)}>${String.fromCharCode(i)}</button>`
            //     )
            // }

        }

        document.querySelector('.letterBoxContainer').innerHTML=letterBoxes_html.join("")
        document.querySelector('#lettersContainer').innerHTML=letterOptions_html.join("")

    },
    controller: function(pressedButton)
    {
        if(this.letterOptions[pressedButton.dataset.value] !== letterStates.unpicked)
            return;
        if(this.word.toLowerCase().includes(pressedButton.dataset.value.toLowerCase()))
            this.correctGuess(pressedButton);
        else
            this.wrongGuess(pressedButton);
    },

    correctGuess: function(pressedButton){
        this.letterOptions[pressedButton.dataset.value] = letterStates.correct;
        pressedButton.disabled=true;
        pressedButton.classList.add('correctPick');
        this.score+=5;

        var done=0;
        for(var i=0;i<this.word.length;i++)
        {
            if(this.word[i].toLowerCase() === pressedButton.dataset.value.toLowerCase())
                this.letterBoxes[i] = pressedButton.dataset.value;
            if(this.letterBoxes[i])
                done++;
        }

        var letterBoxes_html = [];
        this.letterBoxes.forEach(function(el){
            letterBoxes_html.push(
            `<span class="letterBox" data-value="${el}">${el}</span>`
                                );
        })
        document.querySelector('.letterBoxContainer').innerHTML=letterBoxes_html.join("")
        document.getElementById("score").innerText = this.score;

        if(done===this.word.length)
        {
            console.log("done");
            console.log(this.word.length);
            console.log("win");
            this.verdict("win");
        }

    },
    wrongGuess: function(pressedButton){
        this.mistakes++;
        hangingMan.draw();
        this.letterOptions[pressedButton.dataset.value] = letterStates.correct;
        pressedButton.disabled=true;
        pressedButton.classList.add('wrongPick');
        if(this.mistakes===6)
        {
            console.log("lose")
            this.verdict("loose");
        }
        this.score-=1;
        document.getElementById("score").innerText = this.score;

    },

    verdict: function(verd)
    {
        if(verd ==="win")
            document.querySelector("dialog img").src="assets/check.png"
        else
            document.querySelector("dialog img").src="assets/wrong.png"

        document.querySelector("dialog p").innerText=this.word;
        document.querySelector("dialog").showModal()
        setTimeout(function(){
            document.querySelector("dialog").close()
            // console.log(this);
            game.roundRender()
        },4000)
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
    var dialog = document.querySelector("dialog")

    document.querySelector('#startMenu button').addEventListener('click',function(e){
        console.log("CLICK")
        e.preventDefault();
        Database.then(function(){
            selectionScreen.load()
        })
        Screens.switch(Screens.selectionMenu);
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
        var targetEl = e.target;
        if(isCard(targetEl))
        {
            game.load( getCard(targetEl).dataset.name);
            Screens.switch(Screens.game);
        }
    })

    document.getElementById("lettersContainer").addEventListener('click',function(e){
        e.preventDefault();
        var targetEl = e.target;
        if(targetEl.tagName === "BUTTON")
            game.controller(targetEl);
        console.log(targetEl)
    })

    // document.getElementById("closingBtn").addEventListener('click',function(e){
    //     e.preventDefault()
    //     dialog.close();
    // })

    document.getElementById("backButton").addEventListener('click',function(e){
        Screens.switch(Screens.startMenu);
    })
}