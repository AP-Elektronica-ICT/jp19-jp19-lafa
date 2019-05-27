import { Injectable } from '@angular/core';
import * as Msal from 'msal/dist/msal';
import { DataService } from './data.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private config = {
    auth: {
      clientId: "70da46a1-aa1c-4c23-86d5-15a047c09909",
      authority: "https://login.microsoftonline.com/33d8cf3c-2f14-48c0-9ad6-5d2825533673"
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  }

  private requestObj = {
    scopes: ["user.read"]
  };

  private msal: Msal;

  constructor(private dataService: DataService, private router: Router) {
    this.msal = new Msal.UserAgentApplication(this.config);
  }

  signIn() {
    this.msal.loginPopup(this.requestObj).then((loginResponse) => {
      this.acquireTokenAndAuthenticateAPI()
    }).catch(function (error) {
      console.log(error);
    });
  }

  acquireTokenAndAuthenticateAPI() {
    this.msal.acquireTokenSilent(this.requestObj).then((tokenResponse) => {
      this.dataService.postAuthToken(tokenResponse.accessToken).subscribe(user => {
        // Handle auth
        this.router.navigate(["nodes"]);
      })
    });
  }
}

export interface MSALUser {
  displayName: string,
  givenName: string,
  id: string,
  mail: string,
  surname: string,
  userPrincipalName: string
}