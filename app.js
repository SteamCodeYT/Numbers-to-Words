$(document).ready(function(){
    var form = $("#form");
    
    //the upper limit for the number
    var numLimit = 1000000000000;

    //the final text result of the number
    var numText = "";

    //dictionaries that stores basic numeric values
    var ones = {
        0: "zero",
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine"
    }

    var tens = {
        10: "ten",
        11: "eleven",
        12: "twelve",
        13: "thirteen",
        14: "fourteen",
        15: "fifteen",
        16: "sixteen",
        17: "seventeen",
        18: "eighteen",
        19: "nineteen" 
    }

    var prefixes = {
        2: "twenty",
        3: "thirty",
        4: "forty",
        5: "fifty",
        6: "sixty",
        7: "seventy",
        8: "eighty",
        9: "ninety"
    }

    var suffixes = {
        1: "",
        2: "thousand ",
        3: "million ",
        4: "billion ",
        5: "trillion"
    }

    //when the user submits the form, do what is 
    //in the function
    form.submit(function(e){
        //prevents the auto-submission of the form
        e.preventDefault();

        //reset numText
        numText = "";        
        
        //get the value of the number the user submits
        var num = $("#numInput").val();

        //get the final text representation of the number
        var finalNumText = convertNum(num);

        //put this number on the page
        $("#changedNum").html("Converted Number: " + finalNumText);
    });

    /**
     * 
     * @param {The number to be converted} num 
     * @returns The text representation of num
     */
    function convertNum(num){
        var absNum = Math.abs(num);

        //test whether the number is in ones
        try {
            //if num is bigger than the limit, throw error
            if(num > numLimit){
                throw "Number is too big. It must be below or equal to " + numLimit + " (1 Trillion)";
            } 
        }
        catch(err){
            alert(err);
            return "ERROR";
        }

        //check whether num is negative
        if(num.toString().includes("-") && absNum != 0){
            numText += "negative "
        }
        
        
        //if the absolute value of num is in ones
        //  add its corresponding value to numText
        if(absNum in ones){
            numText += ones[absNum];
        }else if(absNum < 100){
            numText += twoDigitOrLessConvert(absNum);
        }else{
            //Split number into arrays that have a maximum length of
            //  three and get the result
            var numArray = splitNum(absNum);
            //The count represents the suffix that will be added to each 
            //  three-digit group (thousands, millions, billions, etc.)
            let count = numArray.length;

            //convert the number groups and add their suffixes
            for(i = 0; i < numArray.length; i++){
                console.log("i = " + i + "  length=" + numArray[i].length + "  num[i]=" + numArray[i])
                //go to proper converter depending on number of digits in array
                //  if array is not filled with 0's
                if(numArray[i][0] !== "000"){
                    //numArray[i][0] represents the string value of the 3-digit-or-less block
                    if(numArray[i][0].length == 3){
                        numText += threeDigitConvert(parseInt(numArray[i]));
                        numText += " " + suffixes[count];
                    }else{
                        numText += twoDigitOrLessConvert(parseInt(numArray[i]));
                        numText += " " + suffixes[count] + " ";
                    }
                    //count needs to decrease to go to the suffix that is directly 
                    //  beneath it. (eg. billions to millions to thousands)
                    count--;
                }else{
                    count--;
                }
                
            }
            //numText += threeDigitConvert(absNum);
        }
        
        return numText;
    }
    
    /**
     * This will convert any three digit number into text
     * @param {the number to convert} num 
     */
    function threeDigitConvert(num){
        var currentNumText = "";

        //if number is 3 zeroes, return nothing
        if(num == 0){
            return "";
        }

        
        //if number is less than 100, send it to the other converter
        if(num < 100){
            currentNumText += twoDigitOrLessConvert(num);
            return currentNumText;
        }

        //create the place of the number
        //  e.g two hundred, five thousand, seven million
        currentNumText += ones[num.toString().charAt(0)];
        currentNumText += " hundred ";

        //if the number ends with two zeros, don't add anything
        if(num.toString().substr(1) !== "00"){
            //get the last two digits and convert them back to an
            //  integer
            currentNumText += twoDigitOrLessConvert(parseInt(num.toString().substr(1)));
        }
        
        return currentNumText;
    }

    /**
     * This will convert any two digit number into text
     * @param {the number to convert} num 
     */
     function twoDigitOrLessConvert(num){
        var currentNumText = "";

        if(num < 10){
            return ones[num];
        }

        //if num is in ones
        //  add its corresponding value to numText
        if(num in tens){
            currentNumText += tens[num];
        }else{
            //use prefix to create any num 20-99
            currentNumText += prefixes[num.toString().charAt(0)];

            //if it does not end with 0, add the second digit
            if(num.toString().charAt(1) !== "0"){
                currentNumText += "-" + ones[num.toString().charAt(1)];
            }
        }

        return currentNumText;
    }

    //this will split number into arrays of three or less digits
    function splitNum(num){
        let numArray = [];
        var numString = num.toString();
        var count = 0;

        //tempArray is the array that we will be using to 
        //  break apart the full number
        var tempArray = [];

        //split num into array of single digits
        var singleDigits = numString.split("")
        console.log(singleDigits);

        //add these digits to array in groups of 3 or less
        var digits = singleDigits.length;
        for(var i = digits - 1; i >= 0; i--){
            //tempArray.unshift(singleDigits[i]);
            tempArray[0] = singleDigits[i] + tempArray[0];
            count++;

            //get rid of any undefined values that may pop up
            tempArray[0] = tempArray[0].replace("undefined", "");

            //if tempArray is filled, add it to the beginning
            //  of numArray and reset it
            if(count % 3 == 0){
                numArray.unshift(tempArray);
                tempArray = [];
            }
        }

        //Add whatever is left ot numArray
        if(tempArray.length != 0){
            numArray.unshift(tempArray);
        }

        console.log(numArray)
        return numArray;
    }
});