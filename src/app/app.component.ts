import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styles: [
    `
      input {
        width: 20vw;
        margin: 10px 10px 20px 10px;
      }
      span, label {
        margin-left: 10px;
      }
      video {
        width: 640px;
        height: 360px;
      }
    `,
  ],
})
export class AppComponent {
  baseURL: string = "https://api.lbry.tv/api/v1/proxy";
  streamUrl: string;

  constructor(private http: HttpClient) {
    this.streamUrl = "";
  }

  resolveUriAndSetStreamSrc(uri: string) {
    if (uri) {
      this.http
        .post<any>(this.baseURL, {
          method: "resolve",
          params: { urls: uri },
        })
        .subscribe({
          next: (data) => {
            if (uri in data.result) {
              const result = data.result[uri];
              if ("error" in result) {
                console.error("Error when resolving URI!", result.error.text);
              } else if (result?.value?.stream_type != "video") {
                console.error(
                  "URI don't resolve to a video!",
                  result?.value?.stream_type
                );
              } else {
                const confirmedUri: string = result.short_url.substring(
                  result.short_url.indexOf("lbry://")
                );
                this.http
                  .post<any>(this.baseURL, {
                    method: "get",
                    params: {
                      uri: confirmedUri,
                      save_file: false,
                    },
                  })
                  .subscribe((data) => {
                    this.streamUrl = data?.result?.streaming_url;
                    console.log("Stream URL = ", this.streamUrl);
                  });
              }
            }
          },
          error: (error) => {
            console.error("There was an error!", error);
          },
        });
    }
  }
}
