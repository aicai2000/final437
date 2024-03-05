import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./notes-list";
import resetCSS from "/src/styles/reset.css?inline";
import pageCSS from "/src/styles/page.css?inline";

@customElement('notes-page')
  export class NotesPage extends LitElement { 
  
    static properties = {
        hasUsername: {type: Boolean}
    };
    hasUsername = false;
     
      render() {
        return html`
          <main class="page">
            <div class="notesContent">
                
            ${this.hasUsername
              ? html`
                  <note-list username="emuone">
                  </note-list>
                `
              : html`
                  <note-list></note-list> 
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
         .notesContent {
            width:40em;
            font-family: sans-serif;
            justify-content: center;
            margin: auto;
        }
        `
      ];    

  }