function showNumber( i , j , randNumber ){

    var numberCell = $('#number-cell-' + i + "-" + j );

    numberCell.css('background-color',getNumberBackgroundColor( randNumber ) );
    numberCell.css('color',getNumberColor( randNumber ) );
    numberCell.text( getNumberText( randNumber ) );

    numberCell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top:getPos( i , j ).top,
        left:getPos( i , j ).left
    },50);
}

function showMove( fromx , fromy , tox, toy ){

    var numberCell = $('#number-cell-' + fromx + '-' + fromy );
    numberCell.animate({
        top:getPos( tox , toy ).top,
        left:getPos( tox , toy ).left
    },200);
}

function updateScore( score ){
    $('#score').text( score );
}
