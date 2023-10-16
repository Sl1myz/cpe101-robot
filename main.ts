function fixMove (x: number, y: number) {
    iBIT.Servo(ibitServo.SV1, 0)
    iBIT.Servo(ibitServo.SV2, 0)
    iBIT.MotorStop()
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
        iBIT.Motor(ibitMotor.Forward, 5)
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
        iBIT.Motor(ibitMotor.Forward, 5)
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
input.onButtonPressed(Button.A, function () {
    ShootBall()
})
input.onButtonPressed(Button.B, function () {
    SwallowBall()
})
function ShootBall () {
    state = 0
    iBIT.Servo(ibitServo.SV1, 0)
    iBIT.Servo(ibitServo.SV2, 0)
    basic.pause(500)
    iBIT.Servo(ibitServo.SV2, 90)
    basic.pause(500)
    iBIT.MotorStop()
    iBIT.Servo(ibitServo.SV2, 0)
}
function SwallowBall () {
    state = 1
    iBIT.Servo(ibitServo.SV1, 120)
    basic.pause(500)
    iBIT.MotorStop()
    ball_displacement_y = 0
}
let ball_displacement_abs = 0
let ball_displacement_y = 0
let ball_color = 0
let state = 0
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_COLOR_RECOGNITION)
huskylens.request()
state = 0
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
        iBIT.Servo(ibitServo.SV1, 0)
        if (huskylens.isAppear(ball_color, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
            if (ball_displacement_y < 200) {
                fixMove(ball_displacement_x, ball_displacement_y)
            } else if (ball_displacement_y < 300) {
                SwallowBall()
            }
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
    } else {
        ShootBall()
    }
})
