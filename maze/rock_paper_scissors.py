#Dillon Sant
#CS1400-1
#Assignment 7


'''
Requirement Specifications-
Write a program that plays rock paper scissors with the computer, asking the user for input, and testing the input against the computer randomly
picking rock, paper, or scissors

System Analysis-
import random module, prompt the user to enter a number 0, 1 , or 2, which represent rock, paper, and scissors. Have the computer pick a random
number, test the computers number againt the users, using if, else, or elif. Print the winner of the game.

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

import random

print("Rock Paper Scissors")

userInput = int(input("Please enter a number, scissor (0), rock (1), paper (2): "))

computerInput= random.randint(0,2)

#user input=
if userInput == 0:
	userInput = "Scissor"
else:
    if userInput == 1:
            userInput = "Rock"
    else:
        if userInput == 2:
               userInput = "Paper"
#Computer Input=
if computerInput == 0:
    computerInput = "Scissor"
else:
    if computerInput == 1:
        computerInput = "Rock"
    else:
        if computerInput == 2:
            computerInput = "Paper"
#Display Winner and Loser
if userInput == computerInput:
	draw= print("Draw, user and computer both selected " , userInput)
elif userInput == "Paper" and computerInput == "Scissor":
    print("Computer Selected " + computerInput + "," " User Selected " + userInput + "," "Computer Wins")
elif userInput == "Scissor" and computerInput == "Paper":
    print("Computer Selected " + computerInput + "," " User Selected " + userInput + "," "You Win")
elif userInput == "Rock" and computerInput == "Paper":
    print("Computer Selected " + computerInput + "," " User Selected " + userInput + ","  "Computer Wins")
elif userInput == "Paper" and computerInput == "Rock":
    print("Computer Selected " + computerInput + "," " User Selected " + userInput + "," "You Win")
elif userInput == "Scissor" and computerInput == "Rock":
    print("Computer Selected " + computerInput + "," " User Selected " + userInput + "," "Computer Wins")
elif userInput == "Rock" and computerInput== "Scissor":
    print("Computer Selected " + computerInput + "," " User Selected " + userInput + "," , "You Win")
