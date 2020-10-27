import * as firebase from 'firebase'

export interface Course {
    courseId: string
    created_at: firebase.firestore.Timestamp
    price: number
    title: string
    prod_id: string
    file_ref: string
    image_ref: string
    owned_by: firebase.firestore.FieldValue
}