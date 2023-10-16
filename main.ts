function LookforQR () {
	
}
function Move () {
    iBIT.Servo(ibitServo.SV1, 0)
    iBIT.Servo(ibitServo.SV2, 0)
    while (true) {
        if (balldisplacementx > 0) {
            iBIT.Turn(ibitTurn.Left, 20)
        } else if (balldisplacementx < 0) {
            iBIT.Turn(ibitTurn.Right, 20)
        } else {
            iBIT.Motor(ibitMotor.Forward, 20)
            if (balldisplacementy < -90) {
                break;
            }
        }
    }
    iBIT.MotorStop()
    CollectBall()
}
function ShootBall () {
	
}
function CollectBall () {
    balldisplacementy = huskylens.readeBox(ballcolor, Content1.yCenter)
    while (balldisplacementy > -120) {
        iBIT.Motor(ibitMotor.Forward, 50)
        balldisplacementy = huskylens.readeBox(ballcolor, Content1.yCenter)
    }
}
let ballcolor = 0
let balldisplacementy = 0
let balldisplacementx = 0
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_COLOR_RECOGNITION)
huskylens.request()
let state = 0
basic.forever(function () {
    ballcolor = huskylens.readBox_s(Content3.ID)
    balldisplacementx = huskylens.readeBox(ballcolor, Content1.xCenter)
    balldisplacementy = huskylens.readeBox(ballcolor, Content1.yCenter)
    if (state == 0) {
        Move()
    }
})
