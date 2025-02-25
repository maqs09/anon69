const express = require('express');
const fs = require('fs');


const app = express();
const cors = require("cors");
app.use(cors());
const PORT = 3000;
const DATA_FILE = 'posts.json';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Загружаем посты
const loadPosts = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE));
};

// Сохраняем посты
const savePosts = (posts) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
};

// Получаем все посты
app.get('/posts', (req, res) => {
    res.json(loadPosts());
});

// Добавляем новый пост
app.post('/posts', (req, res) => {
    let posts = loadPosts();
    const newPost = {
        id: Date.now(),
        text: req.body.text,
        comments: []
    };
    posts.push(newPost);
    savePosts(posts);
    res.json(newPost);
});

// Добавляем комментарий
app.post('/comments', (req, res) => {
    let posts = loadPosts();
    const { postId, text } = req.body;

    const post = posts.find(p => p.id === postId);
    if (!post) return res.status(404).json({ error: "Пост не найден" });

    post.comments.push({ text, id: Date.now() });
    savePosts(posts);
    res.json(post);
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});