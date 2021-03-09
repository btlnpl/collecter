//data transfer
//unique_id
//session_time


function publish(kinesis, uid, url, action){
    const record = {
        Data: JSON.stringify({
            uid: uid,
            url: url,
            t: Date.now(),
            a: action,
            uk: td.unique
        }),
    };

    kinesis.putRecord(
        {
            Record: record,
            DeliveryStreamName: "clickstream",
        },
        function (err, data) {
            if (err) {
                console.error(err);
            }
        }
    );
}

class TrackData {
    uid = null
    udata = null
    kinesis = null
    unique = Math.random().toString(36).replace(/[^a-z0-9]+/g, '')
}



td = new TrackData()

function loadJs( url ){
    return new Promise(( resolve, reject ) => {
        if (document.querySelector( `head > script[ src = "${url}" ]`) !== null ){
            console.warn( `script already loaded: ${url}` );
            resolve();
        }
        const script = document.createElement( "script" );
        script.src = url;
        script.onload = resolve;
        script.onerror = function( reason ){
            // This can be useful for your error-handling code
            reason.message = `error trying to load script ${url}`;
            reject( reason );
        };
        document.head.appendChild( script );
    });
}

loadJs("https://cdnjs.cloudflare.com/ajax/libs/aws-sdk/2.490.0/aws-sdk.min.js").then(res => {
    console.log(res)
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:811ad0aa-0195-446d-b72d-d98a189456b5",
    });
    AWS.config.region = "us-east-1";

    try {
        AWS.config.credentials.get(function (err) {
            if (err) {
                console.log("Error retrieving credentials.");
                console.error(err);
                return;
            }

            loadJs("https://spinstatz.net/js/beaverbird.min.js").then(res => {

                td.kinesis = new AWS.Firehose({
                    apiVersion: '2015-08-04'
                });

                td.uid = BeaverBird.uid()

                while (true) {
                    if (td.kinesis != null){
                        publish(td.kinesis, td.uid ,document.URL, "start")
                        break
                    }
                }
            }).catch(err => {
                console.log(err)
            });
        });

    }catch (err){
        console.log(err)
    }
}).catch(err => {
    console.log(err.message)
});


window.onbeforeunload = function(){
    publish(td.kinesis, td.uid ,document.URL, "end")

};


document.addEventListener("visibilitychange", event => {
    if (document.visibilityState === "visible") {
        publish(td.kinesis, td.uid ,document.URL, "focus")
    } else {
        publish(td.kinesis, td.uid ,document.URL, "blur")
    }
})


