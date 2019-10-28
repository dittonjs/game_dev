#Dillon Sant
#CS1400-1
#Assignment 7

'''
Requirement Specifications-
Write a program that asks the user for radius of two circles, and coordinates. Then draw those circles, and determine whether or not they are intersecting.

System Analysis-


System Design-
1.import random
2. define 0, 1, and 2 as rock paper scissors.
3.prompt the user to pick rock, paper, or scissors.
4. Have the computer generate a random number 0-2.
5.Test the computers number against the user, using else, if, elif.
6. Display the winner of Rock, Paper Scissors.

Test-
In order to determine if the program works, each number inputed by the user must have three results, draw, you win, and computer wins.
All three inputs have three results.

'''

def circle(x1, y1, x2, y2, r1, r2):

    distSq = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    radSumSq = (r1 + r2) * (r1 + r2);
    if (distSq == radSumSq):
        return 1
    elif (distSq > radSumSq):
        return -1
    else:
        return 0


# Driver code
x1 = -10
y1 = 8
x2 = 14
y2 = -24
r1 = 30
r2 = 10

t = circle(x1, y1, x2, y2, r1, r2)
if (t == 1):
    print("Circle touch to each other.")
elif (t < 0):
    print("Circle not touch to each other.")
else:
    print("Circle intersect to each other.") 
