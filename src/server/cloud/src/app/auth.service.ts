import { Injectable } from '@angular/core';
import * as Msal from 'msal/dist/msal';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: any = {
    clientId: "70da46a1-aa1c-4c23-86d5-15a047c09909",
    authority: "https://login.microsoftonline.com/33d8cf3c-2f14-48c0-9ad6-5d2825533673"
  }

  private cache: any = {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }

  private config = {
    auth: this.auth
  }

  private requestObj = {
    scopes: ["user.read"]
  };

  private msal: Msal;

  constructor(private dataService: DataService) {
    this.msal = new Msal.UserAgentApplication(this.config);
  }

  signIn() {
    this.msal.loginPopup(this.requestObj).then((loginResponse) => {
      // console.log('You are logged in');
      // console.log(loginResponse);
      this.acquireTokenPopupAndCallMSGraph()
    }).catch(function (error) {
        console.log(error);
    });
  }

  acquireTokenPopupAndCallMSGraph() {
    this.msal.acquireTokenSilent(this.requestObj).then((tokenResponse) => {
        this.callMSGraph("https://graph.microsoft.com/v1.0/me", tokenResponse.accessToken);
    });
  }
  
  callMSGraph(theUrl, accessToken) {
    this.dataService.postAuthToken(accessToken).subscribe(data => {
      console.log(data);
    })
    // fetch(theUrl, {
    //   headers:{
    //     'Authorization': 'Bearer ' + accessToken
    //   }
    // }).then(data => data.json()).then(data => console.log(data))
  }
}
