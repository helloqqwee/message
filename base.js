< !DOCTYPE html >
    <html lang="ru">
        <head>
            <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Мессенджер | Чат с другом</title>
                    <style>
                        * {margin: 0; padding: 0; box-sizing: border-box; }
                        body {
                            font - family: system-ui, -apple-system, sans-serif;
                        background: #0f0f10;
                        color: #eef2ff;
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
        }
                        .login-container, .chat-container {
                            background: #1c1c1e;
                        border-radius: 2rem;
                        padding: 2rem;
                        width: 400px;
                        max-width: 90%;
        }
                        .chat-container {
                            width: 900px;
                        max-width: 95%;
                        height: 85vh;
                        display: flex;
                        flex-direction: column;
        }
                        .messages {
                            flex: 1;
                        overflow-y: auto;
                        margin: 1rem 0;
                        padding: 0 1rem;
        }
                        .message {
                            margin: 8px 0;
                        padding: 10px 14px;
                        border-radius: 1.2rem;
                        max-width: 70%;
                        word-wrap: break-word;
        }
                        .message.outgoing {
                            background: #0a84ff;
                        margin-left: auto;
        }
                        .message.incoming {
                            background: #2c2c2e;
        }
                        .input-area {
                            display: flex;
                        gap: 10px;
                        padding: 1rem;
                        border-top: 1px solid #2c2c30;
        }
                        .input-area input {
                            flex: 1;
                        padding: 12px;
                        border-radius: 2rem;
                        border: none;
                        background: #2c2c2e;
                        color: white;
        }
                        button {
                            background: #0a84ff;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 2rem;
                        color: white;
                        cursor: pointer;
        }
                        input {
                            width: 100%;
                        padding: 12px;
                        margin: 8px 0;
                        border-radius: 1rem;
                        border: 1px solid #3a3a3c;
                        background: #0f0f10;
                        color: white;
        }
                        .online-users {
                            margin - top: 1rem;
                        padding: 1rem;
                        background: #2c2c2e;
                        border-radius: 1rem;
        }
                        .user-item {
                            padding: 8px;
                        cursor: pointer;
                        border-radius: 0.5rem;
        }
                        .user-item:hover {
                            background: #3a3a3c;
        }
                        .selected {
                            background: #0a84ff30;
                        border-left: 3px solid #0a84ff;
        }
                        .hidden {
                            display: none;
        }
                        .header {
                            display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 1rem;
        }
                        .chat-with {
                            padding: 0.5rem;
                        margin-bottom: 0.5rem;
                        border-bottom: 1px solid #2c2c30;
        }
                    </style>
                </head>
                <body>
                    <div id="loginContainer">
                        <div class="login-container">
                            <h2>🔐 Вход</h2>
                            <input type="email" id="loginEmail" placeholder="Email">
                                <input type="password" id="loginPassword" placeholder="Пароль">
                                    <button onclick="login()">Войти</button>
                                    <hr style="margin: 1rem 0;">
                                        <h2>📝 Регистрация</h2>
                                        <input type="text" id="regName" placeholder="Ваше имя">
                                            <input type="email" id="regEmail" placeholder="Email">
                                                <input type="password" id="regPassword" placeholder="Пароль">
                                                    <button onclick="register()">Создать аккаунт</button>
                                                </div>
                                            </div>

                                            <div id="chatContainer" class="hidden chat-container">
                                                <div class="header">
                                                    <h2>📱 Мессенджер</h2>
                                                    <div>
                                                        <span id="currentUserName"></span>
                                                        <button onclick="logout()" style="margin-left: 1rem; background: #ff3b30;">🚪 Выйти</button>
                                                    </div>
                                                </div>
                                                <div style="display: flex; gap: 1rem; flex: 1; min-height: 0;">
                                                    <div style="width: 250px; display: flex; flex-direction: column;">
                                                        <div class="online-users" style="flex: 1; overflow-y: auto;">
                                                            <h4>👥 Пользователи:</h4>
                                                            <div id="usersList"></div>
                                                        </div>
                                                    </div>
                                                    <div style="flex: 1; display: flex; flex-direction: column;">
                                                        <div class="chat-with" id="chatHeader">💬 Выберите друга для чата</div>
                                                        <div class="messages" id="messagesContainer"></div>
                                                        <div class="input-area">
                                                            <input type="text" id="messageInput" placeholder="сообщение..." onkeypress="if(event.key==='Enter') sendMessage()">
                                                                <button onclick="sendMessage()">Отправить</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <script type="module">
        // ВАША КОНФИГУРАЦИЯ FIREBASE (то, что вы получили)
                                                const firebaseConfig = {
                                                    apiKey: "AIzaSyBzincDq0G49TbmmPulB3QFka5oak-xaJE",
                                                authDomain: "zagulskoe.firebaseapp.com",
                                                projectId: "zagulskoe",
                                                storageBucket: "zagulskoe.firebasestorage.app",
                                                messagingSenderId: "1085814530284",
                                                appId: "1:1085814530284:web:8bf8d0a790e8936d9705c9",
                                                measurementId: "G-13BZPCMLFP"
        };

                                                // Импортируем Firebase
                                                import {initializeApp} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
                                                import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
                                                import {getFirestore, collection, addDoc, query, orderBy, onSnapshot, where, getDocs, updateDoc, doc, setDoc} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

                                                // Инициализация
                                                const app = initializeApp(firebaseConfig);
                                                const auth = getAuth(app);
                                                const db = getFirestore(app);

                                                let currentUser = null;
                                                let selectedFriend = null;

        // Регистрация
        window.register = async () => {
            const name = document.getElementById('regName').value;
                                                const email = document.getElementById('regEmail').value;
                                                const password = document.getElementById('regPassword').value;

                                                if (!name || !email || !password) {
                                                    alert('❌ Заполните все поля!');
                                                return;
            }

                                                try {
                const userCred = await createUserWithEmailAndPassword(auth, email, password);
                                                // Сохраняем данные пользователя
                                                await setDoc(doc(db, 'users', userCred.user.uid), {
                                                    uid: userCred.user.uid,
                                                name: name,
                                                email: email,
                                                online: true
                });
                                                alert('✅ Аккаунт создан! Теперь войдите.');
                                                document.getElementById('regName').value = '';
                                                document.getElementById('regEmail').value = '';
                                                document.getElementById('regPassword').value = '';
            } catch (e) {
                if (e.code === 'auth/email-already-in-use') {
                                                    alert('❌ Этот email уже зарегистрирован!');
                } else {
                                                    alert('❌ Ошибка: ' + e.message);
                }
            }
        };

        // Вход
        window.login = async () => {
            const email = document.getElementById('loginEmail').value;
                                                const password = document.getElementById('loginPassword').value;

                                                if (!email || !password) {
                                                    alert('❌ Введите email и пароль!');
                                                return;
            }

                                                try {
                                                    await signInWithEmailAndPassword(auth, email, password);
            } catch (e) {
                                                    alert('❌ Неверный email или пароль');
            }
        };

        // Выход
        window.logout = async () => {
            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);
                                                await updateDoc(userRef, {online: false });
            }
                                                await signOut(auth);
                                                document.getElementById('loginContainer').classList.remove('hidden');
                                                document.getElementById('chatContainer').classList.add('hidden');
                                                selectedFriend = null;
        };

        // Отправка сообщения
        window.sendMessage = async () => {
            const input = document.getElementById('messageInput');
                                                const text = input.value.trim();
                                                if (!text || !selectedFriend) {
                if (!selectedFriend) alert('Сначала выберите друга для чата!');
                                                return;
            }
                                                try {
                                                    await addDoc(collection(db, 'messages'), {
                                                        from: currentUser.uid,
                                                        to: selectedFriend.uid,
                                                        text: text,
                                                        timestamp: Date.now()
                                                    });
                                                input.value = '';
            } catch (e) {
                                                    console.error('Ошибка отправки:', e);
            }
        };

                                                // Загрузка списка пользователей
                                                async function loadUsers() {
            if (!currentUser) return;

                                                const usersList = document.getElementById('usersList');

            // Подписываемся на изменения пользователей в реальном времени
            onSnapshot(collection(db, 'users'), (snapshot) => {
                                                    usersList.innerHTML = '';
                                                const users = [];
                snapshot.forEach(docSnap => {
                    const user = docSnap.data();
                                                if (user.uid !== currentUser.uid) {
                                                    users.push(user);
                    }
                });

                                                if (users.length === 0) {
                                                    usersList.innerHTML = '<p style="color: #98989e;">Нет других пользователей</p>';
                }
                
                users.forEach(user => {
                    const div = document.createElement('div');
                                                div.className = `user-item ${selectedFriend?.uid === user.uid ? 'selected' : ''}`;
                                                div.innerHTML = `${user.name} ${user.online ? '🟢' : '⚪'}`;
                    div.onclick = () => {
                                                    selectedFriend = user;
                                                document.getElementById('chatHeader').innerHTML = `💬 Чат с ${user.name} ${user.online ? '(в сети)' : '(не в сети)'}`;
                                                loadMessages();
                                                loadUsers(); // обновить выделение
                    };
                                                usersList.appendChild(div);
                });
            });
        }

                                                // Загрузка сообщений
                                                function loadMessages() {
            if (!selectedFriend || !currentUser) return;

                                                const q = query(collection(db, 'messages'), orderBy('timestamp'));
            onSnapshot(q, (snapshot) => {
                const container = document.getElementById('messagesContainer');
                                                container.innerHTML = '';
                                                let hasMessages = false;
                
                snapshot.forEach(docSnap => {
                    const msg = docSnap.data();
                                                if ((msg.from === currentUser.uid && msg.to === selectedFriend.uid) ||
                                                (msg.from === selectedFriend.uid && msg.to === currentUser.uid)) {
                                                    hasMessages = true;
                                                const div = document.createElement('div');
                                                div.className = `message ${msg.from === currentUser.uid ? 'outgoing' : 'incoming'}`;
                                                div.innerHTML = msg.text;
                                                container.appendChild(div);
                    }
                });

                                                if (!hasMessages) {
                                                    container.innerHTML = '<div style="text-align: center; color: #6c6c70; padding: 40px;">💬 Напишите первое сообщение!</div>';
                }
                                                container.scrollTop = container.scrollHeight;
            });
        }

        // Отслеживание статуса авторизации
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                                                    currentUser = user;

                                                // Проверяем, есть ли пользователь в базе
                                                const userRef = doc(db, 'users', user.uid);
                                                const userSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));

                                                if (userSnap.empty) {
                                                    // Если новый пользователь, создаём запись
                                                    await setDoc(doc(db, 'users', user.uid), {
                                                        uid: user.uid,
                                                        name: user.email.split('@')[0],
                                                        email: user.email,
                                                        online: true
                                                    });
                } else {
                                                    // Обновляем статус онлайн
                                                    await updateDoc(doc(db, 'users', user.uid), { online: true });
                }

                                                document.getElementById('loginContainer').classList.add('hidden');
                                                document.getElementById('chatContainer').classList.remove('hidden');
                                                document.getElementById('currentUserName').innerText = user.email.split('@')[0];
                                                loadUsers();
            } else {
                                                    currentUser = null;
                                                selectedFriend = null;
                                                document.getElementById('loginContainer').classList.remove('hidden');
                                                document.getElementById('chatContainer').classList.add('hidden');
            }
        });

        // Обработка закрытия страницы
        window.addEventListener('beforeunload', async () => {
            if (currentUser) {
                try {
                                                    await updateDoc(doc(db, 'users', currentUser.uid), { online: false });
                } catch(e) { }
            }
        });
                                            </script>
                                        </body>
                                    </html>