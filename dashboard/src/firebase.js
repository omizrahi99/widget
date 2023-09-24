// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  "type": "service_account",
  "projectId": "widget-bcaa0",
  "private_key_id": "0d566e1a58f13b35635f6df88dc906acc23ce960",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCnH8azmMZ6z2u7\n7j2xXlE9K377k2i2+Q68xfxoyUkmJlMABdumXSooBdtP0g8eJAh5Kiw+sKFCIOdP\nqZh7D2EmZoe430nntRTKNh0Hzt8bdKVIyEp7XPnvwuB9aid/xd8jk78Zk4Uo4qek\nJF5Umq+vLZMDRnW8tb5ms5TP6bRxJKuxymz1w172BxkgHn7+OM/GXf9Yz+RsACIC\nbBQ9cIcezzW2/p41Pk0JjgB/mxEvWRCHZzHr/Z6FK0511rMDyxNfhOkZj93wDWmE\nM5dfQt8PTs8VC6HJMSHPH+K6HHDr93LfVTiI7EyDEtgKVtniO3yqB0dZ44BPd6lT\nd7JAEUCFAgMBAAECggEAB4/vCFJp7MW0/Mh/fyai628r7EtTyi/D5HPbA4zUJAdI\n6y/YrBL8JNp6/YYmS/labs0jOmT4rwrZHKgyb6MXBMtP6eQkrnjpq2q+bouEWfQx\nxHTXtfRTlO9PBC3JAsWb3rrBQ3GC7YIwDsPchtyHBZi81cGa80KQDoqiubO8CACL\napXUNHvbcCZzd6Utdn6CB5mIZ2nzDAkUk7EVZTNAw8+ydhJ3sjDtskz4XvyuVQ7K\nPnrXFzhT/Xex5nVNN8yXOuEd79r1LWZSJcaTkMhV7R1G1AUrEo7+KSBHSHa1u973\na0TxSBeWMIN9eHmEzRm+Xl8XmByH6EGB5OA9Q9J3YQKBgQDrOFCiVVSpxPQmc/H4\nPO4JhUz9GPMgndY87yYfv9jxxvLFE1qLVhDFzZU4co3ptm6m6xvHXl9JZikepJSk\nnOZJUnxUqJ8K1IUQ9CSG4PHjc+NiyZl8ZqLUs1JkzAKuuI+5v9oGeHH9FM7Id/Qm\nzga2wyfjBgGXa0wIBfshjNHn9QKBgQC142t6v4ElJ+7afjFZ794WfCa4L7BafSK4\nVbsBdUrBlGwQJYZPrMCuRuu7PDleZfTgBtBPI7QRi6JKOFBfBZPbJWQD2O35GnQk\nPaQpzJRXopEyFdZy7ex2yzj5yX+8XedJvfHYq7QUzoECJrHWNA59dt4vscBTyAkW\nMsHUau3sUQKBgQCd4bXV0Dq8nRNXwBlZCuSnhU7Qz29ZpDfJvKe1RdtDJcuL1lq/\nDazCaCRRuCpjBe2toj+KCWEh7i2JgOS4vQuhiXkkhe4CofUTFRxzYAdcKUwl4bVh\nF68R369dMsZWKlFmV0zrbOrt+Yp2anV5mm5NPB7Ith5ZWU62T/VpZpD6BQKBgG1z\nncCurrs6LXxjhbUWJ7GmIfKiF+BL/vGn/TFicIrOkrygqBMX5Ja67K2uDuOkPNf2\nobGNzZTlTtKU0qBrjc7I0EeUaZeF+K+6PCg/CGE33WGjTHm6fJn7rpx5SZmDdGOm\nnnsA0AvZPD6cJFW+251aQ1e2AgMok3c9MfBuLCARAoGALrjK4HNOo5fReICzKEDJ\n9I7Kuplub35giyfIlaSu5fVFP6H1UWmymFJtpnthtmw20FSbvSTtF2Zb+MRuzIyt\nqoJoTufYf3dBbgzi4Sg7pzXuowA5rn+iw7NSUAkd15ewUYTlUPu/UoAFwnH1g/PO\noS17Jq+YGREoeT+aM/cT8Gw=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-aywmg@widget-bcaa0.iam.gserviceaccount.com",
  "client_id": "100132660480639860991",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-aywmg%40widget-bcaa0.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

// Initialize Firebase

const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);