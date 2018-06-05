var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;var starty = 0;var endx = 0;var endy = 0;

$(document).ready(function(){

    prepareForMobile();

    newgame();
});

function prepareForMobile(){

    if(documentWidth >= 500){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }


    $("#grid-container").css({
        "width": gridContainerWidth - 2 * cellSpace,
        "height": gridContainerWidth - 2* cellSpace,
        "padding": cellSpace,
        "border-radius": 0.02 * cellSideLength
    });

    $(".grid-cell").css({
        "width": cellSideLength,
        "height": cellSideLength,
        "border-radius": 0.02 * cellSideLength
    })


}



function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateNumber();
    generateNumber();
}

function init(){
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){

            var gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPos( i , j ).top );
            gridCell.css('left', getPos( i , j ).left );
        }

    for( var i = 0 ; i < 4 ; i ++ ){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for( var j = 0 ; j < 4 ; j ++ ){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();

    score = 0;
    $('#score').text( score );
}

function updateBoardView(){

    $(".number-cell").remove();
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if( board[i][j] == 0 ){
                theNumberCell.css({
                    'width': '0px',
                    'height': '0px',
                    'top': getPos(i,j).top + cellSideLength/2 ,
                    'left': getPos(i,j).left + cellSideLength/2 ,
                    'font-size': "20px"
                });

            }
            else{
                theNumberCell.css({
                    'width': cellSideLength,
                    'height': cellSideLength,
                    'top': getPos(i,j).top,
                    'left': getPos(i,j).left,
                    'background-color': getNumberBackgroundColor( board[i][j] ),
                    'color': getNumberColor( board[i][j] )
                });
                theNumberCell.text( getNumberText( board[i][j] ) );
            }

            hasConflicted[i][j] = false;

            $(".number-cell").css({
                "line-height": cellSideLength + "px",
                "font-size": 0.25 * cellSideLength + "px"
            })
        }
}

function generateNumber(){

    if( nospace( board ) )
        return false;

    //随机一个位置
    var tem = new Array();
    var count = 0;

    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            if( board[i][j] == 0 ){
                
                tem[count] = i*9+j;
                count++;
            }
        }

    var pos = parseInt(Math.floor(Math.random()*count));

    var randx = Math.floor(tem[pos]/9);
    var randy = Math.floor(tem[pos]%9);


    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumber( randx , randy , randNumber );

    return true;
}

$(document).keydown( function( event ){

    var codenum = event.keyCode || event.which;

    switch( codenum ){
        case 37: //left
        event.preventDefault();
            if( moveLeft() ){
                setTimeout("generateNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 38: //up
        event.preventDefault();
            if( moveUp() ){
                setTimeout("generateNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39: //right
        event.preventDefault();
            if( moveRight() ){
                setTimeout("generateNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40: //down
        event.preventDefault();
            if( moveDown() ){
                setTimeout("generateNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        default: //default
            break;
    }
});


document.addEventListener("touchstart",function(e){
    startx = e.touches[0].pageX;
    starty = e.touches[0].pageY;
});

document.addEventListener("touchend",function(e){

    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;

    var detlaX = endx - startx;
    var detlaY = endy - starty;

    if(Math.abs(detlaX) <= 0.15 * documentWidth && Math.abs(detlaY) <= 0.2 * documentWidth){
        return;
    }

    if(Math.abs(detlaX) > Math.abs(detlaY)){

        if(detlaX > 0){
            //move right
            if( moveRight() ){
                setTimeout("generateNumber()",210);
                setTimeout("isgameover()",300);
            }

        }
        else{
            //move left
            if( moveLeft() ){
                setTimeout("generateNumber()",210);
                setTimeout("isgameover()",300);
            }
        }

    }else if(Math.abs(detlaX) < Math.abs(detlaY)){

        if(detlaY > 0){
            //move down
            if( moveDown() ){
                setTimeout("generateNumber()",210);
                setTimeout("isgameover()",300);
            }

        }else{
            //move up
            if( moveUp() ){
                setTimeout("generateNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
    else{
        return;
    }
});



function moveLeft(){

    if( !canMoveLeft( board ) )
        return false;

    //moveLeft
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 1 ; j < 4 ; j ++ ){
            if( board[i][j] != 0 ){

                for( var k = 0 ; k < j ; k ++ ){
                    if( board[i][k] == 0 && noBlockHorizontal( i , k , j , board ) ){
                        //move
                        showMove( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , k , j , board ) && !hasConflicted[i][k] && board[i][j] != 2048){
                        //move
                        showMove( i , j , i , k );
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore( score );

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
    if( !canMoveRight( board ) )
        return false;

    //moveRight
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > j ; k -- ){

                    if( board[i][k] == 0 && noBlockHorizontal( i , j , k , board ) ){
                        //move
                        showMove( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board ) && !hasConflicted[i][k]  && board[i][j] != 2048){
                        //move
                        showMove( i , j , i , k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore( score );

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){

    if( !canMoveUp( board ) )
        return false;

    //moveUp
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k ++ ){

                    if( board[k][j] == 0 && noBlockVertical( j , k , i , board ) ){
                        //move
                        showMove( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , k , i , board ) && !hasConflicted[k][j]  && board[i][j] != 2048){
                        //move
                        showMove( i , j , k , j );
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore( score );

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if( !canMoveDown( board ) )
        return false;

    //moveDown
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k -- ){

                    if( board[k][j] == 0 && noBlockVertical( j , i , k , board ) ){
                        //move
                        showMove( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , i , k , board ) && !hasConflicted[k][j]  && board[i][j] != 2048){
                        //move
                        showMove( i , j , k , j );
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore( score );

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}