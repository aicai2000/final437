import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import "../components/user-login-signup";
import resetCSS from "/src/styles/reset.css?inline";
import pageCSS from "/src/styles/page.css?inline";
import {UserLoggedInEvent} from "../components/user-login-signup";


@customElement('user-page')
  export class UserPage extends LitElement { 
  
    static properties = {
        isSignup: {type: Boolean}
    };
    isSignup = false;    
  
      render() {
        return html`
          <main class="page">
            <div class="userContent">
            ${this.isSignup
              ? html`
                  <user-signup @myLoggedIn=${this._handleLoggedIn}>
                  </user-signup>
                  <p><a @click=${() => {this.isSignup = false;}}>Click here</a> to login</p>
                `
              : html`
                  <user-login @myLoggedIn=${this._handleLoggedIn}></user-login> 
                  <p>Don't have an account?  <a @click=${() => {this.isSignup = true;}}>Click here</a> to signup</p>
                `}
                </div>
          </main>
        `;
      }

      static styles = [
        unsafeCSS(resetCSS),
        unsafeCSS(pageCSS),
        css`
          :host {
            display: contents;
          }
        `,
        css`
         .userContent {
            width:30em;
            font-family: sans-serif;
            justify-content: center;
            margin: auto;
        }
        a {cursor: pointer;}
        `
      ];

      private _handleLoggedIn(e: CustomEvent<UserLoggedInEvent>) {
        const detail: UserLoggedInEvent = e.detail;
        console.log("user-page, myLoggedIn", detail);
        this.requestUpdate();

        // send an event to user-page container
        const event = new CustomEvent<UserLoggedInEvent>("myLoggedIn", {
          detail: {
            myUsername: detail.myUsername
          }
        });
        this.dispatchEvent(event);
      }
  }