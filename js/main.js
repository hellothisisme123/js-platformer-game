const canvas = document.querySelector('canvas')
const canvasWrapper = document.querySelector('.canvasWrapper')
let ctx

function roundDownToMultiple(num, mult) {
    return num - (num % mult);
} 

let game = {
    blocksWide: 30
}

startGame()
function startGame() {
    checkCanvasSupport()
    setCanvasSize()
    
    let frame = setInterval(() => {
        gravity()
        characterMove()
        characterDrag()
        characterPositionCalculation()
    
        drawFrame()
    }, 1 / 60);
}

function checkCanvasSupport() {
    if (canvas.getContext) ctx = canvas.getContext('2d')
    else alert('Unfortunately your browser doesn\'t support canvas and can\'t load the game. Use a different browser that supports html canvas')
}

function setCanvasSize() {
    canvas.width = roundDownToMultiple(canvasWrapper.clientWidth, game.blocksWide)
    canvas.height = roundDownToMultiple(canvasWrapper.clientHeight, game.blocksWide)
}

game = {
    character: {
        x: 0,
        y: 0,
        width: 1,
        height: 1.5,
        color: '#8b0510',
        speedX: 0, // current speed
        speedY: 0, // current speed
        walkSpeed: 10, // max speed
        walkAcceleration: 3,
        sprintSpeed: 15,  // max speed
        sprintAcceleration: 6,
        drag: 0.5, // constant force dragging the speed down
        gravAcceleration: 1, // how fast gravity accelerates
        gravSpeed: 0, // current gravity speed
        direction: 1,
        controls: {
            leftBtn: [
                'a',
                'ArrowLeft'
            ],
            rightBtn: [
                'd',
                'ArrowRight'
            ],
            upBtn: [
                'w',
                'ArrowUp'
            ],
            downBtn: [
                's',
                'ArrowDown'
            ],
            sprintBtn: [
                'Shift',
                'null'
            ]
        },
        heldButtons: {
            left: false,
            right: false,
            up: false,
            down: false,
            sprint: false
        }
    },
    blockSize: canvas.width / 30,
    blocksWide: game.blocksWide,
    backgroundColor: '#87CEEB'
}

function gravity() {

}


function characterDrag() {
    if (game.character.speedX > 0) {
        if (game.character.speedX - game.character.drag < 0) game.character.speedX = 0 // helps with weird numbers of drag
        game.character.speedX -= game.character.drag
    } else if (game.character.speedX < 0) {
        if (game.character.speedX + game.character.drag > 0) game.character.speedX = 0 // helps with weird numbers of drag
        game.character.speedX += game.character.drag
    }
}


function characterMove() {
    if (game.character.heldButtons.sprint && game.character.heldButtons.right) {
        // stops from accelerating past max speed
        if (game.character.speedX + game.character.sprintAcceleration <= game.character.sprintSpeed) {
            game.character.speedX += game.character.sprintAcceleration
        }
    } 
    
    if (game.character.heldButtons.right) {
        // stops from accelerating past max speed
        if (game.character.speedX + game.character.walkAcceleration <= game.character.walkSpeed) {
            game.character.speedX += game.character.walkAcceleration
        }
    }

    if (game.character.heldButtons.sprint && game.character.heldButtons.left) {
        // stops from accelerating past max speed
        if (game.character.speedX - game.character.sprintAcceleration >= -game.character.sprintSpeed) {
            game.character.speedX -= game.character.sprintAcceleration
        }
    } 
    
    if (game.character.heldButtons.left) {
        // stops from accelerating past max speed
        if (game.character.speedX - game.character.walkAcceleration >= -game.character.walkSpeed) {
            game.character.speedX -= game.character.walkAcceleration
        }
    }
}

function characterPositionCalculation() {
    game.character.x += game.character.speedX
}

function drawBackground() {
    ctx.fillStyle = game.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawCharacter() {
    ctx.fillStyle = game.character.color
    ctx.fillRect(game.character.x, game.character.y, game.character.width * game.blockSize, game.character.height * game.blockSize)
}

function drawFrame() {
    drawBackground()

    drawCharacter()
}

window.addEventListener('keydown', e => {
    // if (e.repeat) return
    
    if (e.key == game.character.controls.leftBtn[0] || e.key == game.character.controls.leftBtn[1]) {
        game.character.heldButtons.left = true
    } 
    
    if (e.key == game.character.controls.rightBtn[0] || e.key == game.character.controls.rightBtn[1]) {
        game.character.heldButtons.right = true
    } 
    
    if (e.key == game.character.controls.upBtn[0] || e.key == game.character.controls.upBtn[1]) {
        game.character.heldButtons.up = true
    } 
    
    if (e.key == game.character.controls.downBtn[0] || e.key == game.character.controls.downBtn[1]) {
        game.character.heldButtons.down = true
    } 
    
    if (e.key == game.character.controls.sprintBtn[0] || e.key == game.character.controls.sprintBtn[1]) {
        game.character.heldButtons.sprint = true
    }
})

window.addEventListener('keyup', e => {
    if (e.key == game.character.controls.leftBtn[0] || e.key == game.character.controls.leftBtn[1]) {
        game.character.heldButtons.left = false
    } 
    
    if (e.key == game.character.controls.rightBtn[0] || e.key == game.character.controls.rightBtn[1]) {
        game.character.heldButtons.right = false
    } 
    
    if (e.key == game.character.controls.upBtn[0] || e.key == game.character.controls.upBtn[1]) {
        game.character.heldButtons.up = false
    } 
    
    if (e.key == game.character.controls.downBtn[0] || e.key == game.character.controls.downBtn[1]) {
        game.character.heldButtons.down = false
    } 
    
    if (e.key == game.character.controls.sprintBtn[0] || e.key == game.character.controls.sprintBtn[1]) {
        game.character.heldButtons.sprint = false
    }
})