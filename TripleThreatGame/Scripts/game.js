window.turncount = 0;
window.score = 0;
window.fullSlots = new Array();
window.slotArray = new Array();
window.slotTest = 0
setupGame = function () {
    hideNav()

    ///THIS IS THE ARRAY FOR THE SLOTS...
    
    window.slotArray.push([1, [2, 6]]);
    window.slotArray.push([2, [1, 7, 3]]);
    window.slotArray.push([3, [2, 8, 4]]);
    window.slotArray.push([4, [3, 9, 5]]);
    window.slotArray.push([5, [4, 10]]);
    window.slotArray.push([6, [1, 7, 11]]);
    window.slotArray.push([7, [6, 2, 8, 12]]);
    window.slotArray.push([8, [3, 7, 13, 9]]);
    window.slotArray.push([9, [4, 8, 14, 10]]);
    window.slotArray.push([10, [5, 9, 15]]);
    window.slotArray.push([11, [6, 12, 16]]);
    window.slotArray.push([12, [7, 11, 17, 13]]);
    window.slotArray.push([13, [8, 12, 18, 14]]);
    window.slotArray.push([14, [9, 13, 19, 15]]);
    window.slotArray.push([15, [10, 14, 20]]);
    window.slotArray.push([16, [11, 17, 21]]);
    window.slotArray.push([17, [12, 16, 22, 18]]);
    window.slotArray.push([18, [13, 17, 23, 19]]);
    window.slotArray.push([19, [14, 18, 24, 20]]);
    window.slotArray.push([20, [15, 19, 25]]);
    window.slotArray.push([21, [16, 22]]);
    window.slotArray.push([22, [21, 17, 23]]);
    window.slotArray.push([23, [22, 18, 24]]);
    window.slotArray.push([24, [23, 19, 25]]);
    window.slotArray.push([25, [24, 20]]);


    computerPlayedCardsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    window.myvar = computerPlayedCardsList.sort(function () {
        return Math.round(Math.random()) - 0.5;
    });



    $(".board ul li").droppable({
        activeClass: "",
        hoverClass: "slot-hover",
        drop: function (event, ui) {


            sound.Pop.play();
            $(this).droppable("destroy").css({ opacity: '.8' });;
            $(this).html('<div class="card-player">' + $(ui.draggable).draggable("widget").text() + '</div>');
            $(ui.draggable).parent('li').remove();
            $(ui.draggable).draggable("widget").remove();
            window.turncount++;
            checkTurnCount();
            checkSlots($(this).attr('id'), 'card-player');

            //console.log(parseInt($(this).attr("id")));
            computerTurn(parseInt($(this).attr("id")));


        }
    });

    $('.card').draggable({
        cursor: "pointer",
        revert: "invalid",
        snapMode: "inner",
        snap: ".board ul li",
        snapTolerance: 10,
        //start: function () { $(this).stop(true, true).animate({ height: '+=0', width: '+=0' }) },
        drag: function () { },
        stop: function (event, ui) { },
        revertDuration: 100,
        reverting: function () {


            sound.Pong.play();
           // $(this).stop(true, true).animate({ height: '-=0', width: '-=0' }, 100);
        }
    });

    $.ui.draggable.prototype._mouseStop = function (event) {
        //If we are using droppables, inform the manager about the drop
        var dropped = false;
        if ($.ui.ddmanager && !this.options.dropBehaviour)
            dropped = $.ui.ddmanager.drop(this, event);

        //if a drop comes from outside (a sortable)
        if (this.dropped) {
            dropped = this.dropped;
            this.dropped = false;
        }

        if ((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
            var self = this;
            self._trigger("reverting", event);
            $(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
                event.reverted = true;
                self._trigger("stop", event);
                self._clear();
            });
        } else {
            this._trigger("stop", event);
            this._clear();
        }

        return false;
    }

    
}


function generateRandomNumber(min, max, type) {

    var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    if (type == 'card') {

        return window.myvar[0];

    } else {

        return randomNumber

    }

}


var intervalCount = 0;
var dointerval = '';
var theNumber = 1;
function setRandomCard() {
    
   // console.log('it ran!');
    if (intervalCount <= 25) {        

        theNumber = parseInt(Math.floor(Math.random() * (13 - 1 + 1)) + 1);
        if (theNumber=='') {

            $('#lastCard').css({ background: 'black' }).html(6);

        } else {

            $('#lastCard').css({ background: 'black' }).html(theNumber);
        }
        intervalCount++;

    } else {

        clearInterval(doInterval);
        if (theNumber % 2 == 0) {
            $('#lastCard').removeClass().removeAttr('style').addClass('card-player');
            var classTopPass = 'card-player';
        } else {
            $('#lastCard').removeClass().removeAttr('style').addClass('card-computer');
            var classTopPass = 'card-computer';
        }
        checkSlots($('#lastCard').parent('li').attr('id'), classTopPass);
        setTimeout(function () { gameOver(); }, 1000);
        return false;
    }
}


