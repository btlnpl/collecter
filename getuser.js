function publish(kinesis, uid, url){
    console.log(uid)
    const record = {
        Data: JSON.stringify({
            uid: uid,
            url: url,
            t: Date.now(),
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

try {
    loadJs("https://cdnjs.cloudflare.com/ajax/libs/aws-sdk/2.490.0/aws-sdk.min.js").then(res => {
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: "us-east-1:811ad0aa-0195-446d-b72d-d98a189456b5",
        });
        AWS.config.region = "us-east-1";

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

                while (true) {
                    if (td.kinesis != null){
                        publish(td.kinesis, td.uid ,document.URL)
                        break
                    }
                }
            })
        });

    });


} catch(error) {
    console.log(error)
}
