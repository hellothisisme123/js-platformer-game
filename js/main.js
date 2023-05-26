const canvas = document.querySelector('canvas')
const canvasWrapper = document.querySelector('.canvasWrapper')
let ctx

function roundDownToMultiple(num, mult) {
    return num - (num % mult);
} 

let game = {
    blocksWide: 35
}

startGame()
function startGame() {
    checkCanvasSupport()
    setCanvasSize()
    
    let frame = setInterval(() => {
        characterGravity()
        characterController()
        characterDrag()
        characterJump()
        
        characterBorderCheck()
        characterPositionCalculation()
    
        console.clear()
        console.log(game.character.speedX, game.character.speedY)
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
        airDrag: 0.1, // constant force dragging the speed down while in the air
        walkingDrag: 0.5, // constant force dragging the speed down while grounded
        gravAcceleration: 0.5, // how fast gravity accelerates
        direction: 1,
        grounded: false,

        // landing bounce is when you land from a fall and hold jump while you land
        landBounceHeightMult: 0.2,
        landBounceSpeedBoost: 2,
        landBounceMinSpeed: 20,

        // jump
        jumpTick: 0,
        jumpDuration: 10, // in frames
        initialJumpYBoost: 3,
        initialJumpXBoost: 1.7,
        jumpHoldYBoost: 1.1,

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
            jumpBtn: [
                ' ',
                'null'
            ]
        },
        heldButtons: {
            left: false,
            right: false,
            up: false,
            down: false,
            jump: false,
        }
    },
    blockSize: canvas.width / game.blocksWide,
    blocksWide: game.blocksWide,
    backgroundColor: '#87CEEB'
}

function characterJump() {
    if (game.character.heldButtons.jump && game.character.jumpTick < game.character.jumpDuration) {
        console.log('red')
        if (game.character.jumpTick == 0) { // on the first jump frame the player gets a boost
            game.character.grounded = false
            game.character.speedY -= game.character.initialJumpYBoost
            game.character.speedX *= game.character.initialJumpXBoost
        }
        game.character.jumpTick++
        game.character.speedY -= game.character.jumpHoldYBoost
    }
}

function characterBorderCheck() {
    if (game.character.y + game.character.height > canvas.height) {
        // landing
        if (game.character.heldButtons.jump && game.character.speedY > game.character.landBounceMinSpeed) {
            game.character.y = canvas.height - (game.character.height * game.blockSize)
            game.character.speedY = -game.character.speedY * game.character.landBounceHeightMult
            game.character.speedX *= game.character.landBounceSpeedBoost
            return
        }

        game.character.speedY = 0
        game.character.grounded = true
        game.character.jumpTick = 0 // allows the player to jump again
        game.character.y = canvas.height - (game.character.height * game.blockSize)
    }
}

function characterGravity() {
    if (game.character.grounded) return
    game.character.speedY += game.character.gravAcceleration
}

function characterDrag() {
    if (game.character.speedX > 0) {
        if (game.character.speedX - game.character.walkingDrag < 0) game.character.speedX = 0 // helps with weird numbers of drag
        
        if (game.character.grounded) { // drag only occurs while grounded
            game.character.speedX -= game.character.walkingDrag
        } else {
            game.character.speedX -= game.character.airDrag
        }
    } else if (game.character.speedX < 0) {
        if (game.character.speedX + game.character.walkingDrag > 0) game.character.speedX = 0 // helps with weird numbers of drag

        if (game.character.grounded) { // drag only occurs while grounded
            game.character.speedX += game.character.walkingDrag
        } else {
            game.character.speedX += game.character.airDrag
        }
    }
}

function characterController() {
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
    game.character.y += game.character.speedY
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

    if (e.key == game.character.controls.jumpBtn[0] || e.key == game.character.controls.jumpBtn[1]) {
        game.character.heldButtons.jump = true
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

    if (e.key == game.character.controls.jumpBtn[0] || e.key == game.character.controls.jumpBtn[1]) {
        game.character.heldButtons.jump = false
    }
})