function checkTurnCount() {


    if (window.turncount == 24) {
       
        //find the last empty slot
        $('.board ul li').each(function () {
            //console.log($(this).children('div'))
            if ($(this).html() == '') {
               
                $(this).html('<div class="card-player" id="lastCard"></div>');//+ (Math.floor(Math.random() * (99 - 1 + 1)) + 1) +
                $('#lastCard').draggable('disable');
                $('#lastCard').parent('li').droppable("destroy").css({ opacity: '.8' });
                doInterval = setInterval(function () { setRandomCard() }, 100);
            }

        });
        //console.log(lastSlot);

        
  
       
    } 


}



///this is how the computer will play.
function computerTurn(lastSlotID) {
   // console.log(window.turncount)
    $('.card').draggable('option', 'disabled', true);
        
        //we need to change this or add a function to look for the card just played and add an opposing card intead of random etc.
        //Add the last Slot filled to the fullslots array.
        window.fullSlots.push(lastSlotID)
        //console.log(window.fullSlots);
        var arrayCount = parseInt(lastSlotID)
         //loop through the opposing slots.      
        for (var x = 0; x < window.slotArray.length; x++) {
           
            if (arrayCount === slotArray[x][0]) {            
          
                for (var i = 0; i < window.slotArray[x][1].length; i++) {
                    //console.log(arrayCount, slotArray[x][0], window.slotArray[x][1][i])
                    if (1 == 0) {
                        //do nothing...
                    } else if (arrayCount === slotArray[x][0] && window.fullSlots.indexOf(window.slotArray[x][1][i]) == -1) {
                        
                        var slotToCheck = ".board ul li#" + window.slotArray[x][1][i];
                        var slotToPush = window.slotArray[x][1][i];
                       


                    } else {
                        
                        var slotToPush = generateRandomNumber(1, 25, 'turn');
                        var slotToCheck = ".board ul li#" + slotToPush;
                       

                    }

                }

            }

        }

        doSomething(slotToPush, slotToCheck);

            
         
    //Slot is empty.
        function doSomething(slotToPush, slotToCheck) {
            //console.log('test');
            if (!$.trim($(slotToCheck).html()).length) {
                window.fullSlots.push(slotToPush)
                window.turncount++;
                var number = generateRandomNumber(1, 12, 'card');
                $(slotToCheck).html('<div class="card-computer">' + number + '</div>');
                window.myvar.splice(0, 1);
                $(slotToCheck).children('.card-computer').css({ width: '0px', height: '0px', fontSize: '0px' });
                $(slotToCheck).droppable("destroy").css({ opacity: '.8' });
                setTimeout(function () {
                    $(slotToCheck).children('.card-computer').animate({ width: '100%', height: '100%', fontSize: '24px' }, 500, function () {
                        checkSlots($(this).parent('li').attr('id'), 'card-computer');
                        $('.card').draggable('option', 'disabled', false);
                        checkTurnCount();
                    });
                }, 1000);




                return false;

            } else {
                //the slot wasnt empty, try again.
                var slotToPush = generateRandomNumber(1, 25, 'turn');
                var slotToCheck = ".board ul li#" + slotToPush;
                doSomething(slotToPush, slotToCheck);

            }
        }
    


}

function checkCards(obj, thisValue, opposingCards, slot, currentClass) {
    var trumped = false;
    //console.log('Slot: ' + obj.attr('id') + ' Slot Value: ' + thisValue, ' Opposing Cards: ' + opposingCards, " Current Class: " + currentClass)

    //loop through the array
    var cardValues = new Array()

    for (var i = 0; i < opposingCards.length; i++) {
        //set value...           0.VALUE                1.ID                2.className   
        cardValues[i] = [eval("slot[" + opposingCards[i] + "]"), opposingCards[i], $('.board ul li#' + opposingCards[i]).children('div').attr('class')]

    }
    //sort the cards in descending order based on their value.
    cardValues.sort(function (a, b) {
        return (a[0] < b[0]) ? 1 : -1;
    });

    //console.log(cardValues);


    for (var i = 0; i < cardValues.length; i++) {
        //first lets make sure we are not less than an opposing card of a different class.
        if (thisValue < cardValues[i][0] && cardValues[i][0] != 0 && cardValues[i][0] != '' && cardValues[i][2] && !trumped) {
           // console.log('This card got trumped by: ' + cardValues[i][0])
            //if we do, set the class to the smae as the bigger card.
            $(obj).children('div').removeClass().addClass(cardValues[i][2]);
            trumped = true;
            currentClass = cardValues[i][2];

        }
        //if not then see what we are greater than and trump them all!
        else if (thisValue > cardValues[i][0] && cardValues[i][0] != 0 && cardValues[i][0] != '') {
            //console.log('We trumped the: ' + cardValues[i][0], 'Current Class is; ' + currentClass);
            $('.board ul li#' + cardValues[i][1]).children('div').removeClass().addClass(currentClass);
            //currentClass = cardValues[i][2];

        }
    }

}



