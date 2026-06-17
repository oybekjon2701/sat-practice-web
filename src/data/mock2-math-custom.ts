import { Question } from "@/types";

export const mock2MathModule1: Question[] = [
  {
    id: "mock2-math-01", module: 1, questionNumber: 1, type: "mcq", difficulty: "medium",
    stem: "The length of each side of triangle A is 270 millimeters. The length of each side of triangle B is double the length of each side of triangle A. What is the length, in millimeters, of each side of triangle B?",
    choices: [
      { label: "A", text: "270" },
      { label: "B", text: "272" },
      { label: "C", text: "540" },
      { label: "D", text: "1,080" },
    ],
    correctAnswer: "C", section: "math",
  },
  {
    id: "mock2-math-02", module: 1, questionNumber: 2, type: "mcq", difficulty: "medium",
    stem: "Anton is selling toys from his toy collection. When he started selling the toys, there were 2,800 toys in the collection. At the end of each week for 3 weeks after Anton started selling the toys, the number of toys in the collection had decreased by 1/2 of the toys in the collection at the end of the previous week. Which equation gives the number of toys, c, in the collection w weeks after Anton started selling the toys, where 0 <= w <= 36.",
    choices: [
      { label: "A", text: "c = w^(1/2)" },
      { label: "B", text: "c = 2,800^w" },
      { label: "C", text: "c = 1,400(1/2)^w" },
      { label: "D", text: "c = 2,800(1/2)^w" },
    ],
    correctAnswer: "D", section: "math",
  },
  {
    id: "mock2-math-03", module: 1, questionNumber: 3, type: "mcq", difficulty: "medium",
    stem: "Which expression is equivalent to 30x^2 + 6x + 6?",
    choices: [
      { label: "A", text: "5x^2(6x + 6)" },
      { label: "B", text: "30x(x + 1)" },
      { label: "C", text: "6(5x^2 + x + 1)" },
      { label: "D", text: "4(2x^2 + x + 1)" },
    ],
    correctAnswer: "C", section: "math",
  },
  {
    id: "mock2-math-04", module: 1, questionNumber: 4, type: "mcq", difficulty: "medium",
    stem: "sqrt(w) + 22 = 28. What is the solution to the given equation?",
    choices: [
      { label: "A", text: "2" },
      { label: "B", text: "3" },
      { label: "C", text: "12" },
      { label: "D", text: "36" },
    ],
    correctAnswer: "D", section: "math",
  },
  {
    id: "mock2-math-05", module: 1, questionNumber: 5, type: "gridin", difficulty: "medium",
    stem: "The function f is defined by f(x) = 7x^3 + 6. What is the value of f(2)?",
    correctAnswer: "62", section: "math",
  },
  {
    id: "mock2-math-06", module: 1, questionNumber: 6, type: "mcq", difficulty: "medium",
    stem: "The function f(x) = -30x + 310 gives the predicted height above the ground f(x), in feet, of a model airplane a minutes after it begins to descend. What is the predicted height above the ground, in feet, of the model airplane 2 minutes after it begins to descend?",
    choices: [
      { label: "A", text: "60" },
      { label: "B", text: "250" },
      { label: "C", text: "280" },
      { label: "D", text: "370" },
    ],
    correctAnswer: "B", section: "math",
  },
  {
    id: "mock2-math-07", module: 1, questionNumber: 7, type: "mcq", difficulty: "medium",
    stem: "y = -12x + 16, y = -20x + 24. What is the solution (x, y) to the given system of equations?",
    choices: [
      { label: "A", text: "(1,4)" },
      { label: "B", text: "(16,24)" },
      { label: "C", text: "(24,16)" },
      { label: "D", text: "(4,1)" },
    ],
    correctAnswer: "A", section: "math",
  },
  {
    id: "mock2-math-08", module: 1, questionNumber: 8, type: "gridin", difficulty: "medium",
    stem: "2x = 9 + 7y, -2x = 3 + 7y. The solution to the given system of equations is (x, y). What is the value of 4x?",
    correctAnswer: "6", section: "math",
  },
  {
    id: "mock2-math-09", module: 1, questionNumber: 9, type: "gridin", difficulty: "medium",
    stem: "A bank account was opened with an initial deposit. Over the next several months, regular deposits were made into this account, and there were no withdrawals made during this time. The graph of the function f shown, where y = f(x), estimates the account balance, in dollars, in this bank account months since the initial deposit. To the nearest whole dollar, what is the amount of the initial deposit estimated by the graph?",
    imageUrl: "/visuals/q9.png", imageAlt: "Graph of account balance over time",
    correctAnswer: "15", section: "math",
  },
  {
    id: "mock2-math-10", module: 1, questionNumber: 10, type: "mcq", difficulty: "medium",
    stem: "A rectangle has a length that is 73 times its width. The function y = (73w)(w) represents this situation, where y is the area, in square feet, of the rectangle and y > 0. Which of the following is the best interpretation of 73w in this context?",
    choices: [
      { label: "A", text: "The length of the rectangle, in feet." },
      { label: "B", text: "The area of the rectangle, in square feet." },
      { label: "C", text: "The difference between the length and the width of the rectangle, in feet." },
      { label: "D", text: "The width of the rectangle, in feet." },
    ],
    correctAnswer: "A", section: "math",
  },
  {
    id: "mock2-math-11", module: 1, questionNumber: 11, type: "gridin", difficulty: "medium",
    stem: "An entomologist placed an initial population of 40 Tenebrio molitor, a type of beetle, into a habitat and monitored the population over time. When the number of Tenebrio molitor in the habitat reached 170% of the initial population, the entomologist moved 75% of the Tenebrio molitor to a second habitat. How many Tenebrio molitor did the entomologist move to the second habitat at this time?",
    correctAnswer: "51", section: "math",
  },
  {
    id: "mock2-math-12", module: 1, questionNumber: 12, type: "mcq", difficulty: "medium",
    stem: "For the polynomial function f, the graph of y = f(x) in the xy-plane passes through the points (-3,0), (1,0) and (4,0). Which of the following must be a factor of f(x)?",
    choices: [
      { label: "A", text: "x + 1" },
      { label: "B", text: "x + 4" },
      { label: "C", text: "x − 1" },
      { label: "D", text: "x − 3" },
    ],
    correctAnswer: "C", section: "math",
  },
  {
    id: "mock2-math-13", module: 1, questionNumber: 13, type: "gridin", difficulty: "medium",
    stem: "A circle has circumference of 89π centimeters. What is the diameter, in centimeter, of the circle?",
    correctAnswer: "89", section: "math",
  },
  {
    id: "mock2-math-14", module: 1, questionNumber: 14, type: "mcq", difficulty: "medium",
    stem: "If (x - 17) / 18 = (x - 17) / 6, what is the value of x + 17?",
    choices: [
      { label: "A", text: "0" },
      { label: "B", text: "3" },
      { label: "C", text: "17" },
      { label: "D", text: "34" },
    ],
    correctAnswer: "D", section: "math",
  },
  {
    id: "mock2-math-15", module: 1, questionNumber: 15, type: "gridin", difficulty: "medium",
    stem: "For what value of a is nth_root(r^42) equivalent to r^(6/7), where r > 1?",
    correctAnswer: "49", section: "math",
  },
  {
    id: "mock2-math-16", module: 1, questionNumber: 16, type: "gridin", difficulty: "medium",
    stem: "In the xy-plane, line s passes through the point (0, 0) and is parallel to the line represented by the equation y = 36x + 6. If line s also passes through the point (9, d), what is the value of d?",
    correctAnswer: "324", section: "math",
  },
  {
    id: "mock2-math-17", module: 1, questionNumber: 17, type: "mcq", difficulty: "medium",
    stem: "Circles A and B are graphed in the xy-plane. Circle A is represented by the equation (x + 8)^2 + (y - 8)^2 = 64 and intersects the x-axis at the point (r, s). Circle B has its center at (r, s) and has a radius of the same length as circle A. Which equation represents circle B?",
    choices: [
      { label: "A", text: "x^2 + (y + 8)^2 = 64" },
      { label: "B", text: "x^2 + (y - 8)^2 = 64" },
      { label: "C", text: "(x + 8)^2 + y^2 = 64" },
      { label: "D", text: "(x - 8)^2 + y^2 = 64" },
    ],
    correctAnswer: "C", section: "math",
  },
  {
    id: "mock2-math-18", module: 1, questionNumber: 18, type: "mcq", difficulty: "medium",
    stem: "The dot plots represent the distributions of values in data sets A and B. Which of the following statements must be true? I. The median of data set A is equal to the median of data set B. II. The standard deviation of data set A is equal to the standard deviation of data set B.",
    imageUrl: "/visuals/q18.png", imageAlt: "Dot plots of data sets A and B",
    choices: [
      { label: "A", text: "I and II" },
      { label: "B", text: "I only" },
      { label: "C", text: "II only" },
      { label: "D", text: "Neither I nor II" },
    ],
    correctAnswer: "D", section: "math",
  },
  {
    id: "mock2-math-19", module: 1, questionNumber: 19, type: "mcq", difficulty: "medium",
    stem: "The scatterplot shows the relationship between two variables, x and y. A line of best fit for the data is also shown. For how many of the 9 data points is the actual y-value greater than the y-value predicted by the line of best fit?",
    imageUrl: "/visuals/q19.png", imageAlt: "Scatterplot with line of best fit",
    choices: [
      { label: "A", text: "8" },
      { label: "B", text: "7" },
      { label: "C", text: "5" },
      { label: "D", text: "2" },
    ],
    correctAnswer: "C", section: "math",
  },
  {
    id: "mock2-math-20", module: 1, questionNumber: 20, type: "mcq", difficulty: "medium",
    stem: "RS = 504, ST = 128, TR = 520. The side lengths of triangle RST are given. Triangle RST is similar to triangle UVW, where S corresponds to V and T corresponds to W. What is the value of tan W?",
    choices: [
      { label: "A", text: "16/65" },
      { label: "B", text: "16/63" },
      { label: "C", text: "63/65" },
      { label: "D", text: "63/16" },
    ],
    correctAnswer: "D", section: "math",
  },
  {
    id: "mock2-math-21", module: 1, questionNumber: 21, type: "mcq", difficulty: "medium",
    stem: "f(x) = 20(2)^x + 6(2)^x. The function f is defined by the given equation. Which of the following equivalent forms of f displays, as a coefficient or a base, the y-coordinate of the y-intercept of the graph of y = f(x) in the xy-plane?",
    choices: [
      { label: "A", text: "f(x) = 80(2)^(x-2) + 24(2)^(x-2)" },
      { label: "B", text: "f(x) = 2(10(2)^x + 3(2)^x)" },
      { label: "C", text: "f(x) = 20(4)^(x/2) + 6(4)^(x/2)" },
      { label: "D", text: "f(x) = 26(2)^x" },
    ],
    correctAnswer: "D", section: "math",
  },
  {
    id: "mock2-math-22", module: 1, questionNumber: 22, type: "mcq", difficulty: "medium",
    stem: "In a set of three consecutive integers, where the integers are ordered from least to greatest, the first integer is represented by x. The sum of 4 and the second integer is less than the product of 17 and the third integer. Which inequality represents this situation?",
    choices: [
      { label: "A", text: "4 + (x + 1) > 17(x + 2)" },
      { label: "B", text: "4 + (x + 1) < 17(x + 2)" },
      { label: "C", text: "4 + (x + 2) > 17(x + 3)" },
      { label: "D", text: "4 + (x + 2) < 17(x + 3)" },
    ],
    correctAnswer: "B", section: "math",
  },
];

