
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { LogLevel, Configuration, BrowserCacheLocation, PublicClientApplication, IPublicClientApplication, InteractionType } from '@azure/msal-browser';
import configData from '../../assets/config/config.json';
const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;


export const msalConfig: Configuration = {
    auth: {
        clientId: configData.clientId,
        authority: configData.authority,
        redirectUri: configData.redirectUrl,
        postLogoutRedirectUri: configData.redirectUrl,
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: isIE, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback(logLevel: LogLevel, message: string) {
                console.log(message);
            },
            logLevel: LogLevel.Verbose,
            piiLoggingEnabled: false
        }
    }
}
export const protectedResources = {
    apiResource: {
        endpoint: configData.endpoint,//secure web api url
        scopes: configData.scopes//azure expose api url
        //https://10.101.2.133:80/
        //"https://localhost:7049/"

    },
    graphMe: {
        endpoint: 'https://graph.microsoft.com/v1.0/me',
        scopes: ['User.Read'],
    },
    graphContacts: {
        endpoint: 'https://graph.microsoft.com/v1.0/me/contacts',
        scopes: ['Contacts.Read'],
    },
    graphPhoto: {
        endpoint: 'https://graph.microsoft.com/v1.0/me/photo/$value',
        scopes: ['User.Read'],
    },
    graphReadAllUsers:
    {
        endpoint: 'https://graph.microsoft.com/v1.0/users',
        scopes: ['User.Read.All'],

    }

}
export function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication(msalConfig);
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    return {
        interactionType: InteractionType.Redirect, //you can use redirect/popup to open login screen
    };
}
//configure interceptor 
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const protectedResourceMap = new Map<string,
        Array<string>>();
    protectedResourceMap.set(protectedResources.apiResource.endpoint, protectedResources.apiResource.scopes);
    return {
        interactionType: InteractionType.Redirect,
        protectedResourceMap
    }
}