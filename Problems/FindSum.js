/*
Given a list of numbers and a number k, return whether any two numbers from the list add up to k.

For example, given [10, 15, 3, 7] and k of 17, return true since 10 + 7 is 17.

Bonus: Can you do this in one pass?
*/

function FindSum(arr, target) {
    if(!arr || arr.length <= 0) return null;
    let count = 0;
    let prevVals = []
    while( count < arr.length) {
        const lookUpVal = target - arr[count];
        if(prevVals.includes(lookUpVal)) return [lookUpVal, arr[count]];
        prevVals.push(arr[count]);
        count++;
    }
}