export const mock2MathModule2: Question[] = [
  {
    id: "mock2-math-23", module: 2, questionNumber: 1, type: "mcq", difficulty: "medium",
    stem: "The function g is defined by g(x) = 19 - x. What is the value of g(4)?",
    choices: [
      { label: "A", text: "4" },
      { label: "B", text: "15" },
      { label: "C", text: "19" },
      { label: "D", text: "23" },
    ],
    correctAnswer: "B", section: "math",
  },
  {
    id: "mock2-math-24", module: 2, questionNumber: 2, type: "mcq", difficulty: "medium",
    stem: "Micah deposited a total of $6,600 into two retirement accounts last year by depositing x dollars once each month into one account and y dollars twice each month into the other account. Which equation represents this situation?",
    choices: [
      { label: "A", text: "6,600 = 12x + 12y" },
      { label: "B", text: "6,600 = 12x + 24y" },
      { label: "C", text: "6,600 = 24x + 12y" },
      { label: "D", text: "6,600 = 24x + 24y" },
    ],
    correctAnswer: "B", section: "math",
  },
  {
    id: "mock2-math-25", module: 2, questionNumber: 3, type: "mcq", difficulty: "medium",
    stem: "The measure of angle G is pi/10 radians. If the measure of angle G is 9n in degrees, where n is a constant, what is the value of n?",
    choices: [
      { label: "A", text: "2" },
      { label: "B", text: "9" },
      { label: "C", text: "10" },
      { label: "D", text: "18" },
    ],
    correctAnswer: "A", section: "math",
  },
  {
    id: "mock2-math-26", module: 2, questionNumber: 4, type: "mcq", difficulty: "medium",
    stem: "The ratio 6 to 3 is equivalent to the ratio 24 to 3k, where k is a constant. What is the value of k?",
    choices: [
      { label: "A", text: "0.75" },
      { label: "B", text: "4" },
      { label: "C", text: "12" },
      { label: "D", text: "72" },
    ],
    correctAnswer: "B", section: "math",
  },
  {
    id: "mock2-math-27", module: 2, questionNumber: 5, type: "mcq", difficulty: "medium",
    stem: "Which expression is equivalent to (8nr^2 + 2nr) + (4n^2r + 3nr)?",
    choices: [
      { label: "A", text: "12n^2r^2 + 5nr" },
      { label: "B", text: "12n^3r^3 + 5n^2r^2" },
      { label: "C", text: "32n^3r^3 + 6n^2r^2" },
      { label: "D", text: "8nr^2 + 4n^2r + 5nr" },
    ],
    correctAnswer: "D", section: "math",
  },
  {
    id: "mock2-math-28", module: 2, questionNumber: 6, type: "mcq", difficulty: "medium",
    stem: "R = 0.43l / A. The given equation relates the resistance R, in ohms, of a wire to its length l, in meters, and its cross-sectional area A, in square meters. Which equation correctly expresses the length of the wire in terms of its resistance and its cross-sectional area?",
    choices: [
      { label: "A", text: "l = R - A / 0.43" },
      { label: "B", text: "l = R + A / 0.43" },
      { label: "C", text: "l = 0.43RA" },
      { label: "D", text: "l = AR / 0.43" },
    ],
    correctAnswer: "D", section: "math",
  },
  {
    id: "mock2-math-29", module: 2, questionNumber: 7, type: "mcq", difficulty: "medium",
    stem: "The graphs of y = -3x + 7 and y = x - 5 are shown. Point P (not shown) has coordinates (-3, 5) and lies in the shaded region. The coordinates of P satisfy which of the following inequalities? I. y < -3x + 7  II. y > x - 5",
    imageUrl: "/visuals/q29.png", imageAlt: "Graphs of two lines with shaded region",
    choices: [
      { label: "A", text: "I only" },
      { label: "B", text: "II only" },
      { label: "C", text: "I and II" },
      { label: "D", text: "Neither I nor II" },
    ],
    correctAnswer: "C", section: "math",
  },
  {
    id: "mock2-math-30", module: 2, questionNumber: 8, type: "gridin", difficulty: "medium",
    stem: "There is a linear relationship between x and y. The table shows three values of x and their corresponding values of y in terms of a constant n. What is the slope of the line that represents this relationship in the xy-plane?",
    imageUrl: "/visuals/q30.png", imageAlt: "Table of x and y values",
    correctAnswer: "24/5", section: "math",
  },
  {
    id: "mock2-math-31", module: 2, questionNumber: 9, type: "mcq", difficulty: "medium",
    stem: "If (1/2x - 21/2)^2 - 81 = 0, what is the value of (x - 21)^2?",
    choices: [
      { label: "A", text: "324" },
      { label: "B", text: "162" },
      { label: "C", text: "21" },
      { label: "D", text: "9" },
    ],
    correctAnswer: "A", section: "math",
  },
  {
    id: "mock2-math-32", module: 2, questionNumber: 10, type: "mcq", difficulty: "medium",
    stem: "Rectangles ABCD and EFGH are similar. The length of each side of EFGH is 6 times the length of the corresponding side of ABCD. The area of ABCD is 90 square units. What is the area, in square units, of EFGH?",
    choices: [
      { label: "A", text: "15" },
      { label: "B", text: "36" },
      { label: "C", text: "540" },
      { label: "D", text: "3,240" },
    ],
    correctAnswer: "D", section: "math",
  },
  {
    id: "mock2-math-33", module: 2, questionNumber: 11, type: "gridin", difficulty: "medium",
    stem: "On a plot of land, 48.0% of the square footage is farmland and the remaining square footage is pasture. There are buildings on exactly 23.5% of the square footage of the farmland, and there are buildings on exactly 16.0% of the square footage of the pasture. If there are buildings on exactly p% of the square footage of the plot of land, what is the value of p?",
    correctAnswer: "19.6", section: "math",
  },
  {
    id: "mock2-math-34", module: 2, questionNumber: 12, type: "mcq", difficulty: "medium",
    stem: "The scatterplot shows data set A, which consists of the weights y, in pounds, of a Labrador retriever puppy at various ages, x, in months. The equation of a line of best fit for the relationship in data set A can be written as y = -5.1 + 8.7x, where 2 <= x <= 6. The puppy was weighed again at 9 months old and weighed 52 pounds. Data set B consists of all the data points in data set A as well as the data point (9, 52). The equation of a line of best fit for data set B can be written as y = r + sx. Which of the following is the best estimate for the value of s?",
    imageUrl: "/visuals/q34.png", imageAlt: "Scatterplot of puppy weights",
    choices: [
      { label: "A", text: "5.9" },
      { label: "B", text: "8.7" },
      { label: "C", text: "13.8" },
      { label: "D", text: "17.7" },
    ],
    correctAnswer: "B", section: "math",
  },
  {
    id: "mock2-math-35", module: 2, questionNumber: 13, type: "mcq", difficulty: "medium",
    stem: "If 16 - 2x = 58, which of the following is a value of 8 - x?",
    choices: [
      { label: "A", text: "0" },
      { label: "B", text: "8" },
      { label: "C", text: "29" },
      { label: "D", text: "42" },
    ],
    correctAnswer: "C", section: "math",
  },
  {
    id: "mock2-math-36", module: 2, questionNumber: 14, type: "mcq", difficulty: "medium",
    stem: "A book-of-the-month club charges $16 for the first book purchased during the month and an additional $11 for each book after the first. Which equation describes this situation, where y is the total cost, in dollars, for books purchased during a month, x is the number of books purchased during the month, and x > 0?",
    choices: [
      { label: "A", text: "y = x + 16" },
      { label: "B", text: "y = 11x + 16" },
      { label: "C", text: "y = 11(x - 1) + 16" },
      { label: "D", text: "y = (x - 1) + 16" },
    ],
    correctAnswer: "C", section: "math",
  },
  {
    id: "mock2-math-37", module: 2, questionNumber: 15, type: "mcq", difficulty: "medium",
    stem: "A company developed a plan to set the selling price of a product. The company determined that for a selling price of $120.00, zero products would be sold. For each $2.50 decrease in the selling price, the number of products sold would increase by one. For a revenue of exactly $1,437.50, which of the following could be the number of products sold? (revenue = price x number of products sold)",
    choices: [
      { label: "A", text: "23" },
      { label: "B", text: "24" },
      { label: "C", text: "527" },
      { label: "D", text: "1,440" },
    ],
    correctAnswer: "A", section: "math",
  },
  {
    id: "mock2-math-38", module: 2, questionNumber: 16, type: "gridin", difficulty: "medium",
    stem: "The equation of the graph shown y = a^x + b, where a and b are constants. What is the value of a - b?",
    imageUrl: "/visuals/q38.png", imageAlt: "Graph of exponential function",
    correctAnswer: "3", section: "math",
  },
  {
    id: "mock2-math-39", module: 2, questionNumber: 17, type: "mcq", difficulty: "medium",
    stem: "y = 7x^2 - bx - 6\nWhich of the following equations is equal to the given equation above, where b is a positive constant.",
    choices: [
      { label: "A", text: "y = 7(x - b/14)^2 - 6 - b^2/28" },
      { label: "B", text: "y = 7(x - b/14)^2 - 6" },
      { label: "C", text: "y = 7(x + b/14)^2 - 6 - b^2/28" },
      { label: "D", text: "y = 7(x + b/14)^2 - 6" },
    ],
    correctAnswer: "A", section: "math",
  },
  {
    id: "mock2-math-40", module: 2, questionNumber: 18, type: "mcq", difficulty: "medium",
    stem: "The equation d = 6t + 210 gives the distance d, in feet, from a reference point on the surface of Mars to a Mars rover, where t is the number of minutes after the start of a period of observation. By how many feet does the Mars rover's distance from the reference point increase over a period of 20 minutes?",
    choices: [
      { label: "A", text: "330" },
      { label: "B", text: "230" },
      { label: "C", text: "120" },
      { label: "D", text: "6" },
    ],
    correctAnswer: "C", section: "math",
  },
  {
    id: "mock2-math-41", module: 2, questionNumber: 19, type: "gridin", difficulty: "medium",
    stem: "A line intersects two parallel lines, forming four acute angles and four obtuse angles. The measure of one of the acute angles is (7x - 410) degrees. The sum of the measures of one of the acute angles and three of the obtuse angles is (-14x + w) degrees. What is the value of w?",
    correctAnswer: "1360", section: "math",
  },
  {
    id: "mock2-math-42", module: 2, questionNumber: 20, type: "mcq", difficulty: "medium",
    stem: "The table summarizes the distribution of age and assigned group for 90 participants in a study. One of these participants will be selected at random. What is the probability of selecting a participant from group A, given that the participant is at least 10 years of age?",
    imageUrl: "/visuals/q42.png", imageAlt: "Table of age and group distribution",
    choices: [
      { label: "A", text: "1/6" },
      { label: "B", text: "1/4" },
      { label: "C", text: "11/30" },
      { label: "D", text: "1/2" },
    ],
    correctAnswer: "B", section: "math",
  },
  {
    id: "mock2-math-43", module: 2, questionNumber: 21, type: "mcq", difficulty: "medium",
    stem: "A circle in the xy-plane has its center at (2, 9). Line t is tangent to this circle at the point (a, -4), where a is a constant. The slope of line t is 6/5. What is the value of a?",
    choices: [
      { label: "A", text: "-68/5" },
      { label: "B", text: "-53/6" },
      { label: "C", text: "77/6" },
      { label: "D", text: "88/5" },
    ],
    correctAnswer: "D", section: "math",
  },
  {
    id: "mock2-math-44", module: 2, questionNumber: 22, type: "gridin", difficulty: "medium",
    stem: "-x^2 + bx - 49 = 0. In the given equation, b is an integer. The equation has no real solution. What is the least possible value of b?",
    correctAnswer: "-13", section: "math",
  },
];

export const mock2MathM1: Question[] = mock2MathModule1;
export const mock2MathM2e: Question[] = mock2MathModule2;
export const mock2MathM2h: Question[] = mock2MathModule2;
