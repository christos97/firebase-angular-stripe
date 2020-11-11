import 'firebase/firestore'

export interface Course {
    course_id: string
    created_at: firebase.firestore.Timestamp
    price: number
    title: string
    bio: string
    file_ref: string
    image_ref: string
    owned_by: firebase.firestore.FieldValue
    times_bought?: firebase.firestore.FieldValue
}
