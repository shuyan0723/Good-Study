function flatArray(arr){
    let result=[];
    for(let i=0;i<arr.length;i++){
        if(Array.isArray(arr[i])){
           result.push(...flatArray(arr[i]))
        }
        else {
            result.push(arr[i])
        }
    }
    return result;
}

let Array1=[1,2,[3,4,5,[6,7]]];
let flatedArray=flatArray(Array1)
console.log(flatedArray);
