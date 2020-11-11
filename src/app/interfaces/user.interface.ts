export interface User {
  uid: string
  email: string
  photoURL?: string
  displayName?: string
  cus_id?: string
  amount_spent?: firebase.firestore.FieldValue
  status?: string
  itemId?: string
}
