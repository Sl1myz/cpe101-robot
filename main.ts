function fixMove (x: number, y: number) {
    iBIT.Servo(ibitServo.SV1, 0)
    iBIT.Servo(ibitServo.SV2, 0)
    if (x > 0) {
        basic.showLeds(`
            . . # . .
            . # . . .
            # # # # #
            . # . . .
            . . # . .
            `)
        iBIT.Turn(ibitTurn.Left, 20)
    } else if (x < 0) {
        iBIT.Turn(ibitTurn.Right, 20)
        basic.showLeds(`
            . . # . .
            . . . # .
            # # # # #
            . . . # .
            . . # . .
            `)
    } else {
        iBIT.Motor(ibitMotor.Forward, 20)
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
        if (y < -90) {
            iBIT.MotorStop()
            CollectBall()
        }
    }
}
function CollectBall () {
    ball_displacement_y = huskylens.readeBox(ball_color, Content1.yCenter)
    if (ball_displacement_y > -120) {
        iBIT.Motor(ibitMotor.Forward, 50)
        ball_displacement_y = huskylens.readeBox(ball_color, Content1.yCenter)
    }
}
let ball_displacement_y = 0
let ball_color = 0
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_COLOR_RECOGNITION)
huskylens.request()
let state = 0
ball_color = 0
let turn_num = 0
let ball_displacement_x = 0
ball_displacement_y = 0
basic.forever(function () {
    if (ball_color == 0) {
        ball_color = huskylens.readBox_s(Content3.ID)
    }
    ball_displacement_x = huskylens.readeBox(ball_color, Content1.xCenter)
    ball_displacement_y = huskylens.readeBox(ball_color, Content1.yCenter)
    if (state == 0) {
        fixMove(ball_displacement_x, ball_displacement_y)
    }
})
