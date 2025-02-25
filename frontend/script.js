const serverUrl = 'http://localhost:3000';

// Загружаем посты при загрузке страницы
async function loadPosts() {
    const response = await fetch(`${serverUrl}/posts`);
    const posts = await response.json();
    
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = '';

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <p>${post.text}</p>
            <input type="text" placeholder="Добавить комментарий" id="comment-${post.id}">
            <button onclick="addComment(${post.id})">Комментировать</button>
            <div id="comments-${post.id}">
                ${post.comments.map(c => `<p class="comment">${c.text}</p>`).join('')}
            </div>
        `;
        postsDiv.appendChild(postDiv);
    });
}

// Добавляем новый пост
async function addPost() {
    const text = document.getElementById('postInput').value;
    if (!text) return;

    await fetch(`${serverUrl}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });

    document.getElementById('postInput').value = '';
    loadPosts();
}

// Добавляем комментарий
async function addComment(postId) {
    const input = document.getElementById(`comment-${postId}`);
    const text = input.value;
    if (!text) return;

    await fetch(`${serverUrl}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, text })
    });

    input.value = '';
    loadPosts();
}

// Загружаем посты при старте
loadPosts();
