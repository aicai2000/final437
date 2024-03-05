
import {LitElement, css, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import { serverPath } from "../rest";
import { Note } from '../models/Note';

// type Note = {
//     _id: string;
//     username: string;
//     text: string;
//     createDate: Date;
// }


@customElement('note-list')
export class NoteList extends LitElement {
    private sort = 1;
    
    @property()
    username: string = "";

    static properties = {
        notes: {type: Array<Note>}
    };
    notes = Array<Note>();

    render() {
    return html`
            <h2>
                Notes for ${this.username ? `${this.username}` : "all users"}
            </h2>
            <div class="grid">
                <span><strong></strong></span>
                <span><strong>Created By</strong></span>
                <span><strong>Note</strong></span>
                <span><strong>Created Datetime</strong></span>

                ${repeat(this.notes, (note) => note._id, (note, index) => html`
                    <span>${index}</span>
                    <span><a @click=${() => this._getNotesByUser(note.username) }>${note.username}</a></span>
                    <span>${note.text}</span>
                    <span>${note.createDate.toLocaleString()}</span>
                `)}
            </div>

            <button @click=${this.toggleSort}>Sort Notes</button>

            ${this.username
                ? html`
                    <button @click=${this._getAllNotes}>Show All Notes</button>
                    `
                : html` `
            }
        </div>
    `;
    }
    static styles = css`
        :host {
        display: contents;
        }
    
        form {
        display: grid;
        grid-template-columns: [start] 1fr 2fr [end];
        align-items: baseline;
        }
        form > label {
        display: contents;
        }
        form > h2 {
        grid-column: start / end;
        text-align: center;
        }
        input,
        button {
        font: inherit;
        line-height: inherit;
        margin: 0.25em;
        }
        button {
        grid-column: 2;
        }
        #content {
            font-family: sans-serif;
            justify-content: center;
            margin: auto;
        }

        .grid {
            display: grid;
            grid-template-columns: 2em 1fr 3fr 1fr;
            border-top: 1px solid black;
            border-right: 1px solid black;
        }

        .grid > span {
            padding: 8px 4px;
            border-left: 1px solid black;
            border-bottom: 1px solid black;
        }
    `;


    private toggleSort() {
        this.sort *= -1;
        this.notes = [...this.notes.sort((a, b) =>
            this.sort * (a.username.localeCompare(b.username) ||
            a._id.localeCompare(b._id)))];
    }

    connectedCallback() {
        console.log("connectedCallback")
        this._fetchData()
        super.connectedCallback();
      }
    
    _getNotesByUser(selectedUser: string){
        if (this.username != selectedUser)
        {
            this.username = selectedUser;
            this._fetchData();
        }
    }  
    _getAllNotes(){
        if (this.username){
            this.username = "";
            this._fetchData();
        }
    }  
    _fetchData() {
        const path = this.username ? `/notes/${this.username}` : "/notes"
        fetch(serverPath(path))
        .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
        })
        .then((data: Array<Note>) => {
            console.log(data)
            this.notes = data;
        });
    }
}