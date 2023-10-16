def Move():
    iBIT.servo(ibitServo.SV1, 0)
    iBIT.servo(ibitServo.SV2, 0)
    if balldisplacementx > 0:
        iBIT.turn(ibitTurn.LEFT, 20)
    elif balldisplacementx < 0:
        iBIT.turn(ibitTurn.RIGHT, 20)
    else:
        iBIT.motor(ibitMotor.FORWARD, 20)
        if balldisplacementy < -90:
            iBIT.motor_stop()
            CollectBall()
def CollectBall():
    global balldisplacementy
    balldisplacementy = huskylens.reade_box(ballcolor, Content1.Y_CENTER)
    while balldisplacementy > -120:
        iBIT.motor(ibitMotor.FORWARD, 50)
        balldisplacementy = huskylens.reade_box(ballcolor, Content1.Y_CENTER)
balldisplacementy = 0
balldisplacementx = 0
ballcolor = 0
huskylens.init_i2c()
huskylens.init_mode(protocolAlgorithm.ALGORITHM_COLOR_RECOGNITION)
huskylens.request()
state = 0
ballcolor = 0

def on_forever():
    global ballcolor, balldisplacementx, balldisplacementy
    if ballcolor == 0:
        ballcolor = huskylens.readBox_s(Content3.ID)
    balldisplacementx = huskylens.reade_box(ballcolor, Content1.X_CENTER)
    balldisplacementy = huskylens.reade_box(ballcolor, Content1.Y_CENTER)
    if state == 0:
        Move()
basic.forever(on_forever)
