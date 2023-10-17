/**
 * ball_color
 * 
 * 1, 2 = blue, red
 * 
 * 3 = pink (wall)
 * 
 * 4++ = other colors
 * 
 * QR
 * 
 * 1, 2 = blue, red
 */
function AvoidBall () {
    huskylens.request()
    if (huskylens.readBox_s(Content3.ID) > 3) {
        avoid_color = huskylens.readBox_s(Content3.ID)
        avoid_displacement_x = huskylens.readeBox(avoid_color, Content1.xCenter)
        avoid_displacement_y = huskylens.readeBox(avoid_color, Content1.yCenter)
        if (avoid_displacement_x >= 160 && avoid_displacement_x < 180) {
            basic.showLeds(`
                . . # . .
                . # . . .
                # # # # #
                . # . . .
                . . # . .
                `)
            iBIT.Turn(ibitTurn.Left, 30)
        } else if (avoid_displacement_x > 140 && avoid_displacement_x < 160) {
            basic.showLeds(`
                . . # . .
                . . . # .
                # # # # #
                . . . # .
                . . # . .
                `)
            iBIT.Turn(ibitTurn.Right, 30)
        }
    }
}
function getTrackingBallPos () {
    huskylens.request()
    ball_displacement_x = huskylens.readeBox(ball_color, Content1.xCenter)
    ball_displacement_y = huskylens.readeBox(ball_color, Content1.yCenter)
}
input.onButtonPressed(Button.A, function () {
    ShootBall()
})
function MovetoItem (x: number) {
    iBIT.MotorStop()
    displacement_abs = Math.abs(x - 160)
    if (x > 180) {
        basic.showLeds(`
            . . # . .
            . # . . .
            # # # # #
            . # . . .
            . . # . .
            `)
        iBIT.Turn(ibitTurn.Left, 30)
        basic.pause(displacement_abs)
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
        basic.pause(displacement_abs)
        iBIT.Motor(ibitMotor.Forward, 5)
    } else {
        AvoidWall()
        AvoidBall()
        iBIT.Motor(ibitMotor.Forward, 30)
        basic.showLeds(`
            . . # . .
            . . # . .
            # . # . #
            . # # # .
            . . # . .
            `)
    }
}
function getNewBall () {
    while (true) {
        huskylens.initI2c()
        huskylens.initMode(protocolAlgorithm.ALGORITHM_COLOR_RECOGNITION)
        huskylens.request()
        if (huskylens.isAppear(1, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
            ball_color = 1
            getTrackingBallPos()
            break;
        } else if (huskylens.isAppear(2, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
            ball_color = 2
            getTrackingBallPos()
            break;
        } else {
            AvoidWall()
            AvoidBall()
        }
    }
}
input.onButtonPressed(Button.B, function () {
    SwallowBall()
})
function ShootBall () {
    state = 0
    iBIT.Servo(ibitServo.SV1, 0)
    iBIT.Servo(ibitServo.SV2, 0)
    iBIT.Motor(ibitMotor.Forward, 50)
    basic.pause(500)
    iBIT.Servo(ibitServo.SV2, 90)
    basic.pause(500)
    iBIT.MotorStop()
    iBIT.Servo(ibitServo.SV2, 0)
}
function QRsection () {
    huskylens.initI2c()
    huskylens.initMode(protocolAlgorithm.QRRECOGMITION)
    huskylens.request()
    if (huskylens.isAppear(ball_color, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
        if (huskylens.readeBox(ball_color, Content1.width) > 80) {
            ShootBall()
        } else {
            MovetoItem(huskylens.readeBox(ball_color, Content1.xCenter))
        }
    } else {
        iBIT.Spin(ibitSpin.Left, 30)
    }
}
function AvoidWall () {
    huskylens.request()
    wall_displacement_x = huskylens.readeBox(3, Content1.xCenter)
    wall_size_x = huskylens.readeBox(3, Content1.width)
    if (wall_displacement_x >= 160 && wall_size_x > 160) {
        basic.showLeds(`
            . . # . .
            . # . . .
            # # # # #
            . # . . .
            . . # . .
            `)
        iBIT.Turn(ibitTurn.Left, 30)
    } else if (wall_displacement_x < 160 && wall_size_x > 160) {
        basic.showLeds(`
            . . # . .
            . . . # .
            # # # # #
            . . . # .
            . . # . .
            `)
        iBIT.Turn(ibitTurn.Right, 30)
    }
}
function SwallowBall () {
    state = 1
    iBIT.Servo(ibitServo.SV1, 120)
    iBIT.Motor(ibitMotor.Forward, 30)
    basic.pause(500)
    iBIT.MotorStop()
    ball_displacement_y = 0
}
let wall_size_x = 0
let wall_displacement_x = 0
let displacement_abs = 0
let avoid_displacement_y = 0
let avoid_displacement_x = 0
let avoid_color = 0
let ball_displacement_y = 0
let ball_displacement_x = 0
let ball_color = 0
let state = 0
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_COLOR_RECOGNITION)
huskylens.request()
state = 0
ball_color = 0
ball_displacement_x = 0
ball_displacement_y = 0
basic.forever(function () {
    if (state == 0) {
        if (ball_color == 0) {
            getNewBall()
        } else {
            getTrackingBallPos()
            if (ball_displacement_y < 200) {
                iBIT.Servo(ibitServo.SV1, 0)
                iBIT.Servo(ibitServo.SV2, 0)
                MovetoItem(avoid_displacement_x)
            } else if (ball_displacement_y >= 200) {
                SwallowBall()
            }
        }
    } else if (state == 1) {
        QRsection()
    }
})
