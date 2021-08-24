# Dashsee POC

## Getting Started
- `npm ci`
- `npm start`

## Live Demo
- Via [Stackblitz](https://stackblitz.com/github/wizlee/dashsee-poc)

## Running unit tests
To keep the code as minimal as possible, this project is generated without any tests

# Conclusion

- Not viable to only use https://api.lbry.tv/api/v1/proxy
  - A backend server is needed.
  - [Good overview for setting up a LBRY backend](https://odysee.com/@globglob:6/lbry-wallet-debug:1)
- Additional information on why the conclusion above is reached
  - [This code from the LBRY API shows what API can be called without a wallet ID](https://github.com/lbryio/odysee-api/blob/master/app/query/const.go)
  - [This is an example in the current Odysee that performs the authentication](https://github.com/lbryio/lbry-desktop/blob/master/ui/page/signInVerify/view.jsx#L78), it uses a common module called [lbryinc](https://github.com/lbryio/lbryinc) to handle the common API calls between `lbry-desktop` and `lbry-android`.
  - A list of all the APIs that are tested to throughout this POC
    ```http
    #----------------------
    # References:
    # https://github.com/accumulator/plugin.video.lbry/blob/main/resources/lib/plugin.py
    # https://lbry.tech/api/sdk#claim_search
    # https://github.com/lbryio/lbry-sdk/blob/master/lbry/extras/daemon/daemon.py
    # https://github.com/lbryio/lbry-sdk/blob/master/lbry/conf.py
    # This contains a list of what can be called without a wallet ID -> https://github.com/lbryio/odysee-api/blob/master/app/query/const.go
    #----------------------

    # This first example is to resolve claim(s)
    # Example:
    # dev-c++-2018:e
    # mylifevlog6#ce8a17dd823064fc77fefbf816f01356ebbb2dec
    POST https://api.lbry.tv/api/v1/proxy HTTP/1.1
    content-type: application/json

    {
        "method": "resolve",
        "params": {"urls": "dev-c++-2018:e"}
    }

    ###

    # Get URL for an image
    POST https://api.lbry.tv/api/v1/proxy HTTP/1.1
    content-type: application/json

    {
        "method": "get",
        "params": {
          "uri": "mylifevlog6#ce8a17dd823064fc77fefbf816f01356ebbb2dec",
          "save_file": false
        }
    }

    ###

    # Get stream URL
    # Example URIs:
    # dev-c++-2018#e783b5106e2bcf896afd55e18667db6f6b8c6545
    # crypto-crash-bull-market-is-around-the#9eb963575f7cc780b376356b1a2e6c1bc10de9a8
    POST https://api.lbry.tv/api/v1/proxy HTTP/1.1
    content-type: application/json

    {
        "method": "get",
        "params": {
          "uri": "dev-c++-2018:e",
          "save_file": false
        }
    }

    ###

    # Query for recent content
    POST https://api.lbry.tv/api/v1/proxy HTTP/1.1
    content-type: application/json

    {
        "method": "claim_search",
        "params": {
          "page": 0,
          "page_size": 20,
          "order_by": "release_time",
          "stream_types": "video"
        }
    }


    ###

    # Query for categories
    # Reference:
    # https://github.com/lbryio/odysee-api/blob/dc9e97685c8dee93fff91501bea7d6053a6a47b2/app/query/query_test.go#L32
    # [
    #         "art", "automotive", "blockchain",
    #         "comedy", "economics", "education",
    #         "gaming", "music", "news",
    #         "science", "sports", "technology",
    # ]
    POST https://api.lbry.tv/api/v1/proxy HTTP/1.1
    content-type: application/json

    {
        "method": "claim_search",
        "params": {
          "any_tags": "tech"
        }
    }

    ###

    # Example from useful unmerge PR
    # Reference:
    # https://github.com/accumulator/plugin.video.lbry/pull/10/files
    POST https://api.lbry.tv/api/v1/proxy HTTP/1.1
    content-type: application/json

    {
        "method": "channel_list",
        "params": {
          "page": 1
        }
    }

    ###

    # Retrieve comment list
    # Example from the same useful PR above
    # Video example: LBRY-Future#bb454c6cb6d4f4fc9bfbd393bc5397f04f1262e4
    # LBRY URL: lbry://LBRY-Future#bb454c6cb6d4f4fc9bfbd393bc5397f04f1262e4
    # Further research: Comment reaction -> comment_react_list
    POST https://api.lbry.tv/api/v1/proxy HTTP/1.1
    content-type: application/json

    {
        "method": "comment_list",
        "params": {
          "include_replies" : true,
          "visible" : false,
          "hidden" : false,
          "page" : 1,
          "claim_id" : "bb454c6cb6d4f4fc9bfbd393bc5397f04f1262e4",
          "page_size" : 50
        }
    }

    ###

    # Get API server version / status
    POST https://api.lbry.tv/api/v1/proxy HTTP/1.1
    content-type: application/json

    {
        "method": "status",
        "params": {}
    }

    ###

    # Create Wallet
    POST https://api.lbry.tv/api/v1/proxy HTTP/1.1
    content-type: application/json

    {
        "method": "wallet_create",
        "params": {
          "wallet_id" : "dashsee-demo",
          "create_account" : true
        }
    }
    ```
