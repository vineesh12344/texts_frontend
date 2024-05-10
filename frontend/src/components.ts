export function createIncomingMsg(text : string) {
    let incoming_image = "/incoming.jpg"
    let nicknames = ["My cutiepie", "Peanut", "Couscous", "Hot stuff", "Amazing gf"]
    let nickname = nicknames[Math.floor(Math.random() * nicknames.length)]
    return `
    <div class="chat__conversation-board__message-container">
        <div class="chat__conversation-board__message__person">
            <div class="chat__conversation-board__message__person__avatar">
                <img src="${incoming_image}" alt="My bestest gf" />
            </div>
            <span class="chat__conversation-board__message__person__nickname">${nickname}</span>
        </div>
        <div class="chat__conversation-board__message__context">
            <div class="chat__conversation-board__message__bubble"> <span>${text}</span></div>
        </div>
    </div>
    `
}

export function createOutgoingMsg(text : string) {
    let outgoing_image = "/outgoing.jpg"
    return `
    <div class="chat__conversation-board__message-container reversed">
        <div class="chat__conversation-board__message__person">
            <div class="chat__conversation-board__message__person__avatar">
                <img src="${outgoing_image}" alt="Thomas Rogh" />
            </div>
            <span class="chat__conversation-board__message__person__nickname">Your amazing bf (hopefully)</span>
        </div>
        <div class="chat__conversation-board__message__context">
            <div class="chat__conversation-board__message__bubble"> 
                <span>${text}</span>
            </div>
        </div>
    </div>
    `
}

export function getTextBar(){
    return `
    <div class="chat__conversation-panel">
        <div class="chat__conversation-panel__container">
            <button class="chat__conversation-panel__button panel-item btn-icon add-file-button">
                <svg class="feather feather-plus sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <button class="chat__conversation-panel__button panel-item btn-icon emoji-button">
                <svg class="feather feather-smile sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
            </button>
            <input class="chat__conversation-panel__input panel-item" placeholder="Type a message..." />
            <button class="chat__conversation-panel__button panel-item btn-icon send-message-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    aria-hidden="true" data-reactid="1036">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </div>
    </div>
    `
}