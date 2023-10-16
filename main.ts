function fixMove (x: number, y: number) {
    ball_displacement_abs = Math.abs(ball_displacement_abs - 160)
    if (x > 180) {
        basic.showLeds(`
            . . # . .
            . # . . .
            # # # # #
            . # . . .
            . . # . .
            `)
        iBIT.Turn(ibitTurn.Left, 30)
        basic.pause(ball_displacement_abs)
        iBIT.Motor(ibitMotor.Forward, 10)
    } else if (x < 140) {
        basic.showLeds(`
            . . # . .
            . . . # .
            # # # # #
            . . . # .
            . . # . .
            `)
        iBIT.Turn(ibitTurn.Right, 30)
        basic.pause(ball_displacement_abs)
        iBIT.Motor(ibitMotor.Forward, 10)
    } else {
        iBIT.Motor(ibitMotor.Forward, 30)
        basic.showLeds(`
            . . # . .
            . . # . .
            # . # . #
            . # # # .
            . . # . .
            `)
    }
    ball_color = 0
}
function CollectBall () {
    ball_displacement_y = huskylens.readeBox(ball_color, Content1.yCenter)
    if (ball_displacement_y > -120) {
        iBIT.Motor(ibitMotor.Forward, 50)
        ball_displacement_y = huskylens.readeBox(ball_color, Content1.yCenter)
    }
}
let ball_displacement_abs = 0
let ball_displacement_y = 0
let ball_color = 0
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_COLOR_RECOGNITION)
huskylens.request()
let state = 0
ball_color = 0
let ball_displacement_x = 0
ball_displacement_y = 0
basic.forever(function () {
    if (ball_color == 0) {
        huskylens.request()
        ball_color = huskylens.readBox_s(Content3.ID)
        ball_displacement_x = huskylens.readeBox(ball_color, Content1.xCenter)
        ball_displacement_y = huskylens.readeBox(ball_color, Content1.yCenter)
    }
    if (state == 0) {
        if (huskylens.isAppear(ball_color, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
            fixMove(ball_displacement_x, ball_displacement_y)
        } else {
            basic.showLeds(`
                . # # . .
                . # # . .
                # # # # #
                # # # # #
                . # # # .
                `)
            iBIT.MotorStop()
            ball_color = 0
        }
    }
})
