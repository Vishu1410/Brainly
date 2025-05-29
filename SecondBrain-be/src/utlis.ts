export function random(len:number){
    const options = "abcdefghijklmnopqrstuvwxyz1234567890";
    let string = "";
    for(let i=0;i<len;i++){
        string+=options[Math.floor((Math.random()*len))];
    }
    return string;
}