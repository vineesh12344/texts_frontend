import './style.css'
import { setupCounter } from './counter.ts'
import { createIncomingMsg, createOutgoingMsg, getTextBar} from './components.ts'
import { getTexts } from './db.ts'


async function main() {
    const texts = await getTexts();
    return `
    <div class="--dark-theme" id="chat">
        <div class="chat__conversation-board">
            ${texts.map(text => text.person != "Vineesh Nimmagadda" ? createIncomingMsg(text.text_body) : createOutgoingMsg(text.text_body)).join('')}
        </div>
        ${getTextBar()}
    </div>
    `
}
console.log(await main())
document.querySelector<HTMLDivElement>('#app')!.innerHTML = await main()

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
// <div class="--dark-theme" id="chat">
//     <div class="chat__conversation-board">
//         ${createIncomingMsg("Somewhere stored deep, deep in my memory banks is the phrase &quot;It really whips the llama's ass&quot;.")}
//         ${createOutgoingMsg("Winamp's still an essential.")}
//         ${createOutgoingMsg("I'm sorry, Dave. I'm afraid I can't do that.")}
//         ${createIncomingMsg("I'm sorry, Dave. I'm afraid I can't do that.")}
//     </div>
//     ${getTextBar()}
// </div>
// `

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