function checkSlots(currentSlot, currentClass) {

    //we need to loop through the slots, see what is in them and determine who gets the slot.var 
    var slot = new Array();
    //setup null replacements
    for (var i = 1; i < 26; i++) {
       
        if ($('.board ul li#' + i).children('div').html() == null ||  $('.board ul li#' + i).children('div') == 'undefined') { 
            
            slot[i] = 0 

        } else { 
            
            slot[i] = parseInt($('.board ul li#' + i).children('div').html() )
        }   

    }

    //console.log(currentSlot)
    $('.board ul li').each(function () {

        ////*********NEED TO CHANGE EVERY SINGLE ONE OF THESE TO "OR" STATEMENTS COMBINED BECAUSE IF A FIRST CONDITION IS MET, IT IS JUMPING OUT OF THE FUNCTION AND NOT CALLING THE OTHER IF'S...
        var thisValue = $(this).children('div').html();
       
        //1-5
        if ($(this).attr('id') == 1 && $(this).attr('id') == currentSlot) {

            var opposingCards = [2, 6];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)         

        }
        if ($(this).attr('id') == 2 && $(this).attr('id') == currentSlot) {
            
            var opposingCards = [1,3,7];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 3 && $(this).attr('id') == currentSlot) {
           
            var opposingCards = [2, 4, 8];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 4 && $(this).attr('id') == currentSlot) {
           
            var opposingCards = [3, 5, 9];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 5 && $(this).attr('id') == currentSlot) {
           
            var opposingCards = [4,10];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        //6-10
        if ($(this).attr('id') == 6 && $(this).attr('id') == currentSlot) {
            
            var opposingCards = [1,7,11];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 7 && $(this).attr('id') == currentSlot) {
            
            var opposingCards = [2,6,8,12];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 8 && $(this).attr('id') == currentSlot) {
            
            var opposingCards = [3,7,9,13];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 9 && $(this).attr('id') == currentSlot) {

            var opposingCards = [4,8,10,14];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 10 && $(this).attr('id') == currentSlot) {

            var opposingCards = [5,9,15];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
            
        }
        //11-15
        if ($(this).attr('id') ==11 && $(this).attr('id') == currentSlot) {

            var opposingCards = [6,12,16];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 12 && $(this).attr('id') == currentSlot) {

            var opposingCards = [7,11,13,17];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 13 && $(this).attr('id') == currentSlot) {

            var opposingCards = [8,12,14,18];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 14 && $(this).attr('id') == currentSlot) {

            var opposingCards = [9,13,15,19];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 15 && $(this).attr('id') == currentSlot) {
      
            var opposingCards = [10,14,20];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        //16-20
        if ($(this).attr('id') == 16 && $(this).attr('id') == currentSlot) {
            
            var opposingCards = [11,17,21];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 17 && $(this).attr('id') == currentSlot) {
            
            var opposingCards = [12,16,18,22];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 18 && $(this).attr('id') == currentSlot) {
            
            var opposingCards = [13,17,19,23];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 19 && $(this).attr('id') == currentSlot) {
            
            var opposingCards = [14,18,20,24];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
        }
        if ($(this).attr('id') == 20 && $(this).attr('id') == currentSlot) {
           
            var opposingCards = [15,19,25];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)

        }
        //21-25
        if ($(this).attr('id') == 21 && $(this).attr('id') == currentSlot) {
            
            var opposingCards = [16,22];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
          
        }
        if ($(this).attr('id') == 22 && $(this).attr('id') == currentSlot) {
           
            var opposingCards = [17,21,23];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
            
        }
        if ($(this).attr('id') == 23 && $(this).attr('id') == currentSlot) {
            
            var opposingCards = [18,22,24];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
           
        }
        if ($(this).attr('id') == 24 && $(this).attr('id') == currentSlot) {
           
            var opposingCards = [19,23,25];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
            
        }
        if ($(this).attr('id') == 25 && $(this).attr('id') == currentSlot) {
            
            var opposingCards = [20,24];
            checkCards($(this), thisValue, opposingCards, slot, currentClass)
           

        }


    });
}




function gameOver() {

    if (checkScore() >= 13) {

        sound.Win.play();
        //showDialog('<img id="win" src="/Images/you-win.jpg"/>');
        alert('You won! Click \"Restart Game\" on the bottom menu to play again!');
        window.score++;
        $('li#score').html('&nbsp;&nbsp;SCORE: <br />' + window.score);

    } else {

        sound.Lose.play();
        alert('You lost :( so sad. Practice makes perfect! Click \"Restart Game\" on the bottom menu to play again!');
        //showDialog('<img id="lose" src="/Images/you-lose.jpg"/>');
    }

    showNav();
}



function checkScore() {

    var count = 0;

    $('.board ul li').each(function () {

        if ($(this).children('div').hasClass('card-player')) count++

    });

    return count;




}

function showDialog(content, message) {

    $('#alerts').append(content, '<br><br><br><button id="play" class="btn-play"></button>');

    $('#alerts').dialog({

        create: function () { $(this).parent('.ui-dialog').css({ marginTop: '30px' }); $(".ui-dialog-titlebar").hide(); },
        closable: false,
        draggable: false,
        modal: true,
        position: 'top',
        resizable: false

    })

}