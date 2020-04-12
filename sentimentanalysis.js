var videoId = document.getElementsByTagName('ytd-watch-flexy')[0].videoId

var AddButton = function(){
  var bt = document.createElement('button');
  bt.innerHTML = 'ANALISAR SENTIMENTO';
  bt.onclick = function score(){ pega2()}
  // where do we want to have the button to appear?
  // you can append it to another element just by doing something like
  // document.getElementById('foobutton').appendChild(button);
  document.getElementsByClassName('ytd-video-primary-info-renderer')[0].appendChild(bt)
};
AddButton()

async function sentimentAnalysis (content){
    try {
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"document":{"type":"PLAIN_TEXT","language": 'pt',"content":content},"encodingType": "UTF8"})
    }
    const response = await fetch('https://language.googleapis.com/v1/documents:analyzeSentiment?key={ your key }', config)
    //const json = await response.json()
    if (response.ok) {
        //return json
        var j = await response.json()
        var score = await j.documentSentiment.score
        var magnitude = j.documentSentiment.magnitude
        // console.log(score)
        // console.log(magnitude)
        return score
    } else {
        //
    }
} catch (error) {
        //
}

}

async function pega2(){
    var scores = [] 
    var magnitude = []
    var res = await fetch('https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId='+videoId+'&key={ your key }');
    var j = await res.json();
    var items = j.items
    console.log(items)
    // items.forEach(element => 
    for (var x in items){
        var comment = items[x].snippet.topLevelComment.snippet.textDisplay
        var cleanComment = comment.replace(/(<([^>]+)>)/ig, '')
        console.log(cleanComment)
        var sentiment =  await sentimentAnalysis(cleanComment);
        console.log(sentiment)
        scores.push(sentiment)
    }
    console.log("Média Final")
    let sum = scores.reduce((previous, current) => current += previous);
    let avg = sum / scores.length;
    console.log(avg)
    alert('Sentimento desse vídeo é: ' + avg)
    return avg

}
