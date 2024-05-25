import './style.css'
import { createIncomingMsg, createOutgoingMsg, getTextBar, loginComponent} from './components.ts'
import { getTexts, login } from './db.ts'


function main() {
    console.log('main')
    if( localStorage.getItem('loggedIn') === null) {
        document.querySelector<HTMLDivElement>('#app')!.innerHTML = loginComponent();
        document.querySelector<HTMLFormElement>('form')!.addEventListener('submit', (e) => {
            console.log('submit')
            e.preventDefault();
            const username = document.querySelector<HTMLInputElement>('#username')!.value;
            const password = document.querySelector<HTMLInputElement>('#password')!.value;
            login(username, password).then(token => {
                localStorage.setItem('loggedIn', 'true')
                localStorage.setItem('token', token)
                location.reload();
            }).catch(() => {
                alert('Invalid username or password');
            })
        });
    }else{
        getTexts().then(texts => {
            document.querySelector<HTMLDivElement>('#app')!.innerHTML =  `
            <div class="--dark-theme" id="chat">
                <div class="chat__conversation-board">
                    ${texts.map(text => text.person != "Vineesh Nimmagadda" ? createIncomingMsg(text.text_body) : createOutgoingMsg(text.text_body)).join('')}
                </div>
                ${getTextBar()}
            </div>
            `;
        });
    }
}

main()
