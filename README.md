# 📚 **Bookish**  
A dynamic platform for book lovers to explore, save, and purchase books with seamless external store integration. **Bookish** offers personalized libraries, advanced search filters, profile management, and multiple API integrations for an enhanced user experience.

---

## 🏗️ **Features**

### 🔍 **Search & Filter**  
- Search by **Title**, **Author**, or **ISBN**.  
- **Sort** by **Newest** or **Relevance**.  
- Advanced mobile filters with a **slide-up half-screen UI**, inspired by Amazon.  

### 📚 **Personal Library**  
- Add and remove books from your personal library.  
- Persistent storage using **Firebase Firestore**, accessible across devices.  

### 🔑 **Authentication**  
- Secure **Firebase Authentication** for user login and signup.  
- **Profile Management**:
  - View and update personal details (**Full Name**, **Country**, **State**, **Phone**, **Email**).  
  - **Avatar Integration** using **Dicebear API**.  
  - **Email.js** for sending feedback or queries.  
  - Secure **Password Update** feature.

### 🔗 **External Store Integration**  
- Direct purchase links to **Google Play Books**, **Amazon**, and **Flipkart**.  
- No in-platform price comparison; users are redirected to external stores.

### 📤 **Email Integration**  
- **Email.js** for sending user queries directly via email (not using Web3Forms).

---

## ⚙️ **Tech Stack**

| **Technology**     | **Purpose**                                     |
|--------------------|-------------------------------------------------|
| **React.js**        | Frontend framework for building the UI.         |
| **Firebase**        | Authentication and Firestore database.          |
| **Dicebear API**    | Generates profile avatars.                      |
| **Google Books API**| Fetches book details and search results.        |
| **Email.js**        | Sends contact form queries via email.           |
| **Vercel**          | Deployment platform for hosting.                |

---

## 🔌 **API Integrations**

| **API**             | **Usage**                                       |
|----------------------|-------------------------------------------------|
| **Google Books API** | Fetch book details (title, author, category).   |
| **Firebase**         | Store user data and library information.        |
| **Dicebear API**     | Generate random avatars for profile pictures.   |
| **Email.js**         | Send emails for contact forms.                  |

---

## 🛠️ **Environment Variables**

Create a **.env.local** file in the root of your project and include the following:

```env
# ✅ Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Important Notes:

-Ensure your .env.local file is included in your .gitignore to avoid accidentally pushing sensitive information to GitHub.

- In Vercel, add these environment variables through the dashboard for deployment.

## 🚀 **Getting Started**

### **Prerequisites**

- **Node.js** and **npm** installed on your system.
- Firebase account for backend services.
- Email.js account for contact form functionality.

### **Installation**

1. **Clone the repository**  
   ```bash
   git clone https://github.com/sujalB03/bookish.git
   ```
   
2. **Navigate to the project directory**
  ```bash
  cd bookish
  ```

3. **Install dependencies**
  ```bash
  npm install
  ```

4. **Create your .env.local file with necessary environment variables.**

5. **Start the development server**
  ```bash
  npm start
  ```


## 🚀 **Future Enhancements**

### 🔍 **1. Advanced Search Features**
- Add filters for **publication year**, **ratings**, and **price range**.

### 📚 **2. Categories**
- Create a dedicated **Categories** section to explore books by genre.

### 💳 **3. Payment Integration**
- Integrate payment gateways like **Stripe** or **Razorpay**.

### ⭐ **4. Favorites & Reviews**
- Enable users to **favorite** books and create a personal wishlist.
- Allow users to write and read **book reviews**.

### 🌙 **5. Dark Mode**
- Add a theme toggle for **light** and **dark** modes.

### 📱 **6. Mobile Responsiveness**
- Enhance mobile UI for a better user experience.

### 🔒 **7. Profile Enhancements**
- Add **social media login** options (Google, Facebook).

### 🏷️ **8. Notifications**
- Implement **email notifications** for successful purchases or updates.
- Add in-app notifications for profile updates and library changes.


---

✅ *Feel free to suggest additional features by opening an issue or a pull request!*  

