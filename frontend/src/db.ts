import axios from 'axios';
import { UUID } from 'crypto';

let API_URL = import.meta.env.VITE_SERVER_URL

interface Text {
    date : Date,
    text_body : string,
    person : string,
    id : UUID,
    order : number
}

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

export async function login(username : string, password : string) {
    let request_url = `${API_URL}/login`
    try{
        let response = await axios.post(request_url, {username, password})
        if(response.status == 200){
            let token = response.data.token
            return token
        }else{
            console.error(response.status, response.statusText)
            throw new Error("Failed to login")
        }
    }catch (error) {
        console.error(error)
        throw new Error("Failed to login")
    }
}

export async function getTexts() {
    let request_url = `${API_URL}/texts`
    try{
        let response = await axios.get(request_url)
        if(response.status == 200){
            let texts = response.data
            let processed_texts : Text[] = texts.map((text : any) => ({
                date : new Date(text.date),
                text_body : text.text_body,
                person : text.person,
                id : text.id as UUID,
                order : Number(text.order)
            }))

            return processed_texts
        }else{
            console.error(response.status, response.statusText)
            throw new Error("Failed to fetch texts")
        }
    }catch (error) {
        console.error(error)
        throw new Error("Failed to fetch texts")
    }
}
