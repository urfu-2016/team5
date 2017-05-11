class CommentsPoster {
    constructor() {
        this.sendComment = this.sendComment.bind(this);
        this.getComments = this.getComments.bind(this);
        this.removeComment = this.removeComment.bind(this);
        this.likeComment = this.likeComment.bind(this);
        this.setSlug = this.setSlug.bind(this);
    }

    setSlug(slug) {
        this.slug = slug;
    }

    getComments() {
        return {
            url: `../api/comments/${this.slug}`,
            options: {
                method: 'GET',
                credentials: 'include'
            },
            parser: res => res.json()
        };
    }

    sendComment(text) {
        return {
            url: `../api/comments/${this.slug}`,
            options: {
                method: 'POST',
                body: JSON.stringify({text}),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }
        };
    }

    removeComment(id) {
        return {
            url: `../api/comments/${this.slug}/${id}`,
            options: {
                method: 'DELETE',
                credentials: 'include'
            }
        };
    }

    likeComment(id) {
        return {
            url: `../api/comments/${this.slug}/${id}/like`,
            options: {
                method: 'POST',
                credentials: 'include'
            }
        };
    }
}

module.exports = new CommentsPoster();
