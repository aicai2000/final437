import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createContext, provide } from "@lit/context";
import {
  APIUser,
  AuthenticatedUser,
  FormDataRequest
} from "../rest";
export let authContext = createContext<APIUser>("auth");

type UserLoginLocation = Location & {
    params: { signup: string };
    searchParams: Map<string, string>;
  };


@customElement('user-login')
export class UserLogin extends LitElement { 

    @property({ attribute: false })
    location?: UserLoginLocation;

    @property({ reflect: true })
    get signup() {
      return this.location?.params.signup;
    }
  
    @state()
    loginStatus: number = 0;
  
    @provide({ context: authContext })
    @state()
    user: APIUser =
      AuthenticatedUser.authenticateFromLocalStorage(() =>
        this._signOut()
      );
  
    render() {
        return html`
        <div id="content">
          <form
          @submit=${this._handleLogin}
          @change=${() => (this.loginStatus = 0)}>
          <h2>Please Login</h2>
          <label>
            <span>Username</span>
            <input name="username" />
          </label>
          <label>
            <span>Password</span>
            <input type="password" name="password" />
          </label>
          <button type="submit">Sign in</button>
          <p
            >${this.loginStatus
              ? `Login failed: ${this.loginStatus}`
              : ""}</p
          >
        </form>
       
        </div>
        `;
      }

      static styles = css`
        :host {
        display: contents;
        }
        dialog {
        display: flex;
        gap: 4rem;
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
            padding: 48px;
            font-family: sans-serif;
        }
    `;

      _handleLogin(event: SubmitEvent) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const data = new FormData(form);
        const request = new FormDataRequest(data);

        request
          .base()
          .post("/login")
          .then((res) => {
            if (res.status === 200) {
              return res.json();
            } else {
              this.loginStatus = res.status;
            }
          })
          .then((json) => {
            if (json) {
              console.log("Authentication:", json.token);
              this.user = AuthenticatedUser.authenticate(
                json.token,
                () => this._signOut()
              );
              //this._toggleDialog(false);
              this.requestUpdate();
            }
          });
      }

      _signOut() {
        this.user = APIUser.deauthenticate(this.user);
        //this._toggleDialog(!this.isAuthenticated());
        document.location.reload();
      }

}

@customElement('user-signup')
export class UserSignup extends LitElement { 
  @state()
  signupStatus: number = 0;

  render() {
    return html`
    <div id="content">
      <form
      @submit=${this._handleSignup}
      @change=${() => (this.signupStatus = 0)}>
      <h2>Fill in the fields to signup</h2>
      <label>
        <span>Username</span>
        <input name="username" />
      </label>
      <label>
        <span>Password</span>
        <input type="password" name="password" />
      </label>
      <label>
        <span>First Name</span>
        <input name="firstname" />
      </label>
      <label>
        <span>Last Name</span>
        <input name="lastname" />
      </label>
      <button type="submit">Submit</button>
      <p
        >${this.signupStatus
          ? `Signup failed: ${this.signupStatus}`
          : ""}</p
      >
    </form>

    </div>
    `;
  }
  static styles = css`
    :host {
    display: contents;
    }
    dialog {
    display: flex;
    gap: 4rem;
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
        padding: 48px;
        font-family: sans-serif;
    }
`;
_handleSignup(event: SubmitEvent) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const data = new FormData(form);
  const request = new FormDataRequest(data);

  request
    .base()
    .post("/signup")
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        this.signupStatus = res.status;
      }
    })
    .then((json) => {
      console.log("Signup:", json);
    });
}

}