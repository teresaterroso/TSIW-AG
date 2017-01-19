//
// GET twitter feed from Twitter API (https://dev.twitter.com/))
// using Codebird ()
//

var cb = new Codebird;

cb.setConsumerKey(twitterConsumerKey, twitterConsumerKeySecret);
cb.setToken(twitterAccessToken, twitterAccessTokenSecret);

cb.__call(
    "statuses_userTimeline",
    "screen_name=pporto_esmad&count=3&tweet_mode=extended&exclude_replies=true&include_rts=false",
    function (res) {
        let tweets = res; // array of tweets

        for (var i = 0; i < tweets.length; i++) {
            let tweet = tweets[i].full_text;
            let shortlink = tweet.lastIndexOf("https://t.co");
            tweet = tweet.substring(0, shortlink);
            $("#tweets").append("<div class='tweet'><span>" + linkify(tweet) + "</span></div>");
        }
    },
    true // this parameter is required
);

//  helper function: add anchor tags for links in string
function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}