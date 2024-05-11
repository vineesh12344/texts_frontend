import axios from 'axios';
import { UUID } from 'crypto';

let API_URL = "http://localhost:3000"

interface Text {
    date : Date,
    text_body : string,
    person : string,
    id : UUID,
    order : number
}

export async function getTexts(cursor? : string, take : number = 10) {
    let request_url = cursor ? `${API_URL}/texts?cursor=${cursor}&take=${take}` : `${API_URL}/texts?take=${take}`
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
