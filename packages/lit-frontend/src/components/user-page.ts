import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./user-login-signup";
import resetCSS from "/src/styles/reset.css?inline";
import pageCSS from "/src/styles/page.css?inline";



@customElement('user-page')
  export class UserPage extends LitElement { 
  
    static properties = {
        isSignup: {type: Boolean}
    };
    isSignup = false;
   
     
    
  
      render() {
        return html`
          <main class="page">
            ${this.isSignup
              ? html`
                  <user-signup>
                  </user-signup>
                  <p><a @click=${() => {this.isSignup = false;}}>Click here</a> to login</p>
                `
              : html`
                  <user-login></user-login> 
                  <p>Don't have an account?  <a @click=${() => {this.isSignup = true;}}>Click here</a> to signup</p>
                `}
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
        `
      ];

